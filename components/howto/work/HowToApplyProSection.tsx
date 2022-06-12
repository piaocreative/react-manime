import React from 'react';
import Router from 'next/router';
import classNames from 'classnames';
import { DarkButton, OutlinedDarkButton } from '../../basic/buttons';
import { pageLinks } from '../../../utils/links';
import style from '../../../static/components/howto/work/howto-you-apply-pro.module.css';

const HowToApplyProSection = () => {
  const openVideoHandler = () => {
    Router.push(pageLinks.HowToApply.url);
  };

  return (
    <div className={style.container}>
      <div className={classNames(style.title, style.desktopView)}>
        APPLY MANIME LIKE A PRO
      </div>
      <div className={classNames(style.title, style.mobileView)}>
        APPLY MANIME
      </div>
      <div className={classNames(style.title, style.mobileView)}>
        LIKE A PRO
      </div>
      <DarkButton passedClass={style.actionDesktopButton} onClick={openVideoHandler}>
        SEE HOW TO APPLY
      </DarkButton>
      <OutlinedDarkButton isSmall passedClass={style.actionMobileButton} onClick={openVideoHandler}>
        SEE HOW TO APPLY
      </OutlinedDarkButton>
    </div>
  );
};

export default HowToApplyProSection;