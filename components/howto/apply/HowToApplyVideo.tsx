import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import PlayIcon from '../../icons/howto/PlayIcon';
import youtubeLinks from '../../../utils/youtubeLinks';
import style from '../../../static/components/howto/apply/howto-apply-video.module.css';

const videoInfoList = [
  {
    title:'HOW IT WORKS',
    link: youtubeLinks.HowItWorks,
  },
  {
    title: "HERE'S HOW TO APPLY",
    link: youtubeLinks.HowToApplyLongVideo,
  }
];

const HowToApplyVideo = ({ isWork }) => {
  const [playMode, setPlayMode] = useState(false);
  const index = isWork ? 0: 1;

  const setPlayModeHandler = value => () => {
    setPlayMode(value);
  };

  return (
    <>
      <div className={classNames(style.imgWrapper, {
          [style.hide]: playMode,
          [style.visible]: !playMode,
          [style.workBack]: isWork,
          [style.applyBack]: !isWork,
        })}>
        <div className={style.title}>
          {videoInfoList[index].title}
        </div>
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
          url={videoInfoList[index].link} />
      </div>
    </>
  );

};

export default HowToApplyVideo;