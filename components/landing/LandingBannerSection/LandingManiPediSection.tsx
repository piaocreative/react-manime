import React from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import Box from '../../styled/Box';
import { DarkButton, OutlinedDarkButton } from '../../basic/buttons';
import { pageLinks } from '../../../utils/links';
import { ImageBgBox } from './LandingBannerCommon';

const ImageBgBox3 = styled(ImageBgBox)`
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const SemiSection = styled(Box)`
  width: 100%;
  height: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  @media (min-width: 768px) {
    width: 50%;
    height: 100%;
    padding-top: 40px;
  }
`;

const ManiSection = styled(SemiSection)`
  background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/landing-mani.jpg?v=1595066616');
  @media (min-width: 768px) {
    background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/landing-mani-desktop.jpg?v=1595066616');
  }
`;

const PediSection = styled(SemiSection)`
  background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/landing-pedi.jpg?v=1595066616');
  @media (min-width: 768px) {
    background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/landing-pedi-desktop.jpg?v=1595066616');
  }
`;

const TitleBox = styled(Box)`
  font-family: 'gentiumBasic';
  font-size: 15px;
  letter-spacing: 1px;
  margin-bottom: 16px;
  @media (min-width: 768px) {
    font-size: 20px;
    letter-spacing: 2px;
  }
`;

const LandingPediSection  = props => {
  const onManiClick = ev => {
    ev.preventDefault();
    // props.trackFunnelAction('A. Landing Page - Get Your Mani Set Now');
    props.trackFunnelActionProjectFunnel('A. Landing Page - Get Your Mani Set Now');
    Router.push(pageLinks.SetupManiDesign.url);
  };

  const onPediClick = ev => {
    ev.preventDefault();
    // props.trackFunnelAction('A. Landing Page - Get Your Pedi Set Now');
    props.trackFunnelActionProjectFunnel('A. Landing Page - Get Your Pedi Set Now');
    Router.push(pageLinks.SetupPediDesign.url);
  };

  return (
    <ImageBgBox3>
      <ManiSection>
        <TitleBox>At-home Mani in minutes</TitleBox>
        <DarkButton onClick={onManiClick}>GET YOUR MANI</DarkButton>
      </ManiSection>
      <PediSection>
        <TitleBox>Your feet have been waiting</TitleBox>
        <OutlinedDarkButton onClick={onPediClick}>GET YOUR PEDI</OutlinedDarkButton>
      </PediSection>
    </ImageBgBox3>
  );
}

export default LandingPediSection;
