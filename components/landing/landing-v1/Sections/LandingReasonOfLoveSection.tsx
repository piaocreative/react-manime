import React from 'react';
import classNames from 'classnames';

import style from './css/landing-reasonoflove.module.css';

const iconList = [
  {
    iconPath: '/static/icons/product-detail/custom-fit.svg',
    pediIconPath: '/static/icons/product-detail/custom-pedi-fit.svg',
    text: `Custom fit to your nails`,
    pediText: `Custom fit to your toenails`,
  },
  {
    iconPath: '/static/icons/product-detail/easy-apply.svg',
    pediIconPath: '/static/icons/product-detail/easy-apply-pedi.svg',
    text: `Easy application`,
    pediText: `Easy application`
  },
  {
    iconPath: '/static/icons/product-detail/toxin-free.svg',
    text: `Toxin free`,
  },
  {
    iconPath: '/static/icons/product-detail/cruelty-free.svg',
    text: `Cruelty free`,
  },
];

const LandingReasonOfLoveSection = () => {
  return (
    <div className={style.container}>
      <div className={style.title}>WHY WE LOVE IT</div>
      <div className={style.iconsLine}>
      {iconList.map((item, index) => (
        <div className={style.oneItem} key={index}>
          <img
            className={style.iconStyle}
            src={item.iconPath}
            alt='icon-detail' />
          <div className={classNames((index >= 1) && style.twoLines, style.description)}>
            {item.text}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default LandingReasonOfLoveSection;