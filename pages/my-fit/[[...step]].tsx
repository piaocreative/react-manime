import { SET_KEY_VALUE, SET_PROFILE_KEY_VALUE } from 'actions';
import classNames from 'classnames';
import AuthWallHOC from 'components/AuthWallHOC';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import DesktopTransfer from 'components/fitting/desktopTransfer';
import {
  CollectionSequence,
  FitType,
  getDefaultStepSequence,
  getDefaultStepsKeys,
  KeyedPhotoMeta,
  PhotoStatus,
  StepEnum,
} from 'components/fitting/guided/config';
import Instructions from 'components/fitting/guided/Instructions';
import ScanController from 'components/fitting/guided/scan/Controller';
import { buildPhotosMeta, buildStepSequence } from 'components/fitting/guided/utils';
import Validation from 'components/fitting/guided/Validation';
import MobilePrescan from 'components/fitting/mani/mobile/PreScan';
import Success from 'components/fitting/mani/mobile/Success';
import { Case, Switch } from 'components/switch';
import { withRouter } from 'next/router';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import style from 'static/components/fitting/mani/fittingProcess.module.css';
import { StepSequence, StepState } from 'types';
import { experiments } from 'utils/abTest';
import { closeCamera, getFitVersion, getLotteryOverride } from 'utils/camera';
import { isMobileDevice } from 'utils/device';
import { pageLinks } from 'utils/links';
import { setItemToLocalStorage } from 'utils/localStorageHelpers';
import log from 'utils/logging';
import { uploadFittingPicture } from 'utils/profileData';
import { track as _track } from 'utils/track';

const IMAGE_KEY_MAP = new Map();
IMAGE_KEY_MAP.set('leftFingers', 'image_1');
IMAGE_KEY_MAP.set('leftThumb', 'image_2');
IMAGE_KEY_MAP.set('rightFingers', 'image_3');
IMAGE_KEY_MAP.set('rightThumb', 'image_4');
IMAGE_KEY_MAP.set('side', 'image_5');

enum Orientaiton {
  PORTRAIT,
  LANDSCAPE,
}
enum DeviceType {
  DESKTOP,
  MOBILE,
}

type Props = {
  profiles;
  email;
  phoneNumber;
  router;
  dispatchSetProfileKeyValue: Function;
  dispatch: Function;
  camera:
    | {
        width: number;
        height: number;
        stream: any;
        hasStablization: boolean;
      }
    | undefined;
  globalProps: any;
};
type State = {
  photoStepSequence: StepSequence; // used for deciding what steps to do during tailoring
  photosMeta: KeyedPhotoMeta; // details about the photos captured already or photos as they are being captured.
  flag: boolean;
  error: undefined | string;
  loading: boolean;
  currentStep: StepState;
  orientation: Orientaiton;
  deviceType: DeviceType;
  skippable: boolean;
  returnUrl: string | undefined;
  isMounted: boolean;
  isMounting: boolean;
  timer?: any;
  forceUpdate: number;
  skipValidation: boolean;
};

function track(message, data = undefined) {
  _track(`[MyFit]${message}`, data);
}
class FittingProcess extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      photoStepSequence: undefined,
      photosMeta: undefined,
      loading: false,
      returnUrl: undefined,
      flag: false,
      error: '',
      isMounted: false,
      isMounting: false,
      skippable: false,
      deviceType: DeviceType.MOBILE,
      currentStep: CollectionSequence.steps[CollectionSequence.start],
      orientation: Orientaiton.LANDSCAPE,
      timer: new Date(),
      forceUpdate: 0,
      skipValidation: true,
    };

    this.instructionsCallBack.bind(this);
  }

  goToOldFlow() {
    this.props.router.replace(
      {
        pathname: `${pageLinks.ManiFitting.url}`,
        query: this.props.router.query,
      },
      {
        pathname: `${pageLinks.ManiFitting.url}`,
        query: this.props.router.query,
      }
    );
  }
  retakeCallback(stepKey) {
    const fitType = this.getFitType();
    track('[retakeCallback]', { stepKey, fitType });
    const defaultSequence = getDefaultStepSequence(fitType);
    const step = defaultSequence.steps[stepKey];
    step.next = undefined;
    step.previous = undefined;
    step.meta.guidance.description = '';
    const retakeSequence: StepSequence = {
      start: stepKey,
      steps: { [stepKey]: step },
      meta: { hideSteps: false },
    };

    this.setState({ photoStepSequence: retakeSequence });
    this.nextPage(StepEnum.SCAN);
  }

  getFitType() {
    const fitType = this.props.router.query?.step?.[0];

    if (![FitType.MANIS.toLowerCase(), FitType.PEDIS.toLowerCase()].includes(fitType)) {
      return undefined;
    } else {
      return capFirstLetter(fitType);
    }
  }
  rotate(event) {
    let el = document.getElementById('fittingFrame');
    const angle = event.target['orientation'];
    this.setState({
      orientation: angle === 0 ? Orientaiton.PORTRAIT : Orientaiton.LANDSCAPE,
    });
  }

  async componentDidMount() {
    track('[mount][enter]');

    // don't need to check the return as it will set the active variant of the
    // lottery.
    const override = this.props.router.asPath.match(/[?&]override=([^&]+).*$/);

    const fitVersionOverride = (override && override.length > 1 && override[1]) || undefined;
    if (fitVersionOverride !== undefined) {
      if (fitVersionOverride === 'reset') {
        setItemToLocalStorage('fitVersionOverride', undefined);
      } else {
        setItemToLocalStorage('fitVersionOverride', fitVersionOverride);
      }
    }
    let activeVariant = getFitVersion();
    const lotteryOverride = getLotteryOverride();

    // TODO: this is brittle code - depending on the order of variants in A/B experiment
    // if (activeVariant === experiments.fitting.variantNames[1]) {
    if (true) {
      //alert('[flowDecision]' + JSON.stringify({activeVariant, reason: 'lost lottery'}))
      track('[flowDecision]', { activeVariant, reason: 'lost lottery' });
      log.info('[flowDecision]', { activeVariant, reason: 'lost lottery' });
      this.goToOldFlow();
      this.setState({ isMounting: true });
      return;
    } else if (lotteryOverride && activeVariant === experiments.fitting.variantNames[0]) {
      activeVariant = experiments.fitting.variantNames[1];
      //alert('[flowDecision]' + JSON.stringify({activeVariant, reason: lotteryOverride}))
      track('[flowDecision]', { activeVariant, reason: lotteryOverride });
      log.info('[flowDecision]', { activeVariant, reason: lotteryOverride });
      this.goToOldFlow();
      this.setState({ isMounting: true });
      return;
    }

    window.addEventListener('orientationchange', this.rotate.bind(this));
    let returnUrl = this.props.router?.query?.returnUrl;
    let skippable = this.props.router?.query?.skippable === 'true';

    this.setState({ forceUpdate: this.state.forceUpdate + 1, returnUrl, skippable });
    track('[mount][done]', { forceUpdate: this.state.forceUpdate + 1, returnUrl, skippable });
    this.resizeInit();
  }

  async componentDidUpdate(prevProps) {
    if (this.state.isMounting) {
      return;
    }

    const deviceType = this.getDeviceType();

    const step = this.props.router.query?.step?.[1];
    const fitType = this.getFitType();

    if (deviceType === DeviceType.DESKTOP && step !== StepEnum.DESKTOP) {
      this.setState({ isMounted: true, skipValidation: true });
      this.nextPage(StepEnum.DESKTOP, 'replace');
      track('[update]transfer to desktop');

      return;
    }

    if (!step) {
      const root = this.props.router.route.substring(0, this.props.router.route.lastIndexOf('/'));
      this.nextPage(StepEnum.INSTRUCTIONS, 'replace');

      return;
    }
    /*
        if(step !== this.state.currentStep){
    
          let photosMeta = undefined
          if(step === StepEnum.VALIDATE){
            photosMeta = await buildPhotosMeta(fitType, this.props.profiles);
    
          }
          const state = {
            currentStep: step
          };
          if(photosMeta){
            state['photosMeta'] = photosMeta
          }
          this.setState(state)
        }
    */
    if (this.props.profiles.length > 0 && !this.state.isMounted) {
      this.setState({ isMounting: true });

      const now = new Date();
      const newState = {} as any;
      const checkoutTrigger = this.props.router.query?.transitionTrigger === 'checkout';

      const keyList = getDefaultStepsKeys(fitType);

      const photosMeta = await buildPhotosMeta(fitType, this.props.profiles);

      const stepSequence = await buildStepSequence(fitType, photosMeta);
      this.setState({
        photosMeta,
        photoStepSequence: stepSequence,
        deviceType,
        isMounted: true,
        isMounting: false,
      });
      const root = this.props.router.route.substring(0, this.props.router.route.lastIndexOf('/'));

      if (Object.keys(stepSequence.steps).length === 0) {
        // if theres nothing in the step sequence then all photos are uploaded and no current issues so just validate
        this.nextPage(StepEnum.INSTRUCTIONS, 'replace');
      } else if (stepSequence.meta.hideSteps) {
        // if hidesteps is true then it's not new, so we want to skip to the first finger
        this.nextPage(StepEnum.SCAN, 'replace');
      } else {
        this.nextPage(CollectionSequence.start, 'replace');
      }
    }
  }

  resizeInit = async () => {
    window.addEventListener('resize', this.handleResize);
  };

  async photosMetaCallback(photoMeta) {
    //  this.setState({ phophotoMeta });

    const { smallImage, hasMore } = photoMeta;

    if (!hasMore) {
      this.nextPage();
      track('[upload]end of collection');
    }
    if (photoMeta.uploadImage) {
      const { step, largeImage, userId, fileType, version } = photoMeta.uploadImage;

      const fileName = `${step}${version === 1 ? '' : '.' + version}`;

      this.state.photosMeta[step].status = PhotoStatus.UPLOADING;
      this.state.photosMeta[step].url = smallImage;
      this.state.photosMeta[step].version = version;
      //   this.setState({photosMeta: this.state.photosMeta})
      try {
        // if pohoto collection reports done, then go to validation
        const fitType = this.getFitType();
        const profile = this.props.profiles.find(profile => profile.profileType === fitType);
        track('[uploadPhotos]', {
          fitType,
          profile,
          step,
          version,
        });
        const result = await uploadFittingPicture({
          step,
          fileName,
          file: largeImage,
          fileType,
          profile,
          version,
        });
        this.props.dispatchSetProfileKeyValue(
          profile.profileId,
          result.versionCamel,
          result.versionValue
        );
        this.props.dispatchSetProfileKeyValue(profile.profileId, result.statusCamel, true);

        this.state.photosMeta[step].status = PhotoStatus.PENDING;
        this.setState({ photosMeta: { ...this.state.photosMeta } });

        //
      } catch (error) {
        track('[uploadPhotos]upload error', {
          error,
        });
        alert(error);
      } finally {
        /*   setUploadStatus({...temp})
           if(!stepSequence.steps[step].next){
             uploadStatusCallback({...temp})
           } */
      }
    }
  }

  nextPage = (step = undefined, type = 'push') => {
    const _step = this.props.router.query?.step?.[1] || this.state.photoStepSequence?.start;
    const root = this.props.router.route.substring(0, this.props.router.route.lastIndexOf('/'));
    const fitType = this.getFitType();

    if (typeof step === 'string') {
      this.props.router[type](
        {
          pathname: `${root}/${fitType?.toLowerCase()}/${step}`,
        },
        {
          pathname: `${root}/${fitType?.toLowerCase()}/${step}`,
        },
        { shallow: true }
      );
      return;
    } else if (CollectionSequence.steps[_step].next) {
      this.props.router.push(
        {
          pathname: `${root}/${fitType.toLowerCase()}/${CollectionSequence.steps[_step].next}`,
        },
        {
          pathname: `${root}/${fitType.toLowerCase()}/${CollectionSequence.steps[_step].next}`,
        }
      );
      return;
    }
  };

  prevPage = ev => {};

  getDeviceType = (): DeviceType => {
    if (isMobileDevice()) {
      return DeviceType.MOBILE;
    } else {
      return DeviceType.DESKTOP;
    }
  };

  handleResize = async () => {
    const deviceType = this.getDeviceType();
    this.setState({ deviceType });
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    closeCamera(this.props.camera, this.props.dispatch);
    track('[unmount]close camera');
  }

  picsCallback({ sequenceResults, uploadStatus }) {
    this.setState({});
    this.nextPage();
  }

  /**
   * Call back from instructions ... this component will ititate the request for camera access
   * and return the maxCameraDimensions if access is granted
   * @param result undefined means user did not grant camera access. Otherwise it is  {width, height}
   */
  instructionsCallBack(result) {
    const fitType = this.getFitType();
    const root = this.props.router.route.substring(0, this.props.router.route.lastIndexOf('/'));
    if (result) {
      if (result === 'skip') {
        this.props.router.push({
          pathname: `${this.state.returnUrl}`,
        });
        track('[instructionsCallback] skip fit flow');
        return null;
      }
      // alert('closing the camera ')
      //  closeCamera(result, this.props.dispatch)
      if (!result.hasStablization) {
        const activeVariant = experiments.fitting.variantNames[1];
        //alert('[flowDecision]' + JSON.stringify({activeVariant, reason: 'cameraRez'}))
        track('[flowDecision]', { activeVariant, reason: 'cameraRez' });
        log.info('[flowDecision]', { activeVariant, reason: 'cameraRez' });
        closeCamera(result, this.props.dispatch);
        this.goToOldFlow();
        return;
      } else {
        const activeVariant = experiments.fitting.variantNames[0];
        //alert('[flowDecision]' + JSON.stringify({activeVariant, reason: 'winner'}))
        track('[flowDecision]', { activeVariant, reason: 'winner' });
        log.info('[flowDecision]', { activeVariant, reason: 'winner' });
      }
      //   this.setState({ camera: result })
      if (Object.keys(this.state.photoStepSequence.steps).length === 0) {
        this.nextPage(StepEnum.VALIDATE);
      } else {
        this.nextPage();
      }
    } else {
      const activeVariant = experiments.fitting.variantNames[1];
      //alert('[flowDecision]' + JSON.stringify({activeVariant, reason: 'user denied'}))
      log.info('[flowDecision]', { activeVariant, reason: 'user deined' });
      track('[flowDecision]', { activeVariant, reason: 'user deined' });
      this.goToOldFlow();
    }
  }

  validationCallback() {
    track('[validationCallback] validation done');
    if (this.state.returnUrl) {
      this.props.router.push({
        pathname: this.state.returnUrl,
      });
    } else {
      this.props.router.push({
        pathname: pageLinks.SetupDesign.url,
      });
    }
  }

  uploadStatusCallback({ uploadStatus }) {
    this.setState({});
  }

  render() {
    // if these values aren't set then it's still initializing
    if (
      !this.state.skipValidation &&
      (!this.state.photoStepSequence || !this.state.photosMeta || !this.props.email)
    ) {
      return null;
    }

    const currentStep =
      this.props.router?.query?.step?.[1] || this.state.photoStepSequence?.start || '';

    const fitType = this.getFitType();
    if (!fitType) {
      const root = this.props.router.route.substring(0, this.props.router.route.lastIndexOf('/'));
      this.props.router.replace(
        {
          pathname: `${root}/${FitType.MANIS.toLowerCase()}`,
        },
        {
          pathname: `${root}/${FitType.MANIS.toLowerCase()}`,
        },
        { shallow: true }
      );
      return null;
    }

    return (
      <div
        className={classNames(style.mainFitContainer, style.mobileFitContainer)}
        id="fittingFrame"
      >
        <Switch active={currentStep} isMounted={this.state.isMounted}>
          <Case name={''}></Case>
          <Case name={StepEnum.SIGNUP}>
            <MobilePrescan nextButton={this.nextPage} />
          </Case>
          <Case name={StepEnum.INSTRUCTIONS}>
            <Instructions
              nextButton={this.instructionsCallBack.bind(this)}
              returnUrl={this.state.returnUrl}
              skippable={this.state.skippable}
            />
          </Case>
          <Case name={StepEnum.SCAN}>
            <ScanController
              track={track}
              stepSequence={this.state.photoStepSequence}
              photosMeta={this.state.photosMeta}
              photosMetaCallback={this.photosMetaCallback.bind(this)}
            />
          </Case>
          <Case name={StepEnum.VALIDATE}>
            <Validation
              currentPicsMeta={this.state.photosMeta}
              retakeCallback={this.retakeCallback.bind(this)}
              fitType={fitType}
              doneCallback={this.validationCallback.bind(this)}
            />
          </Case>
          <Case name={StepEnum.SUCCESS}>
            <Success availableSteps={undefined} />
          </Case>
          <Case name={StepEnum.DESKTOP}>
            <DesktopTransfer
              email={this.props.email}
              phoneNumber={this.props.phoneNumber}
              targetUrl={pageLinks.ManiGuided.url}
            />
          </Case>
          <Case name={StepEnum.LOADING}>
            <div></div>
          </Case>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  email: state.userData.email,
  phoneNumber: state.userData.phoneNumber,
  profiles: state.profileData.profiles || [],
  camera: state.cameraData.camera,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetKeyValue: (key, value) => dispatch(SET_KEY_VALUE(key, value)),
  dispatchSetProfileKeyValue: (profileId, key, value) =>
    dispatch(SET_PROFILE_KEY_VALUE(profileId, key, value)),
  dispatch: dispatch,
});

const _Fitting = ManimeStandardContainer(
  AuthWallHOC(withRouter(connect(mapStateToProps, mapDispatchToProps)(FittingProcess))),
  true
);

function capFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default _Fitting;
export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps = async props => await getGlobalProps();
