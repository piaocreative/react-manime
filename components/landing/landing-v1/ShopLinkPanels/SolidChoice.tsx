import React from 'react';
import Link from 'next/link';
import { pageLinks } from '../../../../utils/links';
import style from './css/solid-choice.module.css';

const imgMobileSrc = 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/solid-choice-mobile.jpg?v=1592577762';
const imgDesktopSrc = 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/solid-choice-desktop.jpg?v=1592577762';

const SolidChoicePanel = ({ isMobileView }) => {
  return (
    <div className={style.container}>
      <div className={style.textPanel}>
        <div className={style.title}>
          Solid Colors
        </div>
        <Link href={pageLinks.Collection['Solid Colors'].url}>
          <a className={style.link}>
            SHOP COLLECTION
          </a>
        </Link>
      </div>
      <img
        className={style.imgStyle}
        src={isMobileView? imgMobileSrc : imgDesktopSrc}
        loading='lazy'
        alt='solid-choice' />
    </div>
  );
};

export default SolidChoicePanel;