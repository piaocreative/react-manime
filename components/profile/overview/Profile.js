import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Box from '../../styled/Box';
import ProfileStatusBar from './ProfileStatusBar';
import ErrorPanel from './ErrorPanel';
import InstructionPanel from './InstructionPanel';
import ManiProfileIcon from '../../icons/profile/ManiProfileIcon';
import PediProfileIcon from '../../icons/profile/PediProfileIcon';
import { NORMAL_RATE_CREDIT } from '../../../constants';

const Container = styled(Box)`
  position: relative;
  background-color: ${props => props.theme.colors.teal};
  min-height: 166px;
  text-align: center;
  padding: 20px 16px 56px;

  @media (min-width: 768px) {
    padding-top: 24px;
    min-height: 188px;
  }
`;

const ProfileAvatar = styled(Box)`
  position: absolute;
  display: none;
  place-items: center;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 0 7px 8px 0 rgba(0, 0, 0, 0.24);
  background-color: ${props => props.theme.colors.white};
  @media (min-width: 768px) {
    display: grid;
  }
`;
// NOTE: STATUS
const STATUS_ACTIVE = 0;
const STATUS_DISABLE = 1;
const STATUS_DONE = 2;

// NOTE: STEPS
const STEP_START = 0;
const STEP_SCANNED = 1;
const STEP_ORDERED = 2;
const STEP_RATED = 3;
const STEP_OTHER = 4;
const STEP_ERROR = -1;

const ManiProfile = ({ isManiProfile, profileOverview }) => {
  const [profileStep, setProfileStep] = useState(0);
  const [profileStatus, setProfileStatus] = useState([STATUS_DISABLE, STATUS_DISABLE, STATUS_DISABLE]);

  const init = () => {
    const {
      hasFitReview,
      // hasFulfilledOrder,
      hasOrder,
      hasRetakePicsError,
      hasUploadedAllPics,
      // hasValidAllPics,
    } = (profileOverview || {});
    let status = [];
    let step = 0;
    if (!hasUploadedAllPics) {
      status = [STATUS_ACTIVE, STATUS_DISABLE, STATUS_DISABLE];
      step = STEP_START
    } else if (hasUploadedAllPics && !hasOrder) {
      status = [STATUS_DONE, STATUS_ACTIVE, STATUS_DISABLE];
      step = STEP_SCANNED;
    } else if (hasUploadedAllPics && hasOrder && !hasFitReview) {
      status = [STATUS_DONE, STATUS_DONE, STATUS_ACTIVE];
      step = STEP_ORDERED;
    } else if (hasFitReview) {
      status = [STATUS_DONE, STATUS_DONE, STATUS_DONE];
      step = STEP_RATED;
    } else {
      status = [STATUS_DISABLE, STATUS_DISABLE, STATUS_DISABLE];
      step = STEP_OTHER;
    }
    setProfileStep(step);
    setProfileStatus(status);
  };

  useEffect(() => {
    init();
  }, [profileOverview]);

  return (
    <div>
      <Container>
        <ProfileAvatar>
          {isManiProfile?
            <ManiProfileIcon />:
            <PediProfileIcon />
          }
        </ProfileAvatar>
        {profileOverview?.hasRetakePicsError &&
          <ErrorPanel isManiProfile={isManiProfile} />
        }
        <Box fontFamily='avenirHeavy' fontSize='12px' letterSpacing='4px' pt='16px' pb='16px' color='forecolor.4'>
          {isManiProfile? 'MANI':'PEDI'} PROFILE
        </Box>
        <Box fontSize='12px' pb='12px' color='forecolor.4'>
          {(profileOverview?.hasFitReview && !(profileOverview?.hasRetakePicsError)) ?
            `Your ${isManiProfile? 'Mani': 'Pedi'} profile is all set!`:
            `Improve your profile in only 3 steps and get $${NORMAL_RATE_CREDIT} ManiMoney`
          }
        </Box>
        <ProfileStatusBar
          profileStep={profileStep}
          profileStatus={profileStatus}
          isManiProfile={isManiProfile}
          addedCreditsForFirstFitReview={profileOverview?.addedCreditsForFirstFitReview} />
      </Container>
      <InstructionPanel
        profileStep={profileStep}
        isManiProfile={isManiProfile}
        profileOverview={profileOverview} />
    </div>
  );
};

export default ManiProfile;