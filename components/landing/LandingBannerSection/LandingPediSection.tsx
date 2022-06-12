import React from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import Box from '../../styled/Box';
import { DarkButton } from '../../basic/buttons';
import { pageLinks } from '../../../utils/links';
import { ImageBgBox } from './LandingBannerCommon';
import CareNailIcon from '../../icons/CareNailIcon';

const ImageBgBox3 = styled(ImageBgBox)`
  background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/pedi-landing-mobile.jpg?v=1594671642');
  background-repeat: no-repeat;
  background-color: #f2e9ea;
  @media (min-width: 480px) {
    background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/pedi-landing-desktop.jpg?v=1594671642');
  }

  @media (min-width: 1440px) {
    background-position: 4% 100%;
  }
`;

const ContentBox = styled(Box)`
  position: absolute;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  @media (min-width: 480px) {
    width: 100%;
    display: block;
    height: unset;
  }

  @media (min-width: 768px) {
    width: 50%;
  }
`;

const TitleBox = styled(Box)`
  font-size: 16px;
  letter-spacing: 2px;
  text-transform: uppercase;
  line-height: 1.5;
  margin-bottom: 16px;
  @media (min-width: 480px) {
    font-size: 20px;
  }
`;

const TitleImg = styled(Box)`
  width: 300px;
  height: 46px;
  margin: 0 auto 16px;
  background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/pedi-landing-title-mobile.svg?v=1594673236');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  @media (min-width: 768px) {
    width: 500px;
    height: 100px;
    margin: 0 auto 20px;
    background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/pedi-landing-title-desktop.svg?v=1594673237');
    background-position: calc(50% - 10px);
  }
`;

const LandingPediSection  = props => {
  const onClick = ev => {
    ev.preventDefault();
    // props.trackFunnelAction('A. Landing Page - Get Your Set Now');
    props.trackFunnelActionProjectFunnel('A. Landing Page - Get Your Set Now');
    Router.push(pageLinks.SetupPediDesign.url);
  };

  return (
    <ImageBgBox3>
      <ContentBox pt={[20, 0]} pb={[60, 0]}>
        <div>
          <TitleImg />
          <TitleBox>Your Feet Have <br />Been Waiting</TitleBox>
          <Box display='flex' justifyContent='center'>
            <DarkButton
              onClick={onClick}>
              GET YOUR PEDI
            </DarkButton>
          </Box>
        </div>
      </ContentBox>
    </ImageBgBox3>
  );
}

export default LandingPediSection;
