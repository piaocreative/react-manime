import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { pageLinks } from 'utils/links';

const A = styled.a`
  width: 100%;
`;

const BannerBox = styled.div`
  cursor: pointer;
  background-color: ${props => `url(${props.bgColor})`};
  background-image: ${props => `url(${props.mobileBgImg})`};
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: calc(100% - 40px);
  margin: 0 auto 16px;
  min-height: 170px;

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

  @media (min-width: 1200px) {
    height: 200px;
  }

  @media (min-width: 1600px) {
    height: 260px;
  }

  @media (min-width: 2000px) {
    height: 320px;
  }
`;

export default function GalleryBanner ({
  bgColor,
  mobileBgImg,
  desktopBgImg,
}) {

  return (
    <Link href={pageLinks.ShopEssentials.url}>
      <A>
        <BannerBox
          bgColor={bgColor}
          mobileBgImg={mobileBgImg}
          desktopBgImg={desktopBgImg} />
      </A>
    </Link>
  );
}