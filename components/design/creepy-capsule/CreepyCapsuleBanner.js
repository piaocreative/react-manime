import React from 'react';
import styled from 'styled-components';
import Box from '../../styled/Box';

const Container = styled(Box)`
  position: relative;
  padding: 10px 12px 45px;
  width: 50%;
  @media(min-width: 1024px) {
    width: 25%;
  }
`;

const TitleBox = styled(Box)`
  position: absolute;
  font-size: 12px;
  font-family: gentiumBasic;
  top: 28px;
  width: 100%;
  text-align: center;
  transform: translate(-50%, 0);
  left: 50%;
  color: #fff;
  letter-spacing: 2px;
  line-height: 1.4;
  @media(min-width: 768px) {
    top: 36px;
    font-size: 20px;
    letter-spacing: 4px;
  }
`;

const ImagePanel = styled(Box)`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/creepy-capsule-banner-mobile.jpg?v=1602684559');
  @media(min-width: 768px) {
    background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/creepy-capsule-banner-desktop.jpg?v=1602684559');
  }
`;

const CreepyCapsuleBanner = () => {
 
  return (
    <Container>
      <TitleBox>
        Ghastly, ghoulish, <br /> and downright <br /> terrifying
      </TitleBox>
      <ImagePanel />
    </Container>
  );
}

export default CreepyCapsuleBanner;