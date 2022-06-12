import React from 'react';

import style from './css/how-to-apply-ig.module.css';

const HowToApplyIGSection = () => {
  return (
    <div className={style.container}>
      <div className={style.item}>
        Nothing left to <br /> do but to enjoy <br /> your mani!
      </div>
      <img
        className={style.item}
        src='https://cdn.shopify.com/s/files/1/0253/6561/0605/files/how-to-apply-img1-v1.jpg?v=1612193512'
        alt='how-to-apply' />
      <div className={style.item}>
        Share your look <br /> with with us <br /> @manime.co!
      </div>
      <img
        className={style.item}
        src='https://cdn.shopify.com/s/files/1/0253/6561/0605/files/how-to-apply-img2-v1.jpg?v=1612193512'
        alt='how-to-apply' />

    </div>
  );
};

export default HowToApplyIGSection;