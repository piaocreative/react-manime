import React from 'react';
import classNames from 'classnames';
import style from './css/landing-guarantee.module.css';
import SmileIcon from '../../../icons/Smile';

const imgMobileSrc = 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/guarantee-mobile-v2.jpg?v=1595969804';
const imgDesktopSrc = 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/guarantee-desktop-v2.jpg?v=1595969804';

const LandingGuaranteeSection = ({ isMobileView }) => {
  return (
    <div className={style.container}>
      <img
        className={style.imgStyle}
        src={isMobileView ? imgMobileSrc : imgDesktopSrc}
        loading='lazy'
        alt='happiness-guarantee' />
      <div className={style.textWrapper}>
        <span className={classNames(style.line1, style.line)}>
          <SmileIcon className={style.smile} /> 100% HAPPINESS GUARANTEED 100% HAPPINESS GUARANTEED <SmileIcon className={classNames(style.smile, style.smileDesktop)} /> 100% HAPPINESS GUARANTEED 100% HAPPINESS GUARANTEED
        </span>
        <span className={classNames(style.line2, style.line)}>
          <SmileIcon className={style.smile} /> 100% HAPPINESS GUARANTEED 100% HAPPINESS GUARANTEED <SmileIcon className={classNames(style.smile, style.smileDesktop)} /> 100% HAPPINESS GUARANTEED 100% HAPPINESS GUARANTEED
        </span>
      </div>
      <div className={style.whitePanel}>
        We're committed to the idea that a fresh Mani should spark joy. Not 100% satisfied? Shoot us a note at <a className={style.underline} href={'mailTo:care@manime.co'}>care@manime.co</a> and we'll take care of any issue.
      </div>
    </div>
  );
};

export default LandingGuaranteeSection;