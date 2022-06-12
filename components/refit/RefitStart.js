import React from 'react';
import RefitHeader from './parts/RefitHeader';

import { DarkButton } from '../basic/buttons';

import style from '../../static/components/refit/refit-start.module.css';
import commonStyle from '../../static/components/refit/refit-common.module.css';

const RefitStart = ({
  onMani,
  onPedi
}) => {
  return (
    <>
      <RefitHeader title='RESIZE REQUEST' />
      <div className={style.container}>
        <div className={commonStyle.title}>NEED TO RESIZE?</div>
        <div className={commonStyle.description}>Let's adjust your stick-on-gels!</div>

        <img
          className={style.handAndFoot}
          src={'../../static/images/refit/refit-start-logo.svg'} />

        <div className={commonStyle.description}>Do you want to resize your mani or pedi?</div>

        <div className={style.buttonLine}>
          <DarkButton
            passedClass={style.actionButton}
            onClick={onMani}>
            RESIZE MANI
          </DarkButton>
          <DarkButton
            passedClass={style.actionButton}
            onClick={onPedi}>
            RESIZE PEDI
          </DarkButton>
        </div>
      </div>

    </>
  );
};

export default RefitStart;
