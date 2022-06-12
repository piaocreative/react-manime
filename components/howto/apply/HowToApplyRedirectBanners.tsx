import React from 'react';
import ReferFriend from '../../../components/design/redirect-banners/ReferFriends';
import EveryOccasionWithAction from '../../../components/design/redirect-banners/EveryOccasionWithAction';

import style from './css/how-to-apply-redirect-banners.module.css';

const HowToApplyRedirectBanners = () => {
  return (
    <div className={style.container}>
      <ReferFriend />
      <EveryOccasionWithAction />
    </div>
  );
};

export default HowToApplyRedirectBanners;