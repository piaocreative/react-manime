import { builder, BuilderComponent } from '@builder.io/react';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Compressor from 'compressorjs';
import { Storage } from '@aws-amplify/storage';

import { SET_KEY_VALUE } from 'actions';
import { addFitReview } from 'api/profile';

import PageWrapper, { ManimeStandardContainer, getGlobalProps } from 'components/core/hoc/PageWrapper';
import RefitStart from 'components/refit/RefitStart';
import RefitManiStart from 'components/refit/RefitManiStart';
import RefitManiLengthStart from 'components/refit/RefitManiLengthStart';
import RefitManiLengthSelect from 'components/refit/RefitManiLengthSelect';
import RefitPediLengthSelect from 'components/refit/RefitPediLengthSelect';
import RefitManiWidthStart from 'components/refit/RefitManiWidthStart';
import RefitManiWidthSelect from 'components/refit/RefitManiWidthSelect';
import RefitPediWidthSelect from 'components/refit/RefitPediWidthSelect';
import RefitManiImageUpload from 'components/refit/RefitManiImageUpload';
import RefitUploadPanel from 'components/refit/RefitUploadPanel';
import RefitReview from 'components/refit/RefitReview';
import RefitConfirm from 'components/refit/RefitConfirm';
import AuthWallHOC from 'components/AuthWallHOC'

import constants from 'constants/index';

import { BUILDER_API_KEY } from 'lib/builder';

import log from 'utils/logging'
import { scrollToTop } from 'utils/scroll'
import { trackFunnelActionProjectFunnel,  } from 'utils/track';

import style from '../../static/components/refit/refit-common.module.css';

builder.init(BUILDER_API_KEY)

const STEP_REFIT_START = 0;
const STEP_REFIT_MANI_START = 1; 
const STEP_REFIT_MANI_LENGTH_START = 2;
const STEP_REFIT_MANI_LENGTH_SELECT = 3;

const STEP_REFIT_MANI_WIDTH_START = 4;
const STEP_REFIT_MANI_WIDTH_SELECT = 5;
const STEP_REFIT_MANI_UPLOAD = 6;
const STEP_REFIT_MANI_REVIEW = 7;
const STEP_REFIT_UPLOAD_PANEL = 8;
const STEP_REFIT_MANI_CONFIRM = 9;

const RefitFlow = ({ profileIds, isMobileView, credits, dispatchSetKeyValue, builderPage, asPath, isProduction, globalProps }) => {

  const [currentPageStep, setCurrentPageStep] = useState(STEP_REFIT_START);
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({
    profileType: 'Manis',
    profileId: 'profileIdTest',
    groupOrderId: 'lastOrder',
    selectedIndex: 0,
    prevPageStep: STEP_REFIT_START
  });

  useEffect(() => {
    const url = new URL(window.location.href);
    const groupOrderId = url.searchParams.get('groupOrderId');
    let profileType = url.searchParams.get('profileType');
    if (!['Manis', 'Pedis'].includes(profileType)) {
      profileType = null;
    }

    if (groupOrderId && !profileType) {
      setState(prevState => ({
        ...prevState,
        groupOrderId
      }));
    } else if (groupOrderId && profileType) {
      setState(prevState => ({
        ...prevState,
        groupOrderId,
        profileType,
        prevPageStep: STEP_REFIT_START
      }));
      onNext(STEP_REFIT_MANI_START)();
    } else if (!groupOrderId && profileType) {
      setState(prevState => ({
        ...prevState,
        profileType,
        prevPageStep: STEP_REFIT_START
      }));
      onNext(STEP_REFIT_MANI_START)();
    }

  }, []);

  useEffect(() => {
    scrollToTop();
  }, [currentPageStep]);

  useEffect(() => {
    if (profileIds && profileIds.length >= 2) {
      setState(prevState => ({
        ...prevState,
        profileId: profileIds.find(profile => profile.profileType === state.profileType).profileId
      }));
      trackFunnelActionProjectFunnel('[refit][start]', {payload: {profileIds, profileType: state.profileType}});
    }
  }, [profileIds, state.profileType]);

  const startWithType = type => () => {
    if (state.profileType !== type) {
      setState(prevState => ({...prevState, profileType: type}));
      setState({
        profileType: type,
        profileId: state.profileId,
        groupOrderId: state.groupOrderId,
        selectedIndex: 0,
        prevPageStep: STEP_REFIT_START
      })
    }
    onNext(STEP_REFIT_MANI_START)();
  }

  const onNext = nextStep => () => {
    setCurrentPageStep(nextStep);
  };

  const onConfirmLength = () => {
    onNext(STEP_REFIT_MANI_WIDTH_START)();
  };

  const skipWidthHandler = async () => {
    const hasLength = [...Array(10).keys()].find(index => state[`f${index}Length`]) >= 0;
    const newState = {
      ...state,
      [`f0BaseWidth`]: undefined,
      [`f1BaseWidth`]: undefined,
      [`f2BaseWidth`]: undefined,
      [`f3BaseWidth`]: undefined,
      [`f4BaseWidth`]: undefined,
      [`f5BaseWidth`]: undefined,
      [`f6BaseWidth`]: undefined,
      [`f7BaseWidth`]: undefined,
      [`f8BaseWidth`]: undefined,
      [`f9BaseWidth`]: undefined,

      [`f0TipWidth`]: undefined,
      [`f1TipWidth`]: undefined,
      [`f2TipWidth`]: undefined,
      [`f3TipWidth`]: undefined,
      [`f4TipWidth`]: undefined,
      [`f5TipWidth`]: undefined,
      [`f6TipWidth`]: undefined,
      [`f7TipWidth`]: undefined,
      [`f8TipWidth`]: undefined,
      [`f9TipWidth`]: undefined,

      [`f0Comment`]: undefined,
      [`f1Comment`]: undefined,
      [`f2Comment`]: undefined,
      [`f3Comment`]: undefined,
      [`f4Comment`]: undefined,
      [`f5Comment`]: undefined,
      [`f6Comment`]: undefined,
      [`f7Comment`]: undefined,
      [`f8Comment`]: undefined,
      [`f9Comment`]: undefined,
    };
    setState(newState);
    if (hasLength) {
      onNext(STEP_REFIT_MANI_REVIEW)();
    } else {
      await submitHandler();
      // onNext(STEP_REFIT_MANI_CONFIRM)();
    }
  }

  const onConfirmWidth = () => {
    onNext(STEP_REFIT_MANI_UPLOAD)();
  };

  const lengthFineHandler = () => {
    setState(prevState => ({
      ...prevState,
      [`f0Length`]: undefined,
      [`f1Length`]: undefined,
      [`f2Length`]: undefined,
      [`f3Length`]: undefined,
      [`f4Length`]: undefined,
      [`f5Length`]: undefined,
      [`f6Length`]: undefined,
      [`f7Length`]: undefined,
      [`f8Length`]: undefined,
      [`f9Length`]: undefined,
    }));
    onNext(STEP_REFIT_MANI_WIDTH_START)();
  };

  const onDrop = async (acceptedFiles, rejectedFiles, fileName) => {
    trackFunnelActionProjectFunnel(`[review][onDrop] dropped image`);
    if (!Array.isArray(acceptedFiles) || acceptedFiles.length <= 0) return;
    const file = acceptedFiles[0];
    const compressorPromise = new Promise(function(resolve, reject) {
      new Compressor(file, {
        quality: 0.8,
        convertSize: 2500000,
        success(newFile) {
          resolve(newFile);
        },
        error(err) {
          resolve(file);
        }
      });
    });

    let compressedFile;
    try {
      compressedFile = await compressorPromise;
    } catch (err) {
      // FIXME: TRACK ERROR HERE
      log.error(
        '[refit][onDrop] ' + err,
        {
          err,
        },
      );
    }
    await uploadThenLoad(fileName, compressedFile, null);
  };

  // Upload to S3 then load the image locally
  const uploadThenLoad = async (versionFileName, file, loadingState) => {
    // key += file.type == 'image/png' ? '.png' : '.jpg';
    const extension = file.type == 'image/png' ? '.png' : '.jpg';
    // TODO: S3 image uploading path
    let key = `refit/${state.profileId}/${state.groupOrderId}/${versionFileName}${extension}`;
    try {
      await Storage.put(key, file, {
        level: 'private',
        contentType: file.type
      });
      const result = await Storage.get(key, {level: 'private'});
      setState(prevState => ({
        ...prevState,
        [versionFileName]: key,
        [`${versionFileName}Value`]: result,
        lastImageSrc: result
      }));
    } catch (err) {
      log.error(`[refit][uploadThenLoad] ` + err,{ err, key } );
    }
  };

  const onPicture = id => () => {
    setCurrentPageStep(STEP_REFIT_UPLOAD_PANEL);
    setState(prevState => ({
      ...prevState,
      prevPageStep: currentPageStep,
      selectedIndex: id
    }));
  };

  const onSwitchType = () => {
    onNext(STEP_REFIT_MANI_START)();
    setState(prevState => ({
      profileType: state.profileType !== 'Manis' ? 'Manis': 'Pedis',
      profileId: prevState.profileId,
      groupOrderId: prevState.groupOrderId,
      selectedIndex: 0,
      prevPageStep: STEP_REFIT_START
    }));
  };

  const submitHandler = async () => {
    const { image0UriValue, image1UriValue, image2UriValue, image3UriValue, image4UriValue, image5UriValue, selectedIndex, prevPageStep, lastImageSrc, ...rest } = state;
    if (isLoading)
      return;
    trackFunnelActionProjectFunnel('[refit][onSubmit] clicked submit', {payload: { rest }});
    try {
      setIsLoading(true);
      const result = await addFitReview(rest);
      trackFunnelActionProjectFunnel('[refit][onSubmit] fitreview created');
      if (result?.addedCreditAmount) {
        dispatchSetKeyValue('credits', credits + result.addedCreditAmount);
      }
      setState(prevState => ({
        ...prevState,
        addedCredits: result?.addedCreditAmount
      }));
      onNext(STEP_REFIT_MANI_CONFIRM)();
    } catch (err) {
      log.error('[refit][submitHandler] ' + err, { err });
    }
    setIsLoading(false);
    // onNext(STEP_REFIT_MANI_CONFIRM)();
  };

  const rateNextHandler = () => {
    if (state.responseOverallRating === 5) {
      submitHandler();
    } else {
      onNext(STEP_REFIT_MANI_LENGTH_START)();
    }
  }

  const isLongPage = [STEP_REFIT_START, STEP_REFIT_MANI_UPLOAD, STEP_REFIT_MANI_REVIEW, STEP_REFIT_MANI_LENGTH_SELECT, STEP_REFIT_UPLOAD_PANEL].includes(currentPageStep);

  return (
    // TODO: longRoot condition should be STEP_REFIT_MANI_UPLOAD
    
    <>
    <div className={classNames(style.root, isLongPage && style.longRoot)}>
      <div className={style.container}>
      {
      currentPageStep === STEP_REFIT_START ?
        <RefitStart
          onMani={startWithType('Manis')}
          onPedi={startWithType('Pedis')} /> :
      currentPageStep === STEP_REFIT_MANI_START ?
        <RefitManiStart
          state={state}
          setState={setState}
          onBack={onNext(STEP_REFIT_START)}
          onNext={rateNextHandler} /> :
      currentPageStep === STEP_REFIT_MANI_LENGTH_START ?
        <RefitManiLengthStart
          state={state}
          goToWidth={lengthFineHandler}
          goToLength={onNext(STEP_REFIT_MANI_LENGTH_SELECT)}
          onBack={onNext(STEP_REFIT_MANI_START)} /> :
      currentPageStep === STEP_REFIT_MANI_LENGTH_SELECT ?
      (state.profileType === 'Manis' ?
        <RefitManiLengthSelect
          state={state}
          setState={setState}
          onConfirm={onConfirmLength}
          onBack={onNext(STEP_REFIT_MANI_LENGTH_START)} /> :
        <RefitPediLengthSelect
          state={state}
          setState={setState}
          onConfirm={onConfirmLength}
          onBack={onNext(STEP_REFIT_MANI_LENGTH_START)} />
      ):
      currentPageStep === STEP_REFIT_MANI_WIDTH_START ?
        <RefitManiWidthStart
          state={state}
          goToWidth={onNext(STEP_REFIT_MANI_WIDTH_SELECT)}
          skipWidth={skipWidthHandler}
          onBack={onNext(STEP_REFIT_MANI_LENGTH_START)} />:
      currentPageStep === STEP_REFIT_MANI_WIDTH_SELECT ?
      (state.profileType === 'Manis'?
        <RefitManiWidthSelect
          state={state}
          setState={setState}
          onConfirm={onConfirmWidth}
          onBack={onNext(STEP_REFIT_MANI_WIDTH_START)} />:
        <RefitPediWidthSelect
          state={state}
          setState={setState}
          onConfirm={onConfirmWidth}
          onBack={onNext(STEP_REFIT_MANI_WIDTH_START)} />
      ) :
      currentPageStep === STEP_REFIT_MANI_UPLOAD ?
        <RefitManiImageUpload
          state={state}
          setState={setState}
          onPicture={onPicture}
          onDrop={onDrop}
          onBack={onNext(STEP_REFIT_MANI_WIDTH_START)}
          onNext={onNext(STEP_REFIT_MANI_REVIEW)} /> :
      currentPageStep === STEP_REFIT_UPLOAD_PANEL ?
        <RefitUploadPanel
          state={state}
          setState={setState}
          image={state[`image${state.selectedIndex}UriValue`]}
          onDrop={onDrop}
          onPicture={onPicture}
          onBack={onNext(STEP_REFIT_MANI_UPLOAD)}
          onNext={onNext(STEP_REFIT_MANI_REVIEW)} /> :
      currentPageStep === STEP_REFIT_MANI_REVIEW ?
        <RefitReview
          state={state}
          setState={setState}
          onBack={onNext(STEP_REFIT_MANI_UPLOAD)}
          isLoading={isLoading}
          onDone={submitHandler} /> :
      currentPageStep === STEP_REFIT_MANI_CONFIRM ?
        <RefitConfirm
          state={state}
          onSwitchType={onSwitchType}
          onBack={onNext(STEP_REFIT_MANI_REVIEW)} 
          builderContent={JSON.parse(builderPage || {})}/>:
        null
      }
      </div>
    </div>
    <div className={style.footer}>

    </div>
    </>

    
  );
};

const mapStateToProps = state => ({
  credits: state.userData?.credits || 0,
  profileIds: (state.profileData.profiles || []).map(profile => ({profileId: profile.profileId, profileType: profile.profileType}))
});

const mapDispatchToProps = dispatch => ({
  dispatchSetKeyValue: (key, value) => dispatch(SET_KEY_VALUE(key, value)),
});

const WrappedRefitFlow = ManimeStandardContainer(AuthWallHOC(connect(mapStateToProps, mapDispatchToProps)(RefitFlow)));

export default WrappedRefitFlow;

export const getStaticProps = async ({ res, req }) => {
  const isProduction = constants.productionUrls.includes(process.env.APP_URL);

  const builderPage = await builder.get('page', { 
    req, res, url: '/refit-confirmation', 
  }).promise();

  const globalProps = await getGlobalProps({ 
    propsToMerge: { 
      builderPage: JSON.stringify(builderPage) 
    }
  });
  
  return globalProps;
}
