import React from 'react';

import style from '../../../static/components/refit/refit-header.module.css';

const RefitHeader = ({ title, showLengthLogo, showWidthLogo, onBack }) => {
  return (
    <div className={style.container}>
      {onBack && 
        <div className={style.backButton} onClick={onBack}>
          {`< BACK`}
        </div>
      }
      <div className={style.topTitle}>{title || 'RESIZE PROCESS'}</div>
      {showLengthLogo ?
        <img
          className={style.logo}
          src='https://cdn.shopify.com/s/files/1/0253/6561/0605/files/header-length-logo.svg?v=1597346524' alt='header-length-logo' />:
      showWidthLogo ?
        <img
          className={style.logo}
          src='https://cdn.shopify.com/s/files/1/0253/6561/0605/files/header-width-logo.svg?v=1597346524' alt='header-width-logo' />:
        null
      }

    </div>
  );
};

export default RefitHeader;