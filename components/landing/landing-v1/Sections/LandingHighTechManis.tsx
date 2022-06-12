import React from 'react';
import Router from 'next/router';
import { useSelector } from 'react-redux';

import { PrimaryButton, DarkButton } from '../../../basic/buttons';
import style from './css/landing-hightech-manis.module.css';
import { pageLinks } from '../../../../utils/links';
import videoLinks from '../../../../utils/videoLinks';

const LandingHighTechManis = ({ isMobileView }) => {
  const isAuth = useSelector((state : any) => state?.userData?.isAuth);
  const navToAuthHandler = () => {
    if (isAuth) {
      Router.push(pageLinks.SetupDesign.url);
    } else
      Router.push(pageLinks.SignUp.url);
  }

  const Button = isMobileView ? PrimaryButton: DarkButton;

  return (
    <div className={style.container}>
      <div className={style.rectPanel}>
        <div className={style.textPanel}>
          HIGH TECH MANI
          <div className={style.description}>
            We 3D scan your nails to <br /> custom fit your manis
          </div>
        </div>
        <Button
          passedClass={style.getManiButton}
          onClick={navToAuthHandler}>
          GET STARTED
        </Button>
      </div>
      {isMobileView ?
        <video width="100%" height="100%" autoPlay loop muted playsInline
          className={style.videoStyle} key='mobileVideo'>
            <source src={videoLinks.highTechManis.mobileUrl} type="video/mp4" key='mobile' />
          Your browser does not support the video tag.
        </video>:
        <video width="100%" height="100%" autoPlay loop muted playsInline
          className={style.videoStyle} key='desktopVideo'>
            <source src={videoLinks.highTechManis.desktopUrl} type="video/mp4" key='desktop' />:
          Your browser does not support the video tag.
        </video>
      }
    </div>
  );
}

export default LandingHighTechManis;
