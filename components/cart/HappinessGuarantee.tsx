import React from 'react';
import Router from 'next/router';
import { pageLinks } from '../../utils/links';

import style from '../../static/components/cart/happiness-gurantee.module.css';

const HappinessGuarantee = ({ dispatchSetCartSideBar }) => {
  const knowMoreClickHandler = () => {
    dispatchSetCartSideBar(false);
    Router.push(pageLinks.Faq.url);
  }

  return (
    <div className={style.root}>
      <div>
        100% HAPPINESS GUARANTEED
      </div>
      <div className={style.knowMore} onClick={knowMoreClickHandler}>
        Know more
      </div>
    </div>
  );
}

export default HappinessGuarantee;