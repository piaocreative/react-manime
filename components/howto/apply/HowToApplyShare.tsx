import React from 'react';
import Router from 'next/router';
import { DarkButton, WhiteButton } from '../../basic/buttons';
import { pageLinks } from '../../../utils/links';
import youtubeLinks from '../../../utils/youtubeLinks';
import style from '../../../static/components/howto/apply/howto-apply-share.module.css';

const HowToApplyShare = () => {
  const moveToShopHandler = () => {
    Router.push(pageLinks.SetupDesign.url);
  };

  const openRemoveVideoHandler = () => {
    window.open(youtubeLinks.HowToRemove, '_blank');
  };

  return (
    <div className={style.container}>
      <div className={style.content}>
        <div className={style.textPanel}>
          <div className={style.title}>SHARE YOUR MANIS <br /> WITH THE WORLD!</div>
          <div className={style.description}>We want to see your mani makeover - tag @manime.co and #hightechmani!</div>
        </div>
        <div className={style.buttonPanel}>
          <DarkButton isSmall passedClass={style.actionButton} onClick={moveToShopHandler}>SHOP MANIS</DarkButton>
          <WhiteButton isSmall passedClass={style.actionButton} onClick={openRemoveVideoHandler}>HOW TO REMOVE</WhiteButton>
        </div>
      </div>
    </div>
  );
};

export default HowToApplyShare;