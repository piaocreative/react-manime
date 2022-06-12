import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import log from 'utils/logging';
import CustomStepper from 'components/CustomStepper';
import MyDropzone from 'components/MyDropZone.js';
import LoadingAnimation from 'components/LoadingAnimation';
import { PrimaryButton, DarkButton } from 'components/basic/buttons';
import CheckIcon from 'components/icons/howto/CheckIcon';
import { trackFunnelActionProjectFunnel } from 'utils/track';
import {  SET_PROFILE_KEY_VALUE } from 'actions';
import fingerText from '../fingerInfo';

import style from 'static/components/fitting/pedi/mobile/fingers-v3.module.css';

const RetakePicturePanel = styled.div`
  position: fixed;
  left: 26px;
  bottom: 20px;
  width: calc(100% - 52px);
  max-width: 480px;
  height: 124px;
  background-color: #FFF9F7D0;
  // box-shadow: 0px 0px 4px 1px rgba(0,0,0,0.1);
  border: 1px solid #2C4349;

  @media (min-width: 480px) {
    left: max(calc(50% - 240px), 26px);
  }
`;

const fingerNameList = [
  {description: 'Take a picture of your', name: 'left foot.'},
  {description: 'Take a picture of your', name: 'right foot.'},
  {description: "Let's not forget your", name: 'right pinky!'},
  {description: "Last but not least, we want to scan the", name: 'curvature of your toenails!'},
  {description: 'Last but not least, we want to scan the', name: 'curvature of your nails!'}
];

const MobileFinger = props => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted ] = useState(false)

  useEffect(() => {
    const { currentStep } = props;
    trackFunnelActionProjectFunnel(`[MobileFitting] Step ${currentStep}: 1. Load`, fingerText[currentStep]);
    setIsMounted(true)
  }, []);

  const nextButtonClickHandler = ev => {
    const { nextButton, currentStep } = props;

    if (error) return;
    nextButton(ev);
  }

  const localOnDrop = async (accepted, rejected) => {

    if(!isMounted){
      return;
    }
    const { currentStep } = props;
    trackFunnelActionProjectFunnel(`[MobileFitting] Step ${currentStep}: 2. Drop Image`, fingerText[currentStep]);
    if (isLoading) {
      return;
    }

    trackFunnelActionProjectFunnel(`[MobileFitting] Step ${currentStep}: 3. Drop Image - Not Loading`, fingerText[currentStep]);
    setIsLoading(true);
    try {
      // this resets state every time you take picture, so we store all images
      props.dispatchSetProfileKeyValue(props.profileId, fingerText[currentStep].statusCamel, false);
   // *** Can we get rid of this?   editProfile({profileId: props.profileId, [fingerText[currentStep].statusCamel]: false});

      await props.onDrop(accepted, rejected, fingerText[currentStep].fileName);
    } catch (err) {
      setError('Something went wrong, please try again!');
      log.error('[Finger_v3] local onDrop error ' + err, { err } );
    }
    setIsLoading(false);
  }

  const { currentStep } = props;

  return (
    <div className={style.container}>
      <div className={style.caution}>
        <img
          className={style.backButton}
          src='/static/icons/back.svg'
          onClick={props.backButton} />
        <div className={style.title}>{fingerText[currentStep].title}</div>
      </div>
      <div className={style.titleContainer}>
        { !props.image &&
          <>
            {fingerNameList[currentStep].description} <span className={style.bold}>{fingerNameList[currentStep].name}</span>
          </>
        }
      </div>
      <div className={style.stepperContainer}>
        <CustomStepper currentStep={currentStep} totalSteps={4} />
      </div>

      {!props.image && currentStep >=0 &&
        <div className={style.description}>
          <div className={style.proTips}>PRO TIPS</div>
          {currentStep < 2 ?
          <>
            <div className={style.leftAlign}><CheckIcon className={style.checkIcon} /> Hold phone parallel to your foot</div>
            <div className={style.leftAlign}><CheckIcon className={style.checkIcon} /> Ensure entire card is in frame</div>
          </>:
          currentStep === 2 ?
          <>
            <div className={style.leftAlign}><CheckIcon className={style.checkIcon} /> Hold phone parallel to your foot</div>
            <div className={style.leftAlign2}><CheckIcon className={style.checkIcon} /> Make sure you can see the whole nail</div>
          </>:
          <>
            <div className={style.leftAlign3}><CheckIcon className={style.checkIcon} /> <span>Use either foot to <span className={style.bold}>take a front view picture</span></span></div>
          </>
          }
        </div>
      }
      {currentStep >= 0 &&
        <img
          style={{display: isLoading || props.image ? 'none' : 'block'}}
          className={style.pediImage}
          src={fingerText[currentStep].imgSrc}
          alt='' />
      }
      {
        isLoading &&
        <div style={{height: 'calc(100vh - 280px)'}}>
          <LoadingAnimation isLoading={isLoading} background='transparent' />
        </div>
      }

      <MyDropzone
        onDrop={localOnDrop}
        isLoading={isLoading}
        active = {props.image ? true: false}
        image={props.image}
      />

      { props.image && <RetakePicturePanel>
        <div className={style.retakePicturePanel}>
          {
            (currentStep === 2) ?
            <>
              Is the pinky toenail in frame? <br />
              Did you hold your phone above your foot?
            </>:
            (currentStep === 3) ?
            <>
              Is the curvature of your toenails visible?
            </>:
            <>
              Is the entire card in frame? <br />
              Did you hold your phone above your foot?
            </>
          }
        </div>
        <div className={style.retakeActionLine} onClick={ev => ev.preventDefault()}>
          <PrimaryButton passedClass={style.retakeButton}>
            OOPS RETAKE
          </PrimaryButton>
          <DarkButton
            disabled={isLoading}
            passedClass={style.continueButton}
            onClick={nextButtonClickHandler}>
            YES
          </DarkButton>
        </div>
      </RetakePicturePanel>}

      {error &&
        <div className={style.retakeConfirmMessage}>
          <div className={style.lastConfirm}>{error}</div>
        </div>
      }

      { props.error && props.error != '' &&
        <div className={style.retakeConfirmMessage}>
          <div className={style.description}>{props.error}</div>
        </div>
      }
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  userData: state.userData
});

const mapDispatchToProps = (dispatch, ownProps) => ({

  dispatchSetProfileKeyValue: (profileId, key, value) => dispatch(SET_PROFILE_KEY_VALUE(profileId, key, value))
});

const _MobileFinger = connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileFinger);

export default _MobileFinger;
