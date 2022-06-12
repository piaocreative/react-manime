import React from 'react';
import classNames from 'classnames';
import style from '../../static/components/landing/landing-section3.module.css';

const displayItems = [
  {
    title: 'SCAN',
    image: '/static/icons/scan-icon.svg',
    description: 'Begin the process by taking 5 simple photos of your hand on top of a standard card.'
  },
  {
    title: 'SHOP',
    image: '/static/icons/shop-icon.svg',
    description: 'Select your favorite designs from our gallery of professional nail art.'
  },
  {
    title: 'RECEIVE',
    image: '/static/icons/deliver-icon.svg',
    description: 'In 3-4 business days, we’ll deliver a set of custom-fit manis made just for you.'
  },
  {
    title: 'PEEL & WEAR',
    image: '/static/icons/peelwear-icon.svg',
    description: 'Our manis can be applied in less than five minutes anytime, anywhere. Removal is even easier!'
  }
];

const LandingHowWorkSection = () => {
  return (
    <div className={style.root}>
      <div className={style.mainTitle}>HOW DOES IT WORK?</div>
      <div className={style.container}>
        {displayItems.map((item, index) => (
          <div key={index} className={style.displayItem}>
            <div className={style.imageBox}>
              <img src={item.image} alt={item.title} />
            </div>
            <div>
              <div className={style.title}>{item.title}</div>
              <div className={classNames(style.description, index ===3 && style.longDescription)}>{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingHowWorkSection;