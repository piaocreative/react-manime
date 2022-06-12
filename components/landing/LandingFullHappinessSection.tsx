import React from 'react';
import style from '../../static/components/landing/landing-happy-guarantee.module.css';

const LandingFullHappinessSection = () => {
  return (
    <div className={style.container}>
      <div className={style.textPanel}>
        <div className={style.title}>100% HAPPINESS <br /> GUARANTEE</div>
        <div className={style.description}>
          We're committed to the idea that a fresh Mani should spark joy.
          If you aren't loving your Manis, we want to know! Shoot us a note at <a className={style.underline} href={'mailTo:care@manime.co'}>care@manime.co</a> and we'll take care of any issue.
        </div>
      </div>
      <div className={style.imagePanel}>

      </div>
    </div>
  );
}

export default LandingFullHappinessSection;