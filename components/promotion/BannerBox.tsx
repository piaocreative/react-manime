import React from 'react';
import GiftingBanner from './GiftingBanner';
import style from './css/banner-box.module.css';

const BannerBox = () => {
  return (
    <div className={style.container}>
      <GiftingBanner />
    </div>
  )
};

export default BannerBox;