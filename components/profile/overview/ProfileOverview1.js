import React, { useState } from 'react';
import classNames from 'classnames';
import Router from 'next/router';
import Link from 'next/link';

import { retrieveUsersWithEmail } from 'api/user';
import {getGroupOrders} from 'api/order'
import { WhiteButton } from '../../basic/buttons';
import { pageLinks } from '../../../utils/links';
import style from '../../../static/components/profile/overview/review-fit.module.css';
import log from '../../../utils/logging'
const ProfileOverview1 = ({ userId, email }) => {
  const [isLoading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const retrieveShopifyData = async () => {
    let hasOrder = false;
    try {
      setLoading(true);
      const users = await retrieveUsersWithEmail(email);

      let groupOrderPromises = [];
      users.map(async user => {
        const identityId = user.userId;
        groupOrderPromises.push(getGroupOrders(identityId));
      })

      let groupOrders = [];
      const groupOrdersArray = await Promise.all(groupOrderPromises);
      groupOrdersArray.map(async groupOrderArray => {
        if (groupOrderArray.length > 0 ) {
          groupOrders =  [...groupOrders, groupOrderArray[0]];
          hasOrder = true;
          Router.push(`${pageLinks.Refit.url}?groupOrderId=${groupOrderArray[0].groupOrderId}`);
        }
      });
    } catch (err) {
      log.info('denis: [ProfileOverview1] group orders err', err);
    }
    if (!hasOrder) {
      setShowMessage(true);
    }
    setLoading(false);
  }

  const reviewHandler = async () => {
    // TODO:
    if (!userId) return;
    retrieveShopifyData()
  }

  return (
    <div className={style.container}>
      <div className={style.topTitle}>My NAIL SCAN</div>
      <div className={style.description}>
        Wider? Longer? Shorter? <br />
        Adjust the size of your next set.
      </div>
      <div className={style.imagePanel}>
        <div className={classNames(style.subPanel, style.subPanelLeft)}>
          <div className={style.subTitle}>POOR FIT</div>
          <div className={style.poorFitPanel}>
            <div className={style.leftDescription}>
              Too narrow <br />
              Noticeable gap <br /> <br />

              Too wide <br />
              Gel touching skin <br />or cuticle <br /><br />

              Too short <br />
              Gel doesn't cover <br /> the top of the nail <br />
            </div>
            <img className={style.poorFitImage} src='/static/icons/overview-poor-fit.svg' alt='poor-fit' />
          </div>
        </div>
        <div className={classNames(style.subPanel, style.subPanelRight)}>
          <div className={style.subTitle}>GOOD FIT</div>
          <div className={style.goodFitPanel}>
            <img className={style.poorFitImage} src='/static/icons/overview-good-fit.svg' alt='good-fit' />
            <div className={style.rightDescription}>
              Gel fits inside <br /> nail bed and <br /> covers top with <br />room to file
            </div>
          </div>
        </div>
      </div>

      <WhiteButton isSmall passedClass={style.reviewButton} onClick={reviewHandler} disabled={isLoading}>
        REQUEST A RESIZE
      </WhiteButton>
      {showMessage &&
        <div className={style.message}>You can review fit after you place your first order. <Link href={pageLinks.SetupDesign.url}><span className={style.linkToShop}>Check our designs</span></Link></div>
      }
    </div>
  );
}

export default ProfileOverview1;
