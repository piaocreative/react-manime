import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { UI_SET_KEY_VALUE } from '../../actions';

const BannerBox = styled.div`
  cursor: pointer;
  background-color: ${props => `url(${props.bgColor})`};
  background-image: ${props => `url(${props.mobileBgImg})`};
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: calc(100% - 40px);
  margin: 0 auto 16px;
  min-height: 160px;

  @media (min-width: 768px) {
    width: 100%;
    height: 256px;
  }

  @media (min-width: 1024px) {
    height: 156px;
    background-image: ${props => `url(${props.desktopBgImg})`};
    background-size: cover;
    margin: 0 auto 32px;
  }


  @media (min-width: 1400px) {
    height: 172px;
  }

  @media (min-width: 1600px) {
    height: 200px;
  }
`;

type PropsType = {
  bgColor?: string,
  mobileBgImg: string,
  desktopBgImg: string,
  product: any
};

const JoinWaitListBanner = ({
  bgColor='#5d7277',
  mobileBgImg='',
  desktopBgImg='',
  product=undefined
}: PropsType) => {
  const dispatch = useDispatch();

  const joinWaitListHandler = () => {
    dispatch(UI_SET_KEY_VALUE('joinWaitList', {
      productId: '',
      open: true,
      product: product
    }));
  };

  return (
    <BannerBox
      bgColor={bgColor}
      mobileBgImg={mobileBgImg}
      desktopBgImg={desktopBgImg}
      onClick={joinWaitListHandler} />
  );
};

export default JoinWaitListBanner;
