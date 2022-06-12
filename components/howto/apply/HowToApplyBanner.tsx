import React, { useState } from 'react';
import classNames from 'classnames';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import MediaPlayIcon from '../../icons/MediaPlayIcon';
import youtubeLinks from '../../../utils/youtubeLinks';

import style from './css/how-to-apply-banner.module.css';

const mobileImg = 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/how-to-apply-banner-mobile.jpg?v=1609918718';
const desktopImg = 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/how-to-apply-banner-desktop.jpg?v=1609918718';

const HowToApplyBanner = () => {
  const [playMode, setPlayMode] = useState(false);

  const setPlayModeHandler = value => () => {
    setPlayMode(value);
  };

  return (
    <>
      <div className={style.container}>
        <div className={style.howToApplytitle}>How To Apply</div>
        <picture>
          <source className={style.bannerImage} media="(max-width: 767px)" srcSet={mobileImg} />
          <source className={style.bannerImage} media="(min-width: 768px)" srcSet={desktopImg} />
          <img className={style.bannerImage} src={mobileImg} alt="how-to-apply-banner" />
        </picture>
        <div className={style.texts}>
          <div className={style.title}>
            A quick & easy application guide
          </div>
          <div className={style.watchLabel} onClick={setPlayModeHandler(true)}>
            Watch how to video <MediaPlayIcon className={style.playIcon} />
          </div>
        </div>
        <div className={classNames(style.playerWrapper, {
          [style.hide]: !playMode,
          [style.visible]: playMode
        })}>
          <div className={style.closeIcon} onClick={setPlayModeHandler(false)}>×</div>
          <YouTubePlayer
            id='vid'
            className={style.reactPlayer}
            config={{
              youtube: {
                preload: true
              }
            }}
            width='100%'
            height='100%'
            playing={playMode}
            loop
            controls
            url={youtubeLinks.HowToApplyLongVideo} />
        </div>
      </div>
    </>
  );
};

export default HowToApplyBanner;