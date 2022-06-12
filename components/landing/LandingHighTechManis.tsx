import React from 'react';
import Router from 'next/router';
import { useSelector } from 'react-redux';

import { DarkButton } from '../basic/buttons';
import style from '../../static/components/landing/landing-hightech-manis-v2.module.css';
import { pageLinks } from '../../utils/links';

const LandingHighTechManis = ({ isMobileView }) => {
  const isAuth = useSelector((state : any) => state?.userData?.isAuth);

  const navToFittingHandler = () => {
    Router.push(pageLinks.GuidedFitting.url);
  }

  const isClient = typeof window !== 'undefined'

  return (
    <div className={style.container}>
      <div className={style.textPanel}>
        <div className={style.title}>
          HIGH TECH <br />
          PERSONALIZATION
        </div>
        <div className={style.description}>
          We 3D Scan your nails with your smartphone. Each Mani fits you and only you. Don’t loan anyone your nails; they won’t fit.
        </div>
        <DarkButton
          passedClass={style.getManiButton}
          onClick={navToFittingHandler}>
          TAKE YOUR PHOTOS NOW
        </DarkButton>
      </div>
      {!isClient?
        null:
        <img
          loading="lazy"
          className={style.videoStyle}
          src={isMobileView?
            'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/landing-high-tech-mobile.jpg?v=1599078975':
            'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/landing-high-tech-desktop.jpg?v=1599078975'
          } />
      }
    </div>
  );
}

export default LandingHighTechManis;
