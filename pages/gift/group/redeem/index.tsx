import PageWrapper, {
  ManimeStandardContainer,
  getGlobalProps,
} from 'components/core/hoc/PageWrapper';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { redeemGroupGift } from 'api/order';
import styles from '@styles/gift/group/redeem.module.css';
import globalStyles from '@styles/basic/buttons.module.css';
import AuthWallHOC from 'components/AuthWallHOC';
import log from 'utils/logging';
import LoadingAnimation from 'components/LoadingAnimation';
import { pageLinks } from 'utils/links';
import ReactMarkdown from 'react-markdown';
import Banner from 'components/gift/group/redeem/error/Banner';

function LandingPage(props) {
  const [recipientName, setRecipientName] = useState<string | undefined>();
  const [senderName, setSenderName] = useState<string | undefined>();
  const [isMounted, setIsMounted] = useState(false);

  const [error, setError] = useState();

  const router = useRouter();
  const queryKey = 'mid';
  let memberId = router.asPath.substring(router.asPath.indexOf('mid=') + 4);

  if (memberId.includes('&')) {
    memberId = memberId.substring(0, memberId.indexOf('&'));
  }

  const title = `Redeem your  
  ManiMe Friends Gift Kit`;

  const mainCopy = `${senderName} gifted you a mani kit.  
  Now you only need to redeem it and enjoy it.  

  What you need to do:`;

  async function mount() {
    log.verbose(
      'mounting the redemption page, memberId is ' +
        memberId +
        ' pathname is' +
        router?.asPath +
        ' isRouterReady ' +
        JSON.stringify(router.isReady)
    );
    if (memberId && !isMounted) {
      setIsMounted(true);
      try {
        const groupGift = await redeemGroupGift(memberId);
        groupGift['memberId'] = memberId;

        setRecipientName(
          `${groupGift.groupGiftMember.firstName} ${groupGift.groupGiftMember.lastName}`
        );
        setSenderName(groupGift.buyerName);
      } catch (err) {
        setError(err);
        log.error(`[group][redeem][mount] caught error ${err}`, { err });
      }
    }
  }

  function goToNext() {
    router.push(
      {
        pathname: pageLinks.GroupGiftRedeemShipping.url,
        query: {
          mid: memberId,
        },
      },
      {
        pathname: pageLinks.GroupGiftRedeemShipping.url,
        query: {
          mid: memberId,
        },
      }
    );
  }

  useEffect(() => {
    mount();
  }, []);

  return (
    <div className={styles.container}>
      {error && <Banner />}
      {!isMounted && <LoadingAnimation isLoading={true} size={'50%'} />}
      {isMounted && !error && (
        <div className={styles.content}>
          <div className={styles.header}>
            <ReactMarkdown source={title} />
          </div>
          <div className={styles.hero} />

          <div className={styles.steps}>
            <span style={{ fontFamily: 'AvenirHeavy' }}>Hi {recipientName}</span>
            <p />
            <ReactMarkdown>{mainCopy}</ReactMarkdown>
            <div className={styles.stepsList}>
              <div className={styles.stepsDrop}>1</div>Click "get started" to log in to your account
              or create a new one
            </div>
            <div className={styles.stepsList}>
              <div className={styles.stepsDrop}>2</div>We will ask for pictures to scan your nails
              and custom-fit the gift kit to you (and only you!)
            </div>
            <div className={styles.stepsList}>
              <div className={styles.stepsDrop}>3</div>You will get the gift kit delivered in 4-7
              buiness days to your preferred address
            </div>
            <button
              className={`${globalStyles.darkButton} ${styles.darkButton}`}
              onClick={goToNext}
            >
              Get Started
            </button>
          </div>

          <div></div>
        </div>
      )}
    </div>
  );
}

export default ManimeStandardContainer(LandingPage);
export const getStaticProps = async () => await getGlobalProps();
