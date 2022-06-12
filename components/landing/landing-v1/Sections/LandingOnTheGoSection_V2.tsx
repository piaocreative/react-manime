import React from 'react';
import Link from 'next/link';

import { DarkButton } from '../../../basic/buttons';
import style from './css/landing-stickongels.module.css';
import { pageLinks } from '../../../../utils/links';

const videoMobilePath = 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/landing-stick-on-gels-mobile.mp4?v=1592577374';
const videoDesktopPath = 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/landing-stick-on-gels-desktop.mp4?v=1592577375';

const LandingOnTheGoSection = ({ isMobileView }) => {
  return (
    <div className={style.container}>
      <div className={style.content}>
        {isMobileView?
          <video width="100%" height="100%" autoPlay loop muted playsInline
            className={style.videoStyle} key='mobileVideo'>
              <source src={videoMobilePath} type="video/mp4" key='mobile' />
            Your browser does not support the video tag.
          </video>:
          <video width="100%" height="100%" autoPlay loop muted playsInline
            className={style.videoStyle} key='desktopVideo'>
              <source src={videoDesktopPath} type="video/mp4" key='desktop' />:
            Your browser does not support the video tag.
          </video>
        }
        <div className={style.rectPanel}>
          <div className={style.mobileTextPanel}>
            STICK ON GELS
            <div className={style.description}>
              Apply in minutes, <br /> remove in seconds
            </div>
          </div>
          <Link href={pageLinks.SetupDesign.url}>
            <a>
              <DarkButton
                passedClass={style.getManiButton}>
                GET YOUR MANI
              </DarkButton>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LandingOnTheGoSection;
