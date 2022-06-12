import React from 'react';
import { useRouter } from 'next/router';

import styles from '@styles/gift/group/confirmation.module.css';
import ReactMarkdown from 'react-markdown';
import { pageLinks } from 'utils/links.js';
import globalStyles from '@styles/basic/buttons.module.css';
import buttonStyle from '@styles/gift/group/redeem.module.css';
export default function ConfirmBanner() {
  const router = useRouter();
  function goToNext() {
    router.push(pageLinks.HowToApply.url);
  }

  const copy1 = `Your Friends Gift Kit has already  
  been redeemed.`;
  const copy2 = `If you redeemed the kit, you should have  
  received an email confirmation.  
    
  Reach out to care@manime.co with any questions. `;
  return (
    <>
      <div className={`${styles.confirmBannerContainer}`}>
        <div className={styles.orderConfirmLabel}>Order Confirmation</div>
        <div className={styles.orderConfirmTitle}>Friends Gift Kit</div>

        <div className={styles.redeemErrorMessage}>
          <ReactMarkdown>{copy1}</ReactMarkdown>
        </div>
        <img
          className={styles.groupGiftImage}
          src="https://cdn.shopifycdn.net/s/files/1/0253/6561/0605/files/group-gift-banner_70e30a30-d095-4627-996a-a372c51bb728.png?v=1618068596"
          alt="group-gift"
        />
      </div>
      <div className={`${styles.redeemErrorMessage} ${styles.bottomErrorMessage}`}>
        <ReactMarkdown>{copy2}</ReactMarkdown>
      </div>
      <div className={styles.errorContainer}>
        <button
          className={`${globalStyles.darkButton} ${buttonStyle.darkButton} `}
          onClick={goToNext}
        >
          Check our how to guide
        </button>
      </div>
    </>
  );
}
