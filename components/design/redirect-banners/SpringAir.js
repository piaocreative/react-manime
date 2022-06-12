import React from 'react';
import styled from 'styled-components';
import Router from 'next/router';
import Box from '../../styled/Box';
import { DarkButton } from '../../basic/buttons';
import { pageLinks } from '../../../utils/links';
import style from '../../../static/components/design/mp100.module.css';

const Container = styled(Box)`
  position: relative;
  padding: 10px 12px 45px;
  width: 50%;
  height: 360px;

  @media(min-width: 480px) {
    height: 53vh;
  }

  @media(min-width: 768px) {
    width: 50%;
    height: 280px;
  }

  @media(min-width: 1540px) {
    height: 344px;
  }
`;

const TitleBox = styled(Box)`
  top: 40px;
  width: 100%;
  text-align: center;
  font-size: 13px;
  transform: translate(-50%, 0);
  left: 50%;
  max-width: 120px;
  letter-spacing: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media(min-width: 768px) {
    left: 25%;
    top: 50px;
    font-size: 18px;
    max-width: 190px;
  }

  @media(min-width: 1024px) {
    top: 80px;
    font-size: 24px;
  }
`;

const DescriptionBox = styled(Box)`
  position: absolute;
  bottom: 70px;
  transform: translate(-50%, 0);
  left: 50%;
  text-align: center;
  letter-spacing: 1px;
  @media(min-width: 768px) {
    left: 25%;
    bottom: 80px;
  }

  @media(min-width: 1540px) {
    bottom: 120px;
  }
`;

const ImagePanel = styled(Box)`
  width: 100%;
  height: 100%;
  background-image: url('https://d1b527uqd0dzcu.cloudfront.net/web/design/redirect-banners/redirect-spring-air-mobile.jpg');
  background-size: cover;
  background-position: bottom;
  background-color: #e7e7e7;
  background-repeat: no-repeat;

  @media(min-width: 414px) {
    background-size: cover;
    background-position: right;
  }
  @media(min-width: 768px) {
    background-position: center;
    background-position: top;
    background-image: url('https://d1b527uqd0dzcu.cloudfront.net/web/design/redirect-banners/redirect-spring-air-desktop.jpg');
  }

  @media(min-width: 1540px) {
    background-position: right;
    background-color: #e6e6e4;
    background-size: contain;
  }

`;

const SpringAir = () => {
  const actionHandler = () => {
    Router.push(pageLinks.Collection['In the Air'].url);
  };

  return (
    <Container>
      <TitleBox position='absolute'>
        SPRING IS IN THE AIR
      </TitleBox>

      <DescriptionBox>
        <DarkButton isSmall passedClass={style.actionButton} onClick={actionHandler}>
          DISCOVER COLLECTION
        </DarkButton>
      </DescriptionBox>
      <ImagePanel />
    </Container>
  );
}

export default SpringAir;