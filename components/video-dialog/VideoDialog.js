import React from 'react';
import classNames from 'classnames';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import youtubeLinks from '../../utils/youtubeLinks';
import style from './css/video-dialog.module.css';

const VideoDialog = ({ playMode, onClose, url }) => {
  return (
    <>
      <div className={style.videoDialog}>
        <div className={classNames(style.playerWrapper, {
            [style.hide]: !playMode,
            [style.visible]: playMode
          })}>
          <div className={style.closeIcon} onClick={onClose}>×</div>
          <YouTubePlayer
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
            url={url} />
        </div>
      </div>
      <div className={style.overlay} />
    </>
  );
};

export default VideoDialog;