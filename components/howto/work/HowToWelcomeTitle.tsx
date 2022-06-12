import React from 'react';
import classNames from 'classnames';
import style from '../../../static/components/howto/work/howto-you-apply-pro.module.css';

const HowToWelcomeTitle = () => {
  return (
    <div className={style.container}>
      <div className={classNames(style.title, style.desktopView)}>
        WELCOME TO THE FUTURE OF MANICURES
      </div>
      <div className={classNames(style.title, style.mobileView)}>
        WELCOME TO THE
      </div>
      <div className={classNames(style.title, style.mobileView)}>
        FUTURE OF MANICURES
      </div>
    </div>
  );
};

export default HowToWelcomeTitle;