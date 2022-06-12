import React from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import Box from '../../styled/Box';
import { DarkButton } from '../../basic/buttons';
import { pageLinks } from '../../../utils/links';
import { ImageBgBox } from './LandingBannerCommon';

const ImageBgBox3 = styled(ImageBgBox)`
  background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/manime-landing-mobile-care-v01.jpg?v=1592558620');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #f5eee6;
  @media (min-width: 480px) {
    background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/manime-landing-desktop-care-v01.jpg?v=1592558620');
  }  
`;

const ContentBox = styled(Box)`
  position: absolute;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (min-width: 480px) {
    width: 100%;
    height: unset;
  }
`;

const TextBox = styled(Box)`
  & > div {
    color: #2c4349;
  }
`;

const HowWeCareImg = styled.img`
  width: 160px;
  @media (min-width: 480px) {
    width: 212px;
  }
`;

const CovidCareBlmImg = styled(Box)`
  width: 106px;
  height: 272px;
  margin: 36px 0;
  background-image: url('/static/icons/covid-care-blm-mobile.svg');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  @media (min-width: 768px) {
    width: 670px;
    height: 144px;
    margin: 60px 0 40px;
    background-image: url('/static/icons/covid-care-blm-desk.svg');
  }
`;

const TextPanel = styled(Box)`
  font-size: 14px;
  text-align: center;
  width: 260px;
  margin-bottom: 24px;
  @media (min-width: 768px) {
    width: 520px;
    font-size: 18px;
  }
`;

const LandingCareImageSection  = props => {
  const onClick = ev => {
    ev.preventDefault();
    // props.trackFunnelAction('A. Landing Page - Get Your Set Now');
    props.trackFunnelActionProjectFunnel('A. Landing Page - Get Your Set Now');
    Router.push(pageLinks.Collection['Care'].url);
  };

  return (
    <ImageBgBox3>
      <ContentBox pt={[40, 0]} pb={[60, 0]}>
        <HowWeCareImg src='/static/icons/how-we-care.svg' alt='howwecare' />
        <CovidCareBlmImg />
        <TextPanel>
          ManiMe is donating CARE collection profits to the PBA COVID-19 Relief Fund and the Movement for Black Lives Fund
        </TextPanel>
        <DarkButton
          onClick={onClick}>
          VIEW THE COLLECTION
        </DarkButton>
      </ContentBox>
    </ImageBgBox3>
  );
}

export default LandingCareImageSection;
