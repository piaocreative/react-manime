import React from 'react';
import styles from '@styles/gift/group/description.module.css';

const stepList = [
  {
    index: 1,
    title: 'Build your Friends Gift Kit',
    text: (
      <>
        You fill the gift kit with your favorite manis, pedis and/or nail care essentials. You can
        choose any of our 100+ products and put as many as you want.
        <br />
        <br />
        Remember, you will get FREE shipping in kits over $30.
      </>
    ),
  },
  {
    index: 2,
    title: 'Enter recipients’ email',
    text: (
      <>
        Give to as many recipients as you want. The more recipients you add, the more you save.
        Discounts can go up to 30%.
        <br />
        You will only need an email address of each recipient to send them a gift kit.
      </>
    ),
  },
  {
    index: 3,
    title: 'Recipients redeem their Gift Kit ',
    text: (
      <>
        Recipients get a unique link to scan their nails and redeem the gift kit. They will not have
        to pay for anything.
        <br />
        <br />
        Gift kits arrive 4-7 business days after recipients redeem the gift. Each kit is shipped
        individually to each recipient.
      </>
    ),
  },
];

export default function GiftDescription({ title = 'HOW GROUP GIFTING WORKS', steps = stepList }) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.stepContainer}>
        {steps.map(step => (
          <div className={styles.stepItem} key={step.title}>
            <div className={styles.stepIndex}>Step {step.index}</div>
            <div className={styles.stepTitle}>{step.title}</div>
            {step.text}
          </div>
        ))}
      </div>
    </div>
  );
}
