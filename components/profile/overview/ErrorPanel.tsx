import React from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import Box from '../../styled/Box';
import { WhiteButton } from '../../basic/buttons';
import { pageLinks } from '../../../utils/links';
import {getFitVersion} from 'utils/camera'
const Container = styled(Box)`
  display: grid;
  margin-top: 16px;
  background-color: #ec7552;
  padding: 24px 32px;
  & button {
    border: none;
  }

  @media (min-width: 768px) {
    margin-top: 24px;
  }
`;

const TitleBox = styled(Box)`
  font-family: avenirHeavy;
  font-size: 14px;
  letter-spacing: 4px;
  margin-bottom: 10px;
  white-space: nowrap;
`;

const TextBox = styled(Box)`
  font-size: 12px;
`;

const ErrImg = styled.img`
  width: 50px;
  height: 38px;
  margin-right: 16px;
  @media (min-width: 1200px) {
    margin-right: 24px;
  }
`;

const ErrorPanel = ({ isManiProfile }) => {
  const retakeHandler = () => {

    const nextManiScanPath = `${pageLinks.GuidedFitting.url}?skippable=true&returnUrl=${pageLinks.Profile.Account.url}`
    const nextPediScanPath = `${pageLinks.PediFitting.url}$?skippable=true&returnUrl=${pageLinks.Profile.Account.url}`

    const pathname = isManiProfile ? nextManiScanPath : nextPediScanPath;

    Router.push(`${pathname}`);
  };

  return (
    <Container>
      <Box display='flex' mb='20px' justifyContent='center' alignItems='center'>
        <Box>
          <ErrImg src='/static/icons/profile/error-profile-icon.svg' alt='error-profile' />
        </Box>
        <Box textAlign='left'>
          <TitleBox>ERROR - RETAKE PICS</TitleBox>
          <TextBox>We need you to retake them</TextBox>
        </Box>
      </Box>
      <WhiteButton onClick={retakeHandler}>RETAKE PICS NOW</WhiteButton>
    </Container>
  );
};

export default ErrorPanel;
