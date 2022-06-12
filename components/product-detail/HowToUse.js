import React, { useState } from 'react';
import BubbleIcon from '../icons/Bubble';
import VideoDialog from '../video-dialog/VideoDialog';
import youtubeLinks from '../../utils/youtubeLinks';
import style from './css/how-to-use.module.css';

const instructionList = [
  {
    text: 'Clean your nails',
    pediText: 'Clean your nails',
    maniIcon: '../../static/icons/product-detail/prep-nails.svg',
    pediIcon: '../../static/icons/product-detail/prep-toenails.svg',
  },
  {
    text: 'Apply your mani',
    pediText: 'Apply your pedi',
    maniIcon: '../../static/icons/product-detail/apply-mani.svg',
    pediIcon: '../../static/icons/product-detail/apply-pedi.svg',
  },
  {
    text: 'File the excess',
    pediText: 'Clip the excess',
    maniIcon: '../../static/icons/product-detail/file-excess.svg',
    pediIcon: '../../static/icons/product-detail/clip-excess.svg',
  },
];

const HowToUse = ({ isPedis }) => {
  const [playMode, setPlayMode] = useState(false);
  const setPlayModeHandler = value => () => {
    setPlayMode(value);
  };

  return (
    <>
      <div className={style.container}>
        {instructionList.map((item, index) => (
          <div className={style.oneItem} key={index}>
            <div className={style.instructionText}>{`${index + 1}. ${isPedis ? item.pediText: item.text}`}</div>
            <img
              className={style.instructionIcon}
              src={isPedis ? item.pediIcon: item.maniIcon}
            />
            <BubbleIcon
              color='#fff'
              className={style.bubbleIcon} />
          </div>
        ))}
        <div className={style.checkVideoLine}>
          <img src='/static/icons/play.svg' />
          <a
            className={style.checkHowToVideo}
            onClick={setPlayModeHandler(true)}>
            Check how to video
          </a>
        </div>
      </div>
      {playMode &&
        <VideoDialog
          url={youtubeLinks.HowToApplyLongVideo}
          playMode={playMode}
          onClose={setPlayModeHandler(false)} />
      }
    </>
  );
};

export default HowToUse;