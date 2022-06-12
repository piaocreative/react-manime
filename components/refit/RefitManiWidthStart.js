import React from 'react';
import classNames from 'classnames';
import { DarkButton, OutlinedDarkButton } from '../basic/buttons';

import RefitHeader from './parts/RefitHeader';

import style from '../../static/components/refit/refit-start-mani.module.css';
import commonStyle from '../../static/components/refit/refit-common.module.css';

const RefitManiWidthStart = ({ state, setState, onBack, goToWidth, skipWidth }) => {
  const isManis = state.profileType === 'Manis';
  return (
    <>
      <RefitHeader
        title={isManis? 'MANI FIT IMPROVEMENT': 'PEDI FIT IMPROVEMENT'}
        showWidthLogo
        onBack={onBack} />
      <div className={style.container}>
        <div className={commonStyle.title}>
          WE CAN ALSO MAKE <br /> YOUR GELS NARROWER <br /> OR WIDER!
        </div>

        <img
          className={style.fingerImage}
          src='https://cdn.shopify.com/s/files/1/0253/6561/0605/files/refit-width-hd.gif?v=1597584557' />

        <div className={commonStyle.description}>
          Do you want to adjust the width <br /> of your next gels?
        </div>
        
        <OutlinedDarkButton
          passedClass={style.actionButton}
          onClick={skipWidth}>
          NO, THE WIDTH WAS FINE
        </OutlinedDarkButton>
        <DarkButton
          passedClass={style.actionButton}
          onClick={goToWidth}>
          YES, LET’S ADJUST THE WIDTH
        </DarkButton>
      </div>
    </>
  );
};

export default RefitManiWidthStart;
