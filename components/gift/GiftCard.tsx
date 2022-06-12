import React from 'react';
import config from '../../config';

const GiftCard = () => (
  <div
    className="gift-up-target"
    data-site-id={config.giftCard.siteId}
    data-platform="Other"
  />
);

export default GiftCard;
