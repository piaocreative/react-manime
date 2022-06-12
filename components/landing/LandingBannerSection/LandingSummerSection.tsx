import React from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Router from 'next/router';
import Box from '../../styled/Box';
import { DarkButton, WhiteButton } from '../../basic/buttons';
import { pageLinks } from '../../../utils/links';
import { ImageBgBox } from './LandingBannerCommon';
import style from './css/landing.module.css';

const ImageBgBox3 = styled(ImageBgBox)`
  // S3: background-image: url('https://d1b527uqd0dzcu.cloudfront.net/mobile/manime-landing-summer-mobile.jpg');
  background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/manime-landing-summer-mobile.jpg?v=1595450965');
  background-repeat: no-repeat;
  background-position: bottom center;
  @media (min-width: 480px) {
    // S3: background-image: url('https://d1b527uqd0dzcu.cloudfront.net/desktop/manime-landing-summer-desktop.jpg');
    background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/manime-landing-summer-desktop.jpg?v=1595450965');
    background-position: bottom center;
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


const LandingSummerSection  = props => {
  const onManiClick = ev => {
    ev.preventDefault();
    Router.push(pageLinks.SetupManiDesign.url);
  };

  const onPediClick = ev => {
    ev.preventDefault();
    Router.push(pageLinks.SetupPediDesign.url);
  };

  return (
    <ImageBgBox3>
      <ContentBox pt={[50, 0]} pb={[60, 0]}>
        <div>
          <TextBox
            fontSize={['18px', '20px', '26px']}
            letterSpacing='2px'
            my='24px'
            mx='auto'
            textAlign='center'>
              <Box fontFamily='gentiumBasic' width={1} textAlign='center' mx={'auto'} lineHeight={1.5} color={['#fff', '#fff', 'unset']}>
                At-home mani in minutes, <br />
                custom-sized for you!
              </Box>
              {/* <Box width={1} textAlign='center' mt={3} fontSize={['14px', '16px', '18px']} maxWidth={['270px', '300px', '340px']} mx='auto'>
                Let custom-fit manis and pedis take you to the destination of your dreams. 
              </Box> */}
          </TextBox>
          <Box display='flex' justifyContent='center' flexDirection={['row', 'row', 'column']}>
            <DarkButton
              passedClass={style.summerButton}
              onClick={onManiClick}>
              GET YOUR MANI
            </DarkButton>
            <WhiteButton
              passedClass={classNames(style.summerPediButton, style.summerButton)}
              onClick={onPediClick}>
              GET YOUR PEDI
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

export default connect(mapStateToProps, null)(LandingSummerSection);
