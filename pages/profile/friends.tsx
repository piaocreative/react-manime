import PageWrapper, { ManimeStandardContainer, getGlobalProps } from 'components/core/hoc/PageWrapper';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import log from '../../utils/logging'
import AuthWallHOC from '../../components/AuthWallHOC';
import TopHeader from '../../components/profile/TopHeader';
import AccountMenuPanel, { ProfileContainer } from '../../components/profile/AccountMenuPanel';
import { getShortenLink } from 'api/util';
import { createReferralLink, getReferralsWithIdentityId } from 'api/referral'
import constants from '../../constants';

import style from '../../static/components/profile/referral.module.css';

import ReferralMobile from '../../components/profile/referral/ReferralMobile';
import ReferralDesktop from '../../components/profile/referral/ReferralDesktop';

const ProfileFriend = ({ isMobileView, globalProps }) => {
  const userData: any = useSelector((state : any) => state.userData);
  const [referralLink, setReferralLink] = useState('');
  const [referralId, setReferralId] = useState('');

  const title = 'Refer a friend';
  const giveAndGetTitle = `Give $${constants.referral.NORMAL_REFERREE_CREDIT}, Get $${constants.referral.NORMAL_REFERRER_CREDIT}`;
  const description = (
    <div className={style.description}>
      You’re already talking about your nails, now get rewarded for it! 
      Send your unique referral link to a friend for ${constants.referral.NORMAL_REFERREE_CREDIT} off their first order and
      you’ll receive ${constants.referral.NORMAL_REFERREE_CREDIT} of ManiMoney for each redemption. It’s a win-win. 
    </div>
  );

  useEffect(() => {
    if (userData.identityId) {
      referralStuff();
    }
  }, [userData?.identityId]);

  const referralStuff = async () => {
    const promotionId = 'defaultPromotion';
    const sourceId = userData?.identityId || '';
    const linkType = 'defaultLink';
    let result = [];
    let referralId = '';
    let shortenPath = '';

    try {
      result = await getReferralsWithIdentityId(sourceId, linkType, promotionId);
    } catch (err) {
      log.error('getReferralsWithIdentityId err');
    }

    if (result.length > 0) {
      referralId = result[0].referralId;
    } else {
      try {
        const result = await createReferralLink(promotionId, sourceId, linkType);
        referralId = result.referralId;
        log.info(`created referralId ${referralId}`);
      } catch (err) {
        log.error('[friends] error creating referral ID!!!!', { err } );
      }
    }

    try {
      const originPath = typeof window !== 'undefined' && window.location ? window.location.origin : 'https://manime.co';
      const defaultManimePath = `${originPath}/verify?referral=${referralId}`;
      shortenPath = await getShortenLink(defaultManimePath);
    } catch (err) {
      log.error('[friends][referralStuff] 3rd trycatch ' + err);
    }

    setReferralLink(shortenPath);
    setReferralId(referralId);
  }

  return (
    
      <>    
      <TopHeader />
      <ProfileContainer>
        <AccountMenuPanel userData={userData} showInfo showMenu={!isMobileView} />
        {isMobileView ?
          <ReferralMobile title={title} giveAndGetTitle={giveAndGetTitle} description={description} shareLink={referralLink} userData={userData} />:
          <ReferralDesktop title={title} giveAndGetTitle={giveAndGetTitle} description={description} shareLink={referralLink} userData={userData} />
        }
        {isMobileView &&
          <AccountMenuPanel userData={userData} showInfo={false} showMenu />
        }
      </ProfileContainer>
      </>

  );
}

export default ManimeStandardContainer(AuthWallHOC(ProfileFriend));

export const getStaticProps = async () => await getGlobalProps();
