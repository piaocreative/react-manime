import Router from 'next/router';
import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import styled from 'styled-components';

import Box from '../../styled/Box';
import { DarkButton } from '../../basic/buttons';
import style from '../../../static/components/design/mp100.module.css';

const Container = styled(Box)`
  position: relative;
  padding: 10px 12px 45px;
  width: 50%;
  height: 360px;
  text-transform: uppercase;

  @media (min-width: 480px) {
    height: 53vh;
  }

  @media (min-width: 768px) {
    width: 50%;
    height: 280px;
  }

  @media (min-width: 1540px) {
    height: 344px;
  }
`;

const TitleBox = styled(Box)`
  top: 5%;
  height: 20%;
  width: 80%;
  text-align: center;
  font-size: 13px;
  transform: translate(-50%, 0);
  left: 50%;
  letter-spacing: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (min-width: 768px) {
    left: 25%;
    top: 10%;
    height: 40%;
    font-size: 18px;
    width: 40%;
  }

  @media (min-width: 1024px) {
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
  @media (min-width: 768px) {
    left: 25%;
    bottom: 80px;
  }

  @media (min-width: 1540px) {
    bottom: 120px;
  }
`;

const ImagePanel = styled(Box)`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-color: ${props => props.backgroundColor || '#ebdebc'};
  background-position: center;
  background-repeat: no-repeat;
  background-image: ${props => `url(${props.mobileImage})`};
  @media (min-width: 768px) {
    background-position: top;
    background-image: ${props => `url(${props.desktopImage})`};
  }

  @media (min-width: 1540px) {
    background-position: right;
    background-size: cover;
  }
`;

const DataDrivenPromotion = props => {
  if (!props.promotion) return null;
  const {
    backgroundImageDesktop,
    backgroundImageMobile,
    backgroundImageDesktopUrl,
    backgroundImageMobileUrl,
    backgroundColor,
    buttonText,
    buttonTextColor,
    headlineText,
    headlineTextColor,
    buttonColor,
    buttonLinkUrl,
  } = props.promotion;

  // console.log({at: 'DataDrivenPromotion', promotion: props.promotion});

  const backgroundDesktop = backgroundImageDesktop || backgroundImageDesktopUrl;
  const backgroundMobile = backgroundImageMobile || backgroundImageMobileUrl;

  // console.log({at: 'DataDrivenPromotion', backgroundDesktop, backgroundMobile})

  const actionHandler = () => {
    Router.push(buttonLinkUrl);
  };

  return (
    <Container>
      <TitleBox position="absolute" style={{ color: headlineTextColor }}>
        {ReactHtmlParser(headlineText)}
      </TitleBox>

      <DescriptionBox>
        <DarkButton
          isSmall
          passedClass={style.actionButton}
          onClick={actionHandler}
          style={{
            color: buttonTextColor,
            backgroundColor: buttonColor,
          }}
        >
          {buttonText}
        </DarkButton>
      </DescriptionBox>
      <ImagePanel
        desktopImage={backgroundDesktop}
        mobileImage={backgroundMobile}
        backgroundColor={backgroundColor}
      />
    </Container>
  );
};

export default DataDrivenPromotion;
