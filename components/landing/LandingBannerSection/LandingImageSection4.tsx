import React from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import Box from '../../styled/Box';
import { DarkButton } from '../../basic/buttons';
import { pageLinks } from '../../../utils/links';
import { ImageBgBox } from './LandingBannerCommon';
import CareNailIcon from '../../icons/CareNailIcon';

const ImageBgBox3 = styled(ImageBgBox)`
  background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/manime-landing-mobile-united-care1.jpg');
  background-repeat: no-repeat;
  background-color: #f2e9ea;
  @media (min-width: 480px) {
    background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/manime-landing-desktop-united-care1.jpg');
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

const IconBox = styled(Box)`
  display: none;
  @media (min-width: 768px) {
    display: block;
    width: 76px;
    height: 88px;
    margin: 0px auto 24px;
    & > svg {
      width: 100%;
      height: 100%;
    }
  }
`;

const TitleImg = styled(Box)`
  width: 300px;
  height: 54px;
  margin: 0 auto 16px;
  background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/artists-unitedby-care.svg?v=1592775144');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  @media (min-width: 768px) {
    width: 500px;
    height: 61px;
    margin: 0 auto 40px;
    // background-image: url('/static/icons/covid-care-blm-desk.svg');
  }
`;

const LandingImageSection  = props => {
  const onClick = ev => {
    ev.preventDefault();
    props.trackFunnelAction('A. Landing Page - Get Your Set Now');
    props.trackFunnelActionProjectFunnel('A. Landing Page - Get Your Set Now');
    Router.push(pageLinks.SetupDesign.url);
  };

  return (
    <ImageBgBox3>
      <ContentBox pt={[20, 0]} pb={[60, 0]}>
        <div>
          <IconBox>
            <CareNailIcon />
          </IconBox>
          <TitleImg />
          <Box display='flex' justifyContent='center'>
            <DarkButton
              onClick={onClick}>
              SHOP CARE COLLECTION
            </DarkButton>
          </Box>
        </div>
      </ContentBox>
    </ImageBgBox3>
  );
}

export default LandingImageSection;
