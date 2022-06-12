import React, { useState } from 'react';

import { DarkButton } from '../../basic/buttons';
import CheckIcon from '../../icons/howto/CheckIcon';

import constants from '../../../constants';
import { copyTextToClipboard } from 'utils/clipboard';
import log from 'utils/logging';

import style from './css/referral-mobile.module.css'; 

const ReferralMobile = ({ title, giveAndGetTitle, description, shareLink='', userData }) => {
  const supportShareAPI = (typeof window !== 'undefined' && navigator && navigator?.share) ? true: false;
  const [copyStatus, setCopyStatus] = useState(false);

  const copyClickHandler = () => {
    copyTextToClipboard(shareLink);
    setCopyStatus(true);
  };

  const shareHandler = () => {
    if (navigator && navigator.share) {
      navigator
        .share({
          title: 'My New Nail Obsession',
          text: ` I’ve been loving getting a custom mani at home with ManiMe and I think you will too. Get $${constants.referral.NORMAL_REFERREE_CREDIT} off your first order when you shop with my link!`,
          url: shareLink
        })
        .then(() => {
          log.info("Shared successfully.");
        })
        .catch(error => {
          log.info("There was an error sharing:", error);
        });
    } else {
      log.warn("The Web Share API is not supported in your browser.");
    }
  };

  return (
    <div className={style.container}>
      <div className={style.inviteTitle}>{title}</div>
      <div className={style.giveAndGetTitle}>{giveAndGetTitle}</div>
      <img
        className={style.bannerStyle}
        src='https://cdn.shopify.com/s/files/1/0253/6561/0605/files/referral-mobile-banner.jpg?v=1609750644'
        alt='referral-banner' />
      <div className={style.content}>
        {description}
        <div className={style.referralLinkLabel}>Share your unique referral link:</div>
        <div className={style.shareLinkStyle}>{shareLink}</div>
        <div className={style.actionLine}>
          <DarkButton
            passedClass={style.actionButton}
            disabled={!shareLink}
            onClick={copyClickHandler}>
            Copy &nbsp; <img src='/static/icons/copy-icon.svg' alt='copy-icon' />
          </DarkButton>
          <DarkButton
            passedClass={style.actionButton}
            disabled={!supportShareAPI || !shareLink}
            onClick={shareHandler}>
            Share &nbsp; <img src='/static/icons/share-icon.svg' alt='share-icon' />
          </DarkButton>
        </div>
        <div className={style.copied}>
          {copyStatus &&
            <>
              <CheckIcon color='#59aa8e' /> &nbsp; Referral link copied
            </>
          }
        </div>
      </div>
    </div>
  );
};

export default ReferralMobile;