import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Router from 'next/router';
import Box from '../../styled/Box';
import { DarkButton, WhiteButton } from '../../basic/buttons';
import { pageLinks } from '../../../utils/links';
import { ImageBgBox } from './LandingBannerCommon';
import style from './css/landing.module.css';

const ImageBgBox3 = styled(ImageBgBox)`
  background-image: url('https://d1b527uqd0dzcu.cloudfront.net/mobile/manime-landing-mobile-v9.jpg');
  background-repeat: no-repeat;
  @media (min-width: 480px) {
    background-image: url('https://d1b527uqd0dzcu.cloudfront.net/desktop/manime-landing-desktop-v9.jpg');
  }  
`;

const ContentBox = styled(Box)`
  position: absolute;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 16px;

  @media (min-width: 480px) {
    width: 100%;
    display: block;
    height: unset;
  }

  @media (min-width: 768px) {
    width: 50%;
  }
`;

const TextBox = styled(Box)`
  & > div {
    color: #fff;
  }
  @media (min-width: 768px) {
    & > div {
      color: #2c4349;
    } 
  }
`;


const LandingImageSection  = props => {
  const onClick = ev => {
    // props.trackFunnelAction('A. Landing Page - Get Your Set Now');
    props.trackFunnelActionProjectFunnel('A. Landing Page - Get Your Set Now');
    ev.preventDefault();
    Router.push(pageLinks.SetupDesign.url);
  };

  const onGiftMomClick = ev => {
    // props.trackFunnelAction('A. Landing Page -Gift Mom');
    props.trackFunnelActionProjectFunnel('A. Landing Page -Gift Mom');
    ev.preventDefault();
    Router.push(pageLinks.Gift.url);
  };

  return (
    <ImageBgBox3>
      <ContentBox pt={[50, 0]} pb={[60, 0]}>
        <div>
          <TextBox
            fontSize={['22px', '24px', '32px']}
            letterSpacing='2px'
            my='24px'
            mx='auto'
            textAlign='center'>
              <Box width={1} textAlign='center' mx={'auto'} fontFamily='gentiumBasic'>Treat mom like a queen</Box>
              <Box width={1} textAlign='center' mt={3} fontSize={['15px', '18px', '22px']}>
                At-home mani <br />
                custom-made for her 
              </Box>
          </TextBox>
          <Box display='flex' justifyContent='center'>
            <DarkButton
              onClick={onClick}>
              GET MANI
            </DarkButton>
            <WhiteButton
              passedClass={style.giftMomButton}
              onClick={onGiftMomClick}>
              GIFT MOM
            </WhiteButton>
          </Box>
        </div>
      </ContentBox>
    </ImageBgBox3>
  );
}

const mapStateToProps = state => ({
  userData: state.userData
});

export default connect(mapStateToProps, null)(LandingImageSection);
