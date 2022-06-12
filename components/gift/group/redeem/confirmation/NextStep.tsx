import React from 'react';
import globalStyles from '@styles/basic/buttons.module.css';
import buttonStyle from '@styles/gift/group/redeem.module.css';
import { useRouter } from 'next/router';
import { pageLinks } from 'utils/links';
import styles from '@styles/gift/group/confirmation.module.css';

const steps = [
  {
    index: 1,
    title: 'Scan',
    text: 'Our team of 3D modelers will create your custom-fit stick on gels',
    icon: '/static/icons/group-gift-scan.svg',
  },
  {
    index: 2,
    title: 'Ship',
    text: 'Your Friends Gift Kit will be delivered to your address in 4-7 business days',
    icon: '/static/icons/group-gift-ship.svg',
  },
  {
    index: 3,
    title: 'Enjoy',
    text: 'Enjoy your Friends Gift Kit - manis are best enjoyed with friends!',
    icon: '/static/icons/group-gift-enjoy.svg',
  },
];

export default function ConfirmNextStep({}) {
  const router = useRouter();
  function goToNext() {
    router.push(pageLinks.HowToApply.url);
  }
  return (
    <div className={styles.confirmNextContainer}>
      <div className={styles.confirmNextLabel}>What’s next?</div>
      <div className={styles.confirmNextStepHeader}>
        {steps.map(item => (
          <div className={styles.nextStepTitle} key={`title-${item.index}`}>
            {item.title}
          </div>
        ))}
      </div>
      <div className={styles.confirmNextStepContent}>
        {steps.map(item => (
          <div key={`content-${item.index}`}>
            <div className={styles.nextStepIndex}>{item.index}</div>
            <div>
              <img className={styles.nextStepWaterDrop} src={item.icon} alt="water-drop" />
            </div>
            <div className={styles.nextText}>{item.text}</div>
          </div>
        ))}
      </div>
      <div style={{ height: '40px' }} />
      <button className={`${globalStyles.darkButton} ${buttonStyle.darkButton}`} onClick={goToNext}>
        Check our how to guide
      </button>
    </div>
  );
}
