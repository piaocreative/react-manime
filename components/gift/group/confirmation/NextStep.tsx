import React from 'react';

import { DarkButton } from 'components/basic/buttons';

import styles from '@styles/gift/group/confirmation.module.css'

const steps = [
  {
    index: 1,
    title: 'Scan',
    text: 'Recipients redeem gift through a unique link and scan their nails.',
    icon: '/static/icons/group-gift-scan.svg',
  },
  {
    index: 2,
    title: 'Ship',
    text: 'ManiMe custom fits each kit and ships it within 4-7 business days*.',
    icon: '/static/icons/group-gift-ship.svg',
  },
  {
    index: 3,
    title: 'Enjoy',
    text: 'Your recipients are ready to party with their ManiMe gels!',
    icon: '/static/icons/group-gift-enjoy.svg',
  },
];

export default function ConfirmNextStep({}) {
  return (
    <div className={styles.confirmNextContainer}>
      <div className={styles.confirmNextLabel}>
        What’s next?
      </div>
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
            <div className={styles.nextStepIndex}>
              {item.index}
            </div>
            <div>
              <img className={styles.nextStepWaterDrop} src={item.icon} alt='water-drop' />
            </div>
            <div className={styles.nextText}>
              {item.text}
            </div>                        
          </div>
        ))}
      </div>

      <div className={styles.nextStepDescription}>
        You will also receive a confirmation email with all the unique links.
      </div>

      <div className={styles.shippingDescription}>
        *gift kits arrive 4-7 busines days after recipients redeem the gift and scan their nails. Each kit is shipped individually to each recipient.
      </div>
    </div>
  );
}