import React from 'react';
import CareNailIcon from '../../icons/CareNailIcon';
import style from './css/care-nail-logo.module.css';

const CareNailLogo = () => {
  return (
    <>
      <img
        className={style.careNailText}
        src='/static/images/care/care-collection.svg' />
      <CareNailIcon className={style.careNailIcon}/>
    </>
  );
};

export default CareNailLogo;