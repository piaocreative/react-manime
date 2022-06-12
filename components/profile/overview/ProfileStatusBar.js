import React from 'react';
import styled from 'styled-components';
import Box from '../../styled/Box';
import { Img } from '../../styled/StyledComponents';
import CheckedIcon from '../../icons/profile/CheckedIcon';
import ManiProfileIcon from '../../icons/profile/ManiProfileIcon';
import PediProfileIcon from '../../icons/profile/PediProfileIcon';

const STATUS_ACTIVE = 0;
const STATUS_DISABLE = 1;
const STATUS_DONE = 2;

const Container = styled(Box)`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: 28px;
  padding: 0 16px;
`;

const StatusItem = styled(Box)`
  display: grid;
  grid-template-columns: auto auto;
  place-content: center;
  place-items: center;
  grid-gap: 6px;
  font-size: 12px;
  font-family: ${props => (props.status === STATUS_ACTIVE && 'avenirHeavy') };
  border: 1px solid;
  border-color: ${props => props.theme.colors.teal};
  background-color: ${props => (props.status !== STATUS_DONE? props.theme.colors.white: props.theme.colors.primary) };
  color: ${props => 
    (props.status === STATUS_ACTIVE ? props.theme.colors.teal: 
    props.status === STATUS_DISABLE ? props.theme.colors.gray:
    props.theme.colors.white) };
`;

const RoundStep = styled(Box)`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  font-size: 12px;
  color: ${props => 
    (props.status === STATUS_ACTIVE ? props.theme.colors.white: 
    props.status === STATUS_DISABLE ? props.theme.colors.white:
    props.theme.colors.white) };
  background-color: ${props => props.theme.colors.teal};
  opacity: ${props => props.status === STATUS_DISABLE && 0.45};
`;

const Avatar = styled(Box)`
  position: absolute;
  left: 0;
  top: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  background-color: ${props => props.theme.colors.white};
  & svg {
    width: 100%;
    height: 100%;
  }
`;

const Drop = styled(Img)`
  position: absolute;
  top: -4px;
  right: 0;
`;

const labels = ['SCAN', 'SHOP', 'RATE'];

const ProfileStatusBar = ({ profileStatus=[], isManiProfile, addedCreditsForFirstFitReview }) => {
  return (
    <Container>
      <Avatar>
        { isManiProfile ?
          <ManiProfileIcon noBorder /> :
          <PediProfileIcon noBorder />
        }
      </Avatar>
      <>
        {profileStatus.map((val, index) => (
          <StatusItem status={val} key={index}>
            {val === STATUS_DONE ? 
              <CheckedIcon />:
              <RoundStep status={val}>{index + 1}</RoundStep>
            }
            {labels[index]}
          </StatusItem>
        ))}
      </>
      <Drop 
        src={addedCreditsForFirstFitReview === 15 ?
          '/static/icons/profile/15-dollar-bubble.svg':
          '/static/icons/profile/5-dollar-bubble.svg'
        }
        alt='dollar-drop' />
    </Container>
  );
};

export default ProfileStatusBar;