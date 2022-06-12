import React from 'react';
import Router from 'next/router';

import style from '../../../static/components/profile/overview/refer-friends.module.css';
import { WhiteButton } from '../../basic/buttons';
import { pageLinks } from '../../../utils/links';
import { scrollToTop } from '../../../utils/scroll';
import constants from '../../../constants';

const ProfileOverview2 = ({ credits }) => {
  const referHandler = () => {
    scrollToTop();
    Router.push(pageLinks.Profile.Friends.url);
  }

  return (
    <div className={style.container}>
      <div className={style.subContent}>
        <div className={style.topTitle}>TELL YOUR FRIENDS</div>
        <div className={style.textPanel}>
          <div className={style.giveAndGet}>
            GIVE ${constants.referral.NORMAL_REFERREE_CREDIT}, <br />
            GET ${constants.referral.NORMAL_REFERREE_CREDIT}
          </div>
          <div className={style.description}>
            Every new friend you bring will get ${constants.referral.NORMAL_REFERREE_CREDIT} off their first order and you will get ${constants.referral.NORMAL_REFERREE_CREDIT} when they order.
          </div>
        </div>
        <div style={{flexGrow: 1}} />
        <div>
          <div className={style.manimeBalance}>
            <img className={style.manimeBalanceIcon} src='/static/icons/manime-balance.svg' />
            YOUR MANIMONEY BALANCE IS <span className={style.balanceLabel}>${credits}</span>
          </div>

          <WhiteButton isSmall passedClass={style.referButton} onClick={referHandler}>
            REFER MY FRIEND
          </WhiteButton>
        </div>
      </div>
    </div>
  );
}

export default ProfileOverview2;