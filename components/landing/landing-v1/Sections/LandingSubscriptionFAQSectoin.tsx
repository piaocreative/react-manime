import React from 'react';
import LandingSubscriptionSection from './LandingSubscriptionSection';
import LandingDesktopFAQ from './LandingDesktopFAQ';

import style from './css/landing-subscription-faq.module.css';

const LandingSubscriptionFAQ = ({ isMobileView, ...rest }) => (
  <div className={style.container}>
    <LandingSubscriptionSection isMobileView={isMobileView} {...rest} />
    {!isMobileView &&
      <LandingDesktopFAQ />
    }
  </div>
);

export default LandingSubscriptionFAQ;