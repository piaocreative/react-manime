import React from 'react';
import Router from 'next/router';
import { DarkButton } from '../../basic/buttons';


import style from './css/capture-success.module.css';

const CaptureSuccess = ({ onClose, isMobileView, email='' }) => {


  return (
    <>
      <img
        className={style.imgMaxTopCoatStyle}
        src={
          'https://d1b527uqd0dzcu.cloudfront.net/web/landing/free-max-top-coat.png'
        }
        alt='future-manicure' />
      <div className={style.actionPanel}>
        <div className={style.inputPanel}>
          <div className={style.title}>FREE MAX TOP <br /> COAT ON US!</div>
          <div className={style.description}>
            Thanks for joining! Check your inbox for a 20% off discount code and receive a Free Max Top Coat with your first purchase.
          </div>
          <DarkButton passedClass={style.joinButton} isSmall onClick={onClose}>
            GET TO KNOW MANIME
          </DarkButton>
        </div>
        <div className={style.greyLine}>
          *Offer valid for your first purchase. Must sign in to redeem.
        </div>
      </div>
    </>
  );
};

export default CaptureSuccess;
