import React from 'react';
import classNames from 'classnames';
import { DarkButton, OutlinedDarkButton } from '../basic/buttons';

import RefitHeader from './parts/RefitHeader';

import style from '../../static/components/refit/refit-start-mani.module.css';
import commonStyle from '../../static/components/refit/refit-common.module.css';

const RefitManiLengthStart = ({ state, setState, onBack, goToWidth, goToLength }) => {
  const isManis = state.profileType === 'Manis';
  return (
    <>
      <RefitHeader
        title={isManis? 'MANI FIT IMPROVEMENT': 'PEDI FIT IMPROVEMENT'}
        showLengthLogo
        onBack={onBack} />
      <div className={style.container}>
        <div className={commonStyle.title}>LET’S START WITH <br /> THE LENGTH!</div>

        <img
          className={style.fingerImage}
          src='https://cdn.shopify.com/s/files/1/0253/6561/0605/files/refit-length-hd.gif?v=1597584564' />

        <div className={commonStyle.description}>
          Do you want your next gels to be <br /> longer or shorter?
        </div>

        <OutlinedDarkButton
          passedClass={style.actionButton}
          onClick={goToWidth}>
          NO, THE LENGTH WAS FINE
        </OutlinedDarkButton>
        <DarkButton
          passedClass={style.actionButton}
          onClick={goToLength}>
          YES, LET’S ADJUST THE LENGTH
        </DarkButton>
      </div>
    </>
  );
};

export default RefitManiLengthStart;
