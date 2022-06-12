import React, { Fragment } from 'react';
import Link from 'next/link';
import { DarkButton } from 'components/basic/buttons';
import { pageLinks } from 'utils/links';
import styles from '@styles/gift/group/welcome.module.css';

const steps = [
  {
    index: 1,
    title: 'Build your Friends Gift Kit',
    text: <>Choose from a gallery of 100+ nail designs and essentials.</>,
  },
  {
    index: 2,
    title: 'Enter recipients’ email',
    text: (
      <>
        Give to as many recipients as you want.
        <br /> Save up to 30%!
      </>
    ),
  },
  {
    index: 3,
    title: 'Recipients redeem their Gift Kit ',
    text: (
      <>
        Recipients will receive a unique link to scan their nails. <br />
        Gift kits arrive 4-7 business days after gift redemption.
      </>
    ),
  },
];

export default function Banner() {
  return (
    <div className={styles.bannerContainer}>
      <div className={styles.mainPanel}>
        <div className={styles.label}>ManiMe Friends Gift Kit</div>
        <div className={styles.title}>
          Custom-fit gels for all — <br /> in just one order
        </div>
        <div className={styles.textPanel}>
          {steps.map(step => (
            <Fragment key={step.index}>
              <div className={styles.bubbleDrop}>{step.index}</div>
              <div className={styles.stepDescription}>
                <div className={styles.subTitle}>{step.title}</div>
                {step.text}
              </div>
            </Fragment>
          ))}
        </div>
        <Link href={pageLinks.GroupGiftStart.url}>
          <a>
            <DarkButton passedClass={styles.startGiftingButton}>START GIFTING</DarkButton>
          </a>
        </Link>
      </div>
    </div>
  );
}
