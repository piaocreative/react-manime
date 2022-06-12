import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Router from 'next/router';
import Box from '../../styled/Box';
import { DarkButton } from '../../basic/buttons';

import { pageLinks } from '../../../utils/links';
import { ImageBgBox } from './LandingBannerCommon';
import style from './css/landing.module.css';

const ImageBgBox3 = styled(ImageBgBox)`
  background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/manime-landing-mobile-v10.jpg?v=1592575681');
  background-repeat: no-repeat;
  @media (min-width: 480px) {
    background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/manime-landing-desktop-v10.jpg?v=1592575682');
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

const IconsBox = styled(Box)`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  font-size: 13px;
  letter-spacing: 1px;
  @media (min-width: 480px) {
    font-size: 20px;
  }
`;

const LandingImageSection  = props => {
  const onClick = ev => {
    ev.preventDefault();
    // props.trackFunnelAction('A. Landing Page - Get Your Set Now');
    props.trackFunnelActionProjectFunnel('A. Landing Page - Get Your Set Now');
    Router.push(pageLinks.HowItWorks.url);
  };

  return (
    <ImageBgBox3>
      <ContentBox pt={[50, 0]} pb={[60, 0]}>
        <div>
          <Box
            fontSize={['17px', '18px', '20px']}
            letterSpacing='2px'
            my='24px'
            mx='auto'
            textAlign='center'>
              <Box width={1} textAlign='center' mx={'auto'} fontFamily='avenirHeavy'>HEALTHY MANICURES</Box>
              <IconsBox>
                <Box display='flex' alignItems='center' justifyContent='center' width={1}>
                  <img className={style.toxinFree} src='https://cdn.shopify.com/s/files/1/0253/6561/0605/files/toxin-free.svg?v=1592775143' loading='lazy' alt='toxin-free' />
                  <Box ml={['8px', '12px']} mr='36px' maxWidth={['36px', 'unset']}>Toxin-free</Box>
                  <img className={style.crueltyFree} src='https://cdn.shopify.com/s/files/1/0253/6561/0605/files/cruelty-free.svg?v=1592775144' loading='lazy' alt='cruelty-free' />
                  <Box ml={['8px', '12px']} maxWidth={['48px', 'unset']}>Cruelty-free</Box>
                </Box>
              </IconsBox>
          </Box>
          <Box display='flex' justifyContent='center'>
            <DarkButton
              onClick={onClick}>
              FIND OUT MORE
            </DarkButton>
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
