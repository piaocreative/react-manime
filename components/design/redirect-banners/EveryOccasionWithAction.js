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
  max-width: 156px;
  letter-spacing: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media(min-width: 768px) {
    left: 25%;
    top: 50px;
    font-size: 18px;
    max-width: 240px;
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
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('https://d1b527uqd0dzcu.cloudfront.net/web/design/redirect-banners/redirect-every-occasionv-mobile.jpg');
  @media(min-width: 768px) {
    background-position: top;
    background-image: url('https://d1b527uqd0dzcu.cloudfront.net/web/design/redirect-banners/redirect-every-occasionv-desktop.jpg');
  }
  @media(min-width: 1540px) {
    background-position: right;
    background-color: #e5dad6;
    background-size: cover;
  }
`;

const EveryOccasionWithAction = () => {
  const actionHandler = () => {
    Router.push(pageLinks.SetupDesign.url);
  };
  
  return (
    <Container>
      <TitleBox position='absolute'>
        A DESIGN FOR <br />
        EVERY OCCASION
      </TitleBox>

      <DescriptionBox>
        <DarkButton isSmall passedClass={style.actionButton} onClick={actionHandler}>
          BROWSE ALL DESIGNS
        </DarkButton>
      </DescriptionBox>
      <ImagePanel />
    </Container>
  );
}

export default EveryOccasionWithAction;