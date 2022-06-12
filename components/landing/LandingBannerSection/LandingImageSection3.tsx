import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Router from 'next/router';
import Box from '../../styled/Box';
import { WhiteButton } from '../../basic/buttons';
import ManimeLogo from '../../icons/ManimeLogo';
import { pageLinks } from '../../../utils/links';
import { ImageBgBox } from './LandingBannerCommon';
import style from './css/landing.module.css';

const ImageBgBox3 = styled(ImageBgBox)`
  background-color: #f8f3f0;
`;

const ContentBox = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 24px 16px 69px;
  width: 100%;
  height: 100%;
  @media (min-width: 768px) {
    padding: 48px 96px 96px;
    flex-direction: column;
  }

`;

const TitleBox = styled(Box)`
  display: flex;
  justify-content: center;
  font-family: 'avenirHeavy';
  font-size: 17px;
  text-align: center;
  margin-bottom: 8px;
  text-transform: uppercase;
  @media (min-width: 768px) {
    font-size: 20px;
    letter-spacing: 1px;
  }
`;

const DescriptionBox = styled(Box)`
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 13px;
  margin-bottom: 24px;
  @media (min-width: 768px) {
    font-size: 20px;
    margin-bottom: 40px;
    letter-spacing: 1px;
  }
`;

const MainBox = styled(Box)`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const MadelinePooleBox = styled(Box)`
  background-image: url('https://d1b527uqd0dzcu.cloudfront.net/desktop/landing-mp-banner-desktop.jpg');
  background-repeat: no-repeat;
  background-position: left;
  background-size: cover;
  width: 100%;
  height: calc(50% - 36px);
  display: flex;
  align-items: center;
  justify-content: flex-end;

  @media (min-width: 768px) {
    width: 50%;
    height: 100%;
  }
`;

const HangEditBox = styled(Box)`
  background-image: url('https://d1b527uqd0dzcu.cloudfront.net/desktop/landing-hang-banner-desktop.jpg');
  background-repeat: no-repeat;
  background-position: right;
  background-size: cover;
  width: 100%;
  height: calc(50% - 36px);
  display: flex;
  align-items: center;
  justify-content: flex-start;

  @media (min-width: 768px) {
    width: 50%;
    height: 100%;
  }
`;

const MadelineContentBox = styled(Box)`
  position: relative;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (min-width: 768px) {
    width: 100%;
    height: 100%;
  }
`;

const SubTitleBox = styled(Box)`
  font-family: 'gentiumBasic';
  @media (min-width: 768px) {
    position: absolute;
    font-family: 'avenirHeavy';
    font-size: 20px;
    transform: translate(-50%, -50%);
    top: 0;
    left: 50%;
    text-transform: uppercase;
    white-space: nowrap;
  }
`;

const ManimeDesigner = styled(Box)`
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;

  @media (min-width: 768px) {
    width: 300px;
    justify-content: space-between;
  }
`;

const Seperator = styled(Box)`
  width: 1px;
  height: 120px;
  background-color: #2c4349;
  transform: skewX(-45deg);

  @media (min-width: 140px) {
    height: 140px;
  }
`;

const LandingImageSection  = props => {
  const onClick = path => () => {
    // props.trackFunnelAction('A. Landing Page - Get Your Set Now');
    props.trackFunnelActionProjectFunnel('A. Landing Page - Get Your Set Now');
    Router.push(path || pageLinks.SetupDesign.url);
  };

  return (
    <ImageBgBox3>
      <ContentBox>
        <TitleBox>CUTEST NAIL ART FOR YOU</TitleBox>
        <DescriptionBox>Manis by the best </DescriptionBox>
        <MainBox>
          <MadelinePooleBox>
            <MadelineContentBox>
              <SubTitleBox>Madeline Poole</SubTitleBox>
              <div className={style.discoverButton}>
                <WhiteButton onClick={onClick(pageLinks.Designer['Madeline Poole'].url)}>
                  DISCOVER
                </WhiteButton>
              </div>
            </MadelineContentBox>
          </MadelinePooleBox>
          <ManimeDesigner>
            <ManimeLogo className={style.manimeLogo} />
            <Seperator width='1px' height='100px' />
            <Box fontFamily='gentiumBasic' fontSize={['20px', '24px']}>Designers</Box>
          </ManimeDesigner>
          <HangEditBox>
            <MadelineContentBox>
              <SubTitleBox>The Hang Edit</SubTitleBox>
              <div className={style.discoverButton}>
                <WhiteButton onClick={onClick(pageLinks.Designer['Hang Nguyen'].url)}>
                  DISCOVER
                </WhiteButton>
              </div>
            </MadelineContentBox>
          </HangEditBox>
        </MainBox>
      </ContentBox>
    </ImageBgBox3>
  );
}

const mapStateToProps = state => ({
  userData: state.userData
});

export default connect(mapStateToProps, null)(LandingImageSection);
