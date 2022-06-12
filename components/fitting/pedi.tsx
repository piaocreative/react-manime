import React, { PureComponent } from 'react';
import classNames from 'classnames';
import Router from 'next/router';
import { Storage } from '@aws-amplify/storage';
import Compressor from 'compressorjs';
import { connect } from 'react-redux';
import MobilePrepare from '../../components/fitting/pedi/mobile/Prepare_v3';
import MobileFinger from '../../components/fitting/pedi/mobile/Finger_v3';
import Success from '../../components/fitting/pedi/mobile/Success_v3';
import Validation from '../../components/fitting/pedi/mobile/Validation';
import log from '../../utils/logging'
import DesktopTransfer from '../../components/fitting/desktopTransfer';
import { track, trackFunnelActionProjectFunnel } from '../../utils/track';
import { editProfile } from 'api/profile';
import { compressImage } from 'api/util';

import { SET_KEY_VALUE, SET_PROFILE_KEY_VALUE } from '../../actions';

import style from '../../static/components/fitting/pedi/fittingProcess.module.css';
import { scrollToTop } from '../../utils/scroll';

import { isEmpty } from '../../utils/validation';
import AuthWallHOC from '../../components/AuthWallHOC'
import axios from 'axios';

const IMAGE_KEY_MAP = new Map();
IMAGE_KEY_MAP.set('leftFingers', 'image_1');
// IMAGE_KEY_MAP.set('leftThumb', 'image_2');
IMAGE_KEY_MAP.set('rightFingers', 'image_2');
// IMAGE_KEY_MAP.set('rightThumb', 'image_4');
IMAGE_KEY_MAP.set('sidePinky', 'image_3');
IMAGE_KEY_MAP.set('side', 'image_4');

const KEY_MAP = [
  {
    camelCase: 'leftFingers',
    statusCamel: 'statusLeftFingers',
    versionLower: 'versionleftfingers',
    versionCamel: 'versionLeftFingers',
    stateImageKey: 'image_1'
  },
  // {
  //   camelCase: 'leftThumb',
  //   statusCamel: 'statusLeftThumb',
  //   versionLower: 'versionleftthumb',
  //   versionCamel: 'versionLeftThumb',
  //   stateImageKey: 'image_2'
  // },
  {
    camelCase: 'rightFingers',
    statusCamel: 'statusRightFingers',
    versionLower: 'versionrightfingers',
    versionCamel: 'versionRightFingers',
    stateImageKey: 'image_2'
  },
  // {
  //   camelCase: 'rightThumb',
  //   statusCamel: 'statusRightThumb',
  //   versionLower: 'versionrightthumb',
  //   versionCamel: 'versionRightThumb',
  //   stateImageKey: 'image_4'
  // },
  {
    camelCase: 'sidePinky',
    statusCamel: 'statusSidePinky',
    versionLower: 'versionsidepinky',
    versionCamel: 'versionSidePinky',
    stateImageKey: 'image_3'
  },
  {
    camelCase: 'side',
    statusCamel: 'statusSide',
    versionLower: 'versionside',
    versionCamel: 'versionSide',
    stateImageKey: 'image_4'
  }
];

const VERTICAL = 'vertical';
const HORIZONTAL = 'horizontal'

class FittingProcess extends PureComponent <any, any> {
  constructor(props) {
    super(props);
    this.state = {
      desktopStep: 0,
      currentStep : -3,
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

    await this.resizeInit();
    if (!isEmpty(this.props.myProfile)) {
      this.setAvailableFlowBasedOnStatuses(true);
      this.loadImages([0,1,2,3]);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentStep != this.state.currentStep) {
      // trackFunnelAction(`A. Fit Flow Step: ${this.state.currentStep}`);
      trackFunnelActionProjectFunnel(`A. Fit Flow Step: ${this.state.currentStep}`, { profileType: 'Pedis'});
    }
    if (prevProps.myProfile !== this.props.myProfile && isEmpty(prevProps.myProfile) && !isEmpty(this.props.myProfile)) {
      log.info('here called the setAvailableFlowBasedOnStatuses', {previousProfile: prevProps.myProfile, currentProfile: this.props.myProfile});
      this.setAvailableFlowBasedOnStatuses(true)

      this.loadImages([0,1,2,3]);
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
    } else if (isStart) {

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
      // statusLeftThumb,
      statusRightFingers,
      // statusRightThumb,
      statusSide
    } = this.props.myProfile;

    let availableSteps = [];
    if (!statusLeftFingers) availableSteps.push(0);
    // if (!statusLeftThumb) availableSteps.push(1);
    if (!statusRightFingers) availableSteps.push(1);
    // if (!statusRightThumb) availableSteps.push(3);
    if (!statusSide) {
      availableSteps.push(2);
      availableSteps.push(3);
    }

    // this.loadImages(this.state.stepDirection !== VERTICAL ? [0,1,2,3,4] : availableSteps);

    this.setState({ availableSteps }, () => {
      this.initPage(isStart);
    });
    // NOTE: [], [0], [0, 1], [0, 1, 3], [0, 1, 4]
  }

  getNextFingerToUpload = () => {
    const {
      statusLeftFingers,
      // statusLeftThumb,
      statusRightFingers,
      // statusRightThumb,
      statusSide
    } = this.props.myProfile; // this.props.userData;
    if (!statusLeftFingers) return 0;
    // if (!statusLeftThumb) return 1;
    if (!statusRightFingers) return 1;
    // if (!statusRightThumb) return 3;
    if (!statusSide) return 2;
  }

  loadImages = async availableSteps => {
    // NOTE: display images if in availableSteps and status in rds is valid, otherwise don't display

    const {
      statusLeftFingers,
      // statusLeftThumb,
      statusRightFingers,
      //  statusRightThumb,
      statusSide,
      versionLeftFingers,
      // versionLeftThumb,
      versionRightFingers,
      // versionRightThumb,
      versionSide,
      profileId
    } = this.props.myProfile;
    // const profileId = myProfile.profileId;

    const leftFootKey = versionLeftFingers && versionLeftFingers > 1 ? `leftFingers.${versionLeftFingers}` : `leftFingers`;
    // const leftThumbKey = versionLeftThumb && versionLeftThumb > 1 ? `leftThumb.${versionLeftThumb}` : `leftThumb`;
    const rightFootKey = versionRightFingers && versionRightFingers > 1 ? `rightFingers.${versionRightFingers}` : `rightFingers`;
    // const rightThumbKey = versionRightThumb && versionRightThumb > 1 ? `rightThumb.${versionRightThumb}` : `rightThumb`;
    const sideKey = versionSide && versionSide > 1 ? `side.${versionSide}` : `side`;
    const sidePinkyKey = versionSide && versionSide > 1 ? `sidePinky.${versionSide}` : `sidePinky`;

    let imageKeys = ['', '', '', '', ''];

    try {
      const list = await Storage.list('', {level: 'private'});
      list.map(element => {
        if (element.key.includes(`${profileId}/${leftFootKey}`)) imageKeys[0] = element.key;
        // if (element.key.includes(`${profileId}/${leftThumbKey}`)) imageKeys[1] = element.key;
        if (element.key.includes(`${profileId}/${rightFootKey}`)) imageKeys[1] = element.key;
        // if (element.key.includes(`${profileId}/${rightThumbKey}`)) imageKeys[3] = element.key;
        if (element.key.includes(`${profileId}/${sidePinkyKey}`)) imageKeys[2] = element.key;
        if (element.key.includes(`${profileId}/${sideKey}`)) imageKeys[3] = element.key;
      });

    } catch (err) {
       log.error('[pedi][loadImnages] issue listing from S3' + err, {err});
    }

    // NOTE: map over availableSteps and if the associated status is false, don't load the image
    availableSteps.map(index => {
      const imageKey = imageKeys[index];
      // imageKeys.map((imageKey, index) => {
        // check in redux state before pulling...
        if (index == 0 && !statusLeftFingers) return;
        // if (index == 1 && !statusLeftThumb) return;
        if (index == 1 && !statusRightFingers) return;
        // if (index == 3 && !statusRightThumb) return;
        if (index == 2 && !statusSide) return;
        if (index == 3 && !statusSide) return;
        if (index > 3) return;

        // NOTE: investigate
        Storage.get(imageKey, { level: 'private' })
        .then(result => {
          this.setState({ [KEY_MAP[index].stateImageKey]: result });
        })
        .catch(err => {
          log.error('[pedi][loadImages] Storage.get() ' + err, { err } );
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

  nextPageBasedOnFlow = ev => {
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
    const { currentStep, availableSteps, availableStepIndex } = this.state;

    if (availableSteps.length == 0 || availableStepIndex <= 0) {
      this.setState({
        currentStep: -3,
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

  initiateChangePage = () => {
    const { currentStep, availableSteps, availableStepIndex } = this.state;
    this.setState({ error: '' });
    scrollToTop();
    track(`User clicked next page.`, null, this.props.userData, { customObj: availableSteps,  availableStepIndex,  currentStep});
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
    track(`User dropped image `, stateRemovedImages, this.props.userData, { customObj: 'optional custom data here', fileName  });

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

    const versionFileName = this.versionStatusCheck(status, fileName, keyObject);
    let versionFileName2 = versionFileName;
    if (fileName === 'leftFingers') {
      versionFileName2 = versionFileName2.replace('leftFingers', 'leftThumb');
      await this.uploadThenLoad('leftThumb', versionFileName2, compressedFile, keyObject, null, status, true);
    } else if (fileName === 'rightFingers') {
      versionFileName2 = versionFileName2.replace('rightFingers', 'rightThumb');
      await this.uploadThenLoad('rightThumb', versionFileName2, compressedFile, keyObject, null, status, true);
    }

    trackFunnelActionProjectFunnel(`[MobileFitting] Step ${this.state.currentStep}: 7. Drop Image - Before Upload`);
    return await this.uploadThenLoad(fileName, versionFileName, compressedFile, keyObject, null, status);
  };

  versionStatusCheck = (status, fileName, keyObject) => {
    let versionFileName = fileName;
    let version = this.props.myProfile[keyObject.versionCamel] ? this.props.myProfile[keyObject.versionCamel] : 0;

    if (status == false) {
      if (typeof version == 'number') {
        if (keyObject.camelCase !== 'side')
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
  uploadThenLoad = async (fileName, versionFileName, file, keyObject, loadingState, status, notLoad=false) => {
    let isHeic = false;
    const userId = this.props.userData.identityId;
    const profileId = this.props.myProfile.profileId;
    let fileType = file.type;
    if(file.type === 'image/heic' || file.name.toLowerCase().includes('.heic')){
      isHeic = true;
      fileType = 'image/heic';
    }

    trackFunnelActionProjectFunnel(`[MobileFitting] Step ${this.state.currentStep}: 8. Drop Image - Upload`);

    return new Promise((resolve, reject) => {
      let key = `${profileId}/${versionFileName}`;
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
              destKey: `${profileId}/${versionFileName}.jpg`
            }
          });
          key = `${profileId}/${versionFileName}.jpg`;
          heicFile = await Storage.get(key, {level: 'private'});
        }
        try {
          if (notLoad) {
            resolve('success');
            return;
          }
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
            if (keyObject.camelCase !== 'side')
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
        log.error(`[fitting] Error Storage.put() ${err}`, { err, state: stateRemovedImages, versionFileName, fileType: file.type} );
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

  handleResize = async ()=> {
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
    log.info('currentStep 0 =>', {currentStep, myProfile});
    const flagUploadedAll =
      myProfile.statusLeftFingers &&
      // myProfile.statusLeftThumb &&
      myProfile.statusRightFingers &&
      // myProfile.statusRightThumb &&
      myProfile.statusSide;

      let fitting = (
        <div className = {style.mainFitContainer}>
          <DesktopTransfer email={userData.email} phoneNumber={userData.phoneNumber} profileType='Pedis'/> 
        </div>
      );

    if (stepDirection === VERTICAL || flowName == 'events') {

      fitting = (
        <div className = {classNames(style.mainFitContainer, style.mobileFitContainer)}>
        {
          currentStep === -3 ? <MobilePrepare  nextButton={this.nextPageBasedOnFlow} profileType='Pedis' disabled={isEmpty(this.props.myProfile)}/>
            : currentStep === -2 ? <MobilePrepare nextButton={this.nextPageBasedOnFlow} profileType='Pedis' disabled={isEmpty(this.props.myProfile)}/>
            : currentStep === -1 ? <MobilePrepare nextButton={this.nextPageBasedOnFlow} profileType='Pedis' disabled={isEmpty(this.props.myProfile)}/>
            : currentStep === 0 ? <MobileFinger image={this.state.image_1} currentStep={currentStep} nextButton={this.nextPageBasedOnFlow} backButton={this.prevPageBasedOnFlow} onDrop={this.onDrop} enableNext={this.state.flag} error={this.state.error} profileId={profileId} profileType='Pedis'/>
            : currentStep === 1 ? <MobileFinger image={this.state.image_2} currentStep={currentStep} nextButton={this.nextPageBasedOnFlow} backButton={this.prevPageBasedOnFlow} onDrop={this.onDrop} enableNext={this.state.flag} error={this.state.error} profileId={profileId} profileType='Pedis'/>
            : currentStep === 2 ? <MobileFinger image={this.state.image_3} currentStep={currentStep} nextButton={this.nextPageBasedOnFlow} backButton={this.prevPageBasedOnFlow} onDrop={this.onDrop} enableNext={this.state.flag} error={this.state.error} profileId={profileId} profileType='Pedis'/>
            : currentStep === 3 ? <MobileFinger image={this.state.image_4} currentStep={currentStep} nextButton={this.nextPageBasedOnFlow} backButton={this.prevPageBasedOnFlow} onDrop={this.onDrop} enableNext={this.state.flag} error={this.state.error} profileId={profileId} profileType='Pedis'/>
            // : currentStep === 4 ? <MobileFinger image={this.state.image_5} currentStep={currentStep} nextButton={this.nextPageBasedOnFlow} backButton={this.prevPageBasedOnFlow} onDrop={this.onDrop} enableNext={this.state.flag} error={this.state.error} profileId={profileId} profileType='Pedis'/>
            : (currentStep === 5 || currentStep === 4) ?
              <Validation
                backButton={this.prevPageBasedOnFlow}
                availableSteps={availableSteps}
                onGoFinger={this.goFingerHandler}
                images={[this.state.image_1, this.state.image_2, this.state.image_3, this.state.image_4]} />
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
  myProfile: state.profileData.profiles.find(profile => profile.profileType === 'Pedis') || {}
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
