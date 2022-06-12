import React, { useState } from 'react';
import classNames from 'classnames';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import CareNailIcon from '../../icons/CareNailIcon';
import PlayIcon from '../../icons/howto/PlayIcon';
import youtubeLinks from '../../../utils/youtubeLinks';
import style from './css/video-panel.module.css';

const VideoPanel = () => {
  const [playMode, setPlayMode] = useState(false);
  const setPlayModeHandler = value => () => {
    setPlayMode(value);
  };

  return (
    <div className={style.container}>
      <div className={style.textPanel}>
        <CareNailIcon className={style.careNailIcon} />
        <div className={style.title}>Why CARE?</div>
        <div className={style.description}>
          As a business, we have an obligation to leverage our platform for social good and this has never been more urgent than right now.  By bringing together 11 diverse artists and donating 100% of our profits to PBA and MBL, we’re committed to using ManiMe as a force for social progress.
        </div>
      </div>
      <div className={classNames(style.videoPanel, {
        [style.hide]: playMode,
        [style.visible]: !playMode
      })}>
        <PlayIcon className={style.playIcon} onClick={setPlayModeHandler(true)}/>
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
          url={youtubeLinks.CareCollection} />
      </div>
    </div>
  );
};

export default VideoPanel;