import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Router from 'next/router';
import { Storage } from '@aws-amplify/storage';
import Compressor from 'compressorjs';
import { connect } from 'react-redux';
import MobilePrescan from 'components/fitting/mani/mobile/PreScan';
import MobilePrepare from 'components/fitting/mani/mobile/Prepare';
import MobileFinger from 'components/fitting/mani/mobile/Finger';
import Success from 'components/fitting/mani/mobile/Success';
import Validation from 'components/fitting/mani/mobile/Validation';
import log from 'utils/logging'
import DesktopTransfer from 'components/fitting/desktopTransfer';
import AuthWallHOC from 'components/AuthWallHOC'

import { track, trackFunnelActionProjectFunnel } from 'utils/track';
import { isEmpty } from 'utils/validation';

import { editProfile } from 'api/profile';
import { compressImage } from 'api/util';

import { SET_KEY_VALUE, SET_PROFILE_KEY_VALUE } from 'actions';
import style from '@styles/fitting/mani/fittingProcess.module.css';
import { scrollToTop } from 'utils/scroll';
import axios from 'axios';

const IMAGE_KEY_MAP = new Map();
IMAGE_KEY_MAP.set('leftFingers', 'image_1');
IMAGE_KEY_MAP.set('leftThumb', 'image_2');
IMAGE_KEY_MAP.set('rightFingers', 'image_3');
IMAGE_KEY_MAP.set('rightThumb', 'image_4');
IMAGE_KEY_MAP.set('side', 'image_5');

const KEY_MAP = [
  {
    camelCase: 'leftFingers',
    statusCamel: 'statusLeftFingers',
    versionLower: 'versionleftfingers',
    versionCamel: 'versionLeftFingers',
    stateImageKey: 'image_1'
  },
  {
    camelCase: 'leftThumb',
    statusCamel: 'statusLeftThumb',
    versionLower: 'versionleftthumb',
    versionCamel: 'versionLeftThumb',
    stateImageKey: 'image_2'
  },
  {
    camelCase: 'rightFingers',
    statusCamel: 'statusRightFingers',
    versionLower: 'versionrightfingers',
    versionCamel: 'versionRightFingers',
    stateImageKey: 'image_3'
  },
  {
    camelCase: 'rightThumb',
    statusCamel: 'statusRightThumb',
    versionLower: 'versionrightthumb',
    versionCamel: 'versionRightThumb',
    stateImageKey: 'image_4'
  },
  {
    camelCase: 'side',
    statusCamel: 'statusSide',
    versionLower: 'versionside',
    versionCamel: 'versionSide',
    stateImageKey: 'image_5'
  }
];

const VERTICAL = 'vertical';
const HORIZONTAL = 'horizontal'

class FittingProcess extends PureComponent <any, any> {
  constructor(props) {
    super(props);
    this.state = {
      desktopStep: 0,
      currentStep : undefined,
      stepDirection: VERTICAL,
      image_1: '',
      image_2: '',
      image_3: '',
      image_4: '',
      image_5: '',
      loading: false,
      flag: false,
      error: '',
      availableSteps: [],
      // NOTE: this is the value we use to navigate
      availableStepIndex: -1
    }
  }

  async componentDidMount() {
    // clearImageStatuses(this.props.userData.identityId);
    const { image_1, image_2, image_3, image_4, image_5, ...stateRemovedImages } = this.state;
    const { userData } = this.props;

    if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      track('[FitFlow][Mobile] Start Fitting');
    } else {
      track('[FitFlow][Desktop] Transfer to Mobile');
    }


    const transtionTrigger = !!Router.router.query?.transitionTrigger;
    if (transtionTrigger) {
      this.setState({
        currentStep: -2,
        firstStep: -2
      });
    } else {
      this.setState({
        currentStep: -3,
        firstStep: -3
      });
    }

    await this.resizeInit();
    if (!isEmpty(this.props.myProfile)) {
      this.setAvailableFlowBasedOnStatuses(true);
      this.loadImages([0,1,2,3,4]);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentStep != this.state.currentStep) {
      // trackFunnelAction(`A. Fit Flow Step: ${this.state.currentStep}`);
      trackFunnelActionProjectFunnel(`A. Fit Flow Step: ${this.state.currentStep}`, { profileType: 'Manis', isNewManiFitting: true});
    }
    if (prevProps.myProfile !== this.props.myProfile && isEmpty(prevProps.myProfile) && !isEmpty(this.props.myProfile)) {
      this.setAvailableFlowBasedOnStatuses(true)
      this.loadImages([0,1,2,3,4]);
    }
  }

  resizeInit = async () => {
    await this.handleResize();
    window.addEventListener("resize", this.handleResize);
  }

  // NOTE: this will set a user to the picture they last left off and will differentiate new users from old users via the versionleftfingers
  // NOTE: for example, a first time user and a user retaking all pictures will see a different first page
  initPage = (isStart) => {
    if (!this.props.myProfile.versionLeftFingers) return;

    const { currentStep, availableSteps, availableStepIndex } = this.state;
    if (availableSteps.length == 0 || availableStepIndex >= availableSteps.length - 1) {
      this.setState({
        currentStep: 5,
        availableStepIndex: availableStepIndex + 1
      })
    } else {
      const nextAvailableStepIndex = availableStepIndex + 1;
      this.setState({
        currentStep: availableSteps[nextAvailableStepIndex],
        availableStepIndex: nextAvailableStepIndex
      })
    }
  }

  // NOTE: availableSteps are the specific fingers the user is allowed to upload, if [0,1], user only uploads leftFinger and leftThumb and then they are done
  setAvailableFlowBasedOnStatuses = (isStart) => {
    const {
      statusLeftFingers,
      statusLeftThumb,
      statusRightFingers,
      statusRightThumb,
      statusSide
    } = this.props.myProfile;

    let availableSteps = [];
    if (!statusLeftFingers) availableSteps.push(0);
    if (!statusLeftThumb) availableSteps.push(1);
    if (!statusRightFingers) availableSteps.push(2);
    if (!statusRightThumb) availableSteps.push(3);
    if (!statusSide) availableSteps.push(4);

    // this.loadImages(this.state.stepDirection !== VERTICAL ? [0,1,2,3,4] : availableSteps);

    this.setState({ availableSteps }, () => {
      this.initPage(isStart);
    });
    // NOTE: [], [0], [0, 1], [0, 1, 3], [0, 1, 4]
  }

  getNextFingerToUpload = () => {
    const {
      statusLeftFingers,
      statusLeftThumb,
      statusRightFingers,
      statusRightThumb,
      statusSide
    } = this.props.myProfile; // this.props.userData;
    if (!statusLeftFingers) return 0;
    if (!statusLeftThumb) return 1;
    if (!statusRightFingers) return 2;
    if (!statusRightThumb) return 3;
    if (!statusSide) return 4;
  }

  loadImages = async availableSteps => {
    const isDefaultProfile = (this.props.myProfile || {}).isDefault;
    // NOTE: display images if in availableSteps and status in rds is valid, otherwise don't display

    const {
      statusLeftFingers,
      statusLeftThumb,
      statusRightFingers,
      statusRightThumb,
      statusSide,
      versionLeftFingers,
      versionLeftThumb,
      versionRightFingers,
      versionRightThumb,
      versionSide,
      profileId
    } = this.props.myProfile;

    const leftFingersKey = versionLeftFingers && versionLeftFingers > 1 ? `leftFingers.${versionLeftFingers}` : `leftFingers`;
    const leftThumbKey = versionLeftThumb && versionLeftThumb > 1 ? `leftThumb.${versionLeftThumb}` : `leftThumb`;
    const rightFingersKey = versionRightFingers && versionRightFingers > 1 ? `rightFingers.${versionRightFingers}` : `rightFingers`;
    const rightThumbKey = versionRightThumb && versionRightThumb > 1 ? `rightThumb.${versionRightThumb}` : `rightThumb`;
    const sideKey = versionSide && versionSide > 1 ? `side.${versionSide}` : `side`;

    let imageKeys = ['', '', '', '', ''];

    const folder = isDefaultProfile ? '': `${profileId}/`;
    try {
      const list = await Storage.list(folder, {level: 'private'});
      list.map(element => {
        if (element.key.includes(`${folder}${leftFingersKey}`)) imageKeys[0] = element.key;
        if (element.key.includes(`${folder}${leftThumbKey}`)) imageKeys[1] = element.key;
        if (element.key.includes(`${folder}${rightFingersKey}`)) imageKeys[2] = element.key;
        if (element.key.includes(`${folder}${rightThumbKey}`)) imageKeys[3] = element.key;
        if (element.key.includes(`${folder}${sideKey}`)) imageKeys[4] = element.key;
      });

    } catch (err) {
       log.error('[fitting] Error listing ' + err, {err});
    }

    // NOTE: map over availableSteps and if the associated status is false, don't load the image
    availableSteps.map(index => {
      const imageKey = imageKeys[index];
      // imageKeys.map((imageKey, index) => {
        // check in redux state before pulling...
        if (index == 0 && !statusLeftFingers) return;
        if (index == 1 && !statusLeftThumb) return;
        if (index == 2 && !statusRightFingers) return;
        if (index == 3 && !statusRightThumb) return;
        if (index == 4 && !statusSide) return;

        // NOTE: investigate
        Storage.get(imageKey, { level: 'private' })
        .then(result => {
          this.setState({ [KEY_MAP[index].stateImageKey]: result });
        })
        .catch(err => {
          log.error('[fitting] Storage.get() inside load images', { err } );
        });
      // })
    })
  }

  // // NOTE: initial state is either before, after, or one of the availableSteps
  nextPageDesktopFlow = () => {
    const { desktopStep } = this.state;
    this.setState({
      desktopStep: desktopStep + 1
    });
  }

  nextPageBasedOnPreScan = () => {
    this.setState({
      currentStep: -2
    });
  }
  initiateChangePage = () => {
    const { currentStep, availableSteps, availableStepIndex } = this.state;
    this.setState({ error: '' });
    scrollToTop();
    track(`User clicked next page.`, null, this.props.userData, { customObj: availableSteps, availableStepIndex, currentStep});
  }

  nextPageBasedOnFlow = ev => {
    if (isEmpty(this.props.myProfile)) {
      return;
    }
    this.initiateChangePage();
    const { currentStep, availableSteps, availableStepIndex } = this.state;

    if (availableSteps.length == 0 || availableStepIndex >= availableSteps.length - 1) {
      this.setState({
        currentStep: 5,
        availableStepIndex: availableStepIndex + 1
      })
    } else {
      const nextAvailableStepIndex = availableStepIndex + 1;
      this.setState({
        currentStep: availableSteps[nextAvailableStepIndex],
        availableStepIndex: nextAvailableStepIndex
      })
    }

  }

  prevPageBasedOnFlow = ev => {
    this.initiateChangePage();
    const { currentStep, availableSteps, availableStepIndex, firstStep } = this.state;

    if (availableSteps.length == 0 || availableStepIndex <= 0) {
      this.setState({
        currentStep: firstStep,
        availableStepIndex: -1
      })
    } else {
      const prevAvailableStepIndex = availableStepIndex - 1;
      this.setState({
        currentStep: availableSteps[prevAvailableStepIndex],
        availableStepIndex: prevAvailableStepIndex
      })
    }
  }

  // input  -> a file
  // output -> change status of uploaded finger in redux
  onDrop = async (acceptedFiles, rejectedFiles, fileName) => {
    // NOTE: get the associated object for the filename
    const myProfile = this.props.myProfile;
    let index = -1;
    KEY_MAP.map((item, i) => {
      if (item.camelCase == fileName) index = i;
    });
    const keyObject = KEY_MAP[index];

    // NOTE: on drop set the statuses to null to create a new version, on retake etc.

    // this.props.dispatchSetKeyValue(keyObject.statusCamel, false);
    // updateUserColumn(this.props.userData.identityId, keyObject.statusCamel, false);

    this.setState({ loading: true }); //, [keyObject.stateImageKey]: ''
    if (this.state.stepDirection === VERTICAL) {
      scrollToTop();
    }
    const { image_1, image_2, image_3, image_4, image_5, ...stateRemovedImages } = this.state;
    track(`User dropped image ${fileName}`, stateRemovedImages, this.props.userData);

    trackFunnelActionProjectFunnel(`[MobileFitting] Step ${this.state.currentStep}: 4. Drop Image - Parent Drop`);

    if (!Array.isArray(acceptedFiles) || acceptedFiles.length <= 0) return;

    const file = acceptedFiles[0];

    trackFunnelActionProjectFunnel(`[MobileFitting] Step ${this.state.currentStep}: 5. Drop Image - Before Compressor`);

    const compressorPromise = new Promise(function(resolve, reject) {
      new Compressor(file, {
        quality: 0.7,
        convertSize: 1000000,
        success(newFile) {
          resolve(newFile);
        },
        error(err) {
          resolve(file);
        }
      });
    });

    let compressedFile = file;
    try {
      compressedFile = await compressorPromise;
    } catch (err) {
      // FIXME: TRACK ERROR HERE
      log.error(
        '[fitting] onDrop in fitting.js ' + err,
        {

            err,
            state: this.state,

        },
      );
    }


    // This gets the status of the uploaded fileName. E.g., fileName = leftFingers -> will get statusLeftFingers from redux.
    // let status = this.props.userData[keyObject.statusCamel];
    let status = myProfile[keyObject.statusCamel];
    

    trackFunnelActionProjectFunnel(`[MobileFitting] Step ${this.state.currentStep}: 6. Drop Image - Before Version Status Check`);

    const versionFileName = await this.versionStatusCheck(status, fileName, keyObject);

    trackFunnelActionProjectFunnel(`[MobileFitting] Step ${this.state.currentStep}: 7. Drop Image - Before Upload`);

    return await this.uploadThenLoad(fileName, versionFileName, compressedFile, keyObject, null, status);
  };

  versionStatusCheck = (status, fileName, keyObject) => {
    let versionFileName = fileName;
    // let version = this.props.userData[keyObject.versionCamel] ? this.props.userData[keyObject.versionCamel] : 0;
    let version = this.props.myProfile[keyObject.versionCamel] ? this.props.myProfile[keyObject.versionCamel] : 0;

    if (status == false) {
      // log.info(version);
      if (typeof version == 'number') {
        version += 1;
        if (version != 1) versionFileName += `.${version}`;
        // this.props.dispatchSetKeyValue(keyObject.statusCamel, true);
        // FIXME: uncomment
        // this.storeNumPics(keyObject.statusCamel);
      }
    } else if(status == true){
      // get version, append to filename
      if (typeof version == 'number' && version != 1) versionFileName += `.${version}`;
    }
    if (versionFileName.includes('leftFingers.1')) {
      log.error('[fitting] V. 1 versionFileName === leftFingers.1');
    }

    return versionFileName;
  }

  // Upload to S3 then load the image locally
  uploadThenLoad = async (fileName, versionFileName, file, keyObject, loadingState, status) => {
    let isHeic = false;
    const userId = this.props.userData.identityId;
    const profileId = this.props.myProfile.profileId;
    const isDefaultProfile = (this.props.myProfile || {}).isDefault;
    const folder = isDefaultProfile ? '': `${profileId}/`;
    if (!profileId) return;

    let fileType = file.type;
    if(file.type === 'image/heic' || file.name.toLowerCase().includes('.heic')){
      isHeic = true;
      fileType = 'image/heic';
    }

    trackFunnelActionProjectFunnel(`[MobileFitting] Step ${this.state.currentStep}: 8. Drop Image - Upload`, {profileId});

    return new Promise((resolve, reject) => {
      let key = `${folder}${versionFileName}`;
      key += file.type == 'image/png' ? '.png' : (file.type == 'image/heic' ? '.HEIC': '.jpg');
      // tracking which file uploading
      track('track uploading', versionFileName, this.props.userData);
      Storage.put(key, file, {
        level: 'private',
        contentType: fileType
      })
      .then(async res => {
        trackFunnelActionProjectFunnel(`[MobileFitting] Step ${this.state.currentStep}: 9. Drop Image - Upload Finished`);

        let heicFile = null;
        if (isHeic) {
          await axios({
            method: 'post',
            url: 'https://frclo239p9.execute-api.us-west-1.amazonaws.com/v1/heic',
            data: {
              id: userId,
              srcKey: key,
              destKey: `${folder}${versionFileName}.jpg`
            }
          });
          key = `${folder}${versionFileName}.jpg`;
          heicFile = await Storage.get(key, {level: 'private'});
        }
        try {
          const lists = await Storage.list('', {level: 'private'});
          let isUploaded = false;
          if(lists.length > 0) {
            lists.forEach(element => {
              if(element.key === key) isUploaded = true;
            });
          }
          if(isUploaded) {
            // let version = this.props.userData[keyObject.versionCamel] ? this.props.userData[keyObject.versionCamel] : 0;
            let version = this.props.myProfile[keyObject.versionCamel] ? this.props.myProfile[keyObject.versionCamel] : 0;
            version += 1;
            if(status === null) {
              editProfile({
                profileId,
                [`${keyObject.versionCamel}`]: 1,
                [`${keyObject.statusCamel}`]: true
              });
              this.props.dispatchSetProfileKeyValue(profileId, keyObject.versionCamel, 1);
              this.props.dispatchSetProfileKeyValue(profileId, keyObject.statusCamel, true);
            }
            else if(status === false) {
              editProfile({
                profileId,
                [`${keyObject.versionCamel}`]: version,
                [`${keyObject.statusCamel}`]: true
              });
              this.props.dispatchSetProfileKeyValue(profileId, keyObject.versionCamel, version);
              this.props.dispatchSetProfileKeyValue(profileId, keyObject.statusCamel, true);
            }
            this.setState({ flag: true });
            const statusCamel = keyObject.statusCamel;
            this.props.dispatchSetProfileKeyValue(profileId, statusCamel, true);
            trackFunnelActionProjectFunnel(`[MobileFitting] Step ${this.state.currentStep}: 10. Drop Image - Before Load Image`);
            this.loadDroppedImage(fileName, loadingState, isHeic ? heicFile : file, key, isHeic);
            track('track listing', versionFileName, this.props.userData);
            resolve('success');
          }
          else {
            this.setState({errMessage: 'listing Error'});
            log.error('[fitting] Upload to S3 but not able to list keys');
            reject('failed');
          }
        } catch (err) {
          log.error('[fitting] Upload to S3 but not able to list keys', { err } );
          reject('failed');
        }
      })
      .catch(err => {
        // FIXME: UNCOMMENT
        const { image_1, image_2, image_3, image_4, image_5, ...stateRemovedImages } = this.state;
        log.error(`[fitting] Error Storage.put() `, { err, state: stateRemovedImages, versionFileName, fileType: file.type}  );
        reject('failed');
      });
    });
  }

  loadDroppedImage = (fileName, loadingState, file, key, isHeic) => {
    const imageState = IMAGE_KEY_MAP.get(fileName);
    trackFunnelActionProjectFunnel(`[MobileFitting] Step ${this.state.currentStep}: 11. Drop Image - Before FileReader`);
    if (isHeic) {
      this.setState(
        {
          [imageState]: file, loading: false // [loadingState]: false
        },
        () => trackFunnelActionProjectFunnel(`[MobileFitting] Step ${this.state.currentStep}: 12. Drop Image - After FileReader`)
      );
    } else {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        this.setState(
          {
            [imageState]: reader.result, loading: false // [loadingState]: false
          },
          () => trackFunnelActionProjectFunnel(`[MobileFitting] Step ${this.state.currentStep}: 12. Drop Image - After FileReader`)
        );
      });
      reader.readAsDataURL(file);
      compressImage(this.props.userData.identityId, 40, key);
    }
  };
  // FIXME: ABOVE

  handleResize = async ()  => {

    if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

      this.setState({
        stepDirection: VERTICAL
      });
    } else {
      this.setState({
        stepDirection: HORIZONTAL
      });
    }
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  goFingerHandler = index => () => {
    this.setState({ currentStep: index });
  }

  render() {
    const { userData, myProfile } = this.props;
    const profileId = (myProfile || {}).profileId || '';
    if (!userData.isAuth) {
      return null;
    }
    const { stepDirection, currentStep, desktopStep, availableSteps } = this.state;
    const flowName = (((this || {}).props || {}).uiData || {}).flowName;
    const flagUploadedAll =
      myProfile.statusLeftFingers &&
      myProfile.statusLeftThumb &&
      myProfile.statusRightFingers &&
      myProfile.statusRightThumb &&
      myProfile.statusSide;


      let fitting = (
        <div className = {style.mainFitContainer}>
  
            <DesktopTransfer email={userData.email} phoneNumber={userData.phoneNumber} /> 
  
        </div>
      );

    if (stepDirection === VERTICAL || flowName == 'events') {
      fitting = (
        <div className = {classNames(style.mainFitContainer, style.mobileFitContainer)}>
        {
          currentStep === -3 ? <MobilePrescan nextButton={this.nextPageBasedOnPreScan} />
            : currentStep === -2 ? <MobilePrepare  nextButton={this.nextPageBasedOnFlow} disabled={isEmpty(this.props.myProfile)} />
            : currentStep === -1 ? <MobilePrepare nextButton={this.nextPageBasedOnFlow} disabled={isEmpty(this.props.myProfile)} />
            : currentStep === 0 ? <MobileFinger image={this.state.image_1} currentStep={currentStep} nextButton={this.nextPageBasedOnFlow} backButton={this.prevPageBasedOnFlow} onDrop={this.onDrop} enableNext={this.state.flag} error={this.state.error} profileId={profileId} />
            : currentStep === 1 ? <MobileFinger image={this.state.image_2} currentStep={currentStep} nextButton={this.nextPageBasedOnFlow} backButton={this.prevPageBasedOnFlow} onDrop={this.onDrop} enableNext={this.state.flag} error={this.state.error} profileId={profileId} />
            : currentStep === 2 ? <MobileFinger image={this.state.image_3} currentStep={currentStep} nextButton={this.nextPageBasedOnFlow} backButton={this.prevPageBasedOnFlow} onDrop={this.onDrop} enableNext={this.state.flag} error={this.state.error} profileId={profileId} />
            : currentStep === 3 ? <MobileFinger image={this.state.image_4} currentStep={currentStep} nextButton={this.nextPageBasedOnFlow} backButton={this.prevPageBasedOnFlow} onDrop={this.onDrop} enableNext={this.state.flag} error={this.state.error} profileId={profileId} />
            : currentStep === 4 ? <MobileFinger image={this.state.image_5} currentStep={currentStep} nextButton={this.nextPageBasedOnFlow} backButton={this.prevPageBasedOnFlow} onDrop={this.onDrop} enableNext={this.state.flag} error={this.state.error} profileId={profileId} />
            : currentStep === 5 ?
              <Validation
                backButton={this.prevPageBasedOnFlow}
                availableSteps={availableSteps}
                onGoFinger={this.goFingerHandler}
                images={[this.state.image_1, this.state.image_2, this.state.image_3, this.state.image_4, this.state.image_5,]} />
            : currentStep === 6 ? <Success availableSteps={availableSteps}/>
            : <div/>
        }
        </div>
      );
    }

    return fitting;
  }
}

const mapStateToProps = (state, ownProps) => ({
  userData: state.userData,
  uiData: state.uiData,
  profileData: state.profileData,
  myProfile: state.profileData.profiles.find(profile => profile.profileType === 'Manis') || {}
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetKeyValue: (key, value) => dispatch(SET_KEY_VALUE(key, value)),
  dispatchSetProfileKeyValue: (profileId, key, value) => dispatch(SET_PROFILE_KEY_VALUE(profileId, key, value)),
});

const _Fitting = connect(
  mapStateToProps,
  mapDispatchToProps
)(FittingProcess);


export default AuthWallHOC(_Fitting);
