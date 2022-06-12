import React from 'react';
import SolidChoice from './SolidChoice';
import Signature from './Signature';
import InTheAir from './InTheAir';

import style from './css/shop-link-panel.module.css';

const ShopLinkPanels = ({ isMobileView }) => {
  return (
    <div className={style.container}>
      <InTheAir isMobileView={isMobileView} />
      <SolidChoice isMobileView={isMobileView} />
      <Signature isMobileView={isMobileView} />
    </div>
  );
};

export default ShopLinkPanels;