import React from 'react';
import classNames from 'classnames';
import style from './css/loop-panel.module.css';

const pattern = (
  <>
    <img src='/static/icons/care-loop.svg' className={style.careLoop} />
    <img src='/static/icons/care-loop.svg' className={style.careLoop} />
    <img src='/static/icons/care-loop.svg' className={style.careLoop} />
  </>
);

const LoopPanel = () => {
  return (
    <div className={style.container}>
      <span className={classNames(style.line1, style.line)}>
        {pattern}
      </span>
      <span className={classNames(style.line2, style.line)}>
        {pattern}
      </span>
    </div>
  );
};

export default LoopPanel;