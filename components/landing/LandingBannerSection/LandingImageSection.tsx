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
  background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/vibe_check_mob_banner__1.jpg?v=1631541403');
  background-repeat: no-repeat;
  background-position: top center;
  min-height: 600px;
  background-color: #c4e7fb;
  @media (min-width: 1024px) {
    background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/vibe_check_desk_banner_1.jpg?v=1631541385');
    background-position: center right;
    min-height: 600px;
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

  // @media (min-width: 480px) {
  //   width: 100%;
  //   display: block;
  //   height: unset;
  // }

  @media (min-width: 1024px) {
    width: 50%;
    height: 50%;
    padding-top: 0%;
  }
`;

const LandingImageSection  = props => {
  const onManiClick = ev => {
    ev.preventDefault();
    Router.push(pageLinks.SetupManiDesign.url);
  };

  const onPediClick = ev => {
    ev.preventDefault();
    Router.push(pageLinks.SetupPediDesign.url);
  };

  const onGiftClick = ev => {
    ev.preventDefault();
    Router.push(pageLinks.Gift.url);
  };

  return (
    <ImageBgBox3>
      <ContentBox pt={[50, 0]} pb={[60, 0]}>
        <div>
          <Box
            fontSize={['18px', '20px', '26px']}
            letterSpacing='2px'
            my='24px'
            mx='auto'
            textAlign='center'>
              <Box fontFamily='gentiumBasic' width={1} textAlign='center' mx={'auto'} lineHeight={1.5}>
                At-home mani in minutes, <br />
                custom-sized for you!
              </Box>
          </Box>
          <Box display='flex' justifyContent='center' flexDirection={['row', 'row', 'column']}>
            <DarkButton
              passedClass={style.summerButton}
              onClick={onManiClick}>
              Get Your Mani
            </DarkButton>
            <WhiteButton
              passedClass={classNames(style.summerPediButton, style.summerButton)}
              onClick={onGiftClick}>
              &nbsp; Gift Manime &nbsp;
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
