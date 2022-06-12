import React from 'react';

import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
} from 'react-share';

import FacebookIcon from '../../icons/profile/FacebookIcon';
import LinkedInIcon from '../../icons/profile/LinkedInIcon';
import PinterestIcon from '../../icons/profile/PinterestIcon';
import TwitterIcon from '../../icons/profile/TwitterIcon';

import style from './css/social-share.module.css';

const title = 'Manime';

const SocialShare = ({ shareLink }) => {
  if (!shareLink) return <div className={style.container} />;
  return (
    <div className={style.container}>
      <FacebookShareButton
        url={shareLink}
        quote={title}
        className={style.shareButton}>
        <FacebookIcon />
      </FacebookShareButton>

      <TwitterShareButton
        url={shareLink}
        title={title}
        className={style.shareButton}>
        <TwitterIcon />
      </TwitterShareButton>

      <LinkedinShareButton
        url={shareLink}
        windowWidth={750}
        windowHeight={600}
        className={style.shareButton}>
        <LinkedInIcon />
      </LinkedinShareButton>

      <PinterestShareButton
        url={shareLink}
        media={'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/referral-desktop-banner.jpg?v=1609768841'}
        windowWidth={750}
        windowHeight={600}
        className={style.shareButton}>
        <PinterestIcon />
      </PinterestShareButton>
    </div>
  );
};

export default SocialShare;