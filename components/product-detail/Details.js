import React from 'react';
import classNames from 'classnames';
import style from './css/details.module.css';

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
    text: `No dry time`,
    pediText: `No dry time`
  },
  {
    iconPath: '/static/icons/product-detail/toxin-free.svg',
    text: `Toxin-free`,
  },
  {
    iconPath: '/static/icons/product-detail/cruelty-free.svg',
    text: `Cruelty-free`,
  },
  {
    iconPath: '/static/icons/product-detail/long-lasting.svg',
    text: `Lasts up to 10 days`,
  },
];

const Details = ({ isPedis }) => {
  return (
    <div className={style.container}>
      <div className={style.oneLine}>
        <span className={style.title}>What is it: </span>
        {isPedis ? 'At-home gel pedi kit': 'At-home gel mani kit'}
      </div>
      <div className={classNames(style.oneLine, style.title)}>
        {isPedis ? 'Each pedi set contains:': 'Each mani kit contains:'}
      </div>
      <div className={style.oneLine}>
        <img
          className={style.maniset}
          src='/static/images/maniset.png' />
        <div className={style.manisetLabel}>
          <span>
            {isPedis ? '1 pedi sheet with 15 stick on gels': '1 mani sheet with 15 stick on gels'}
          </span>
          <span>+ 1 nail file </span>
          <span>+ 1 prep pad (no UV needed!)</span>
        </div>
      </div>
      <div className={classNames(style.oneLine, style.title)}>
        Why we love it:
      </div>

      <div className={style.iconsLine}>
      {iconList.map((item, index) => (
        <div className={style.oneItem} key={index}>
          <img
            className={style.iconStyle}
            src={isPedis? (item.pediIconPath || item.iconPath): item.iconPath}
            alt='prod-detail' />
          <div className={classNames((index >= 1 && index < 4) && style.twoLines, style.description)}>
            {isPedis ? (item.pediText || item.text) : item.text}
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Details;