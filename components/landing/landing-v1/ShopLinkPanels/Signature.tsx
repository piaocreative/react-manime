import React from 'react';
import Link from 'next/link';
import { pageLinks } from '../../../../utils/links';
import style from './css/solid-choice.module.css';

const imgMobileSrc = 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/signature-mobile.jpg?v=1592577761';
const imgDesktopSrc = 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/signature-desktop.jpg?v=1592577761';

const SignaturePanel = ({ isMobileView }) => {
  return (
    <div className={style.container}>
      <div className={style.textPanel}>
        <div className={style.title}>
          SIGNATURE
        </div>
        <Link href={pageLinks.Collection['Signature'].url}>
          <a className={style.link}>
            SHOP COLLECTION
          </a>
        </Link>
      </div>
      <img
        className={style.imgStyle}
        src={isMobileView? imgMobileSrc : imgDesktopSrc}
        loading='lazy'
        alt='signature' />
    </div>
  );
};

export default SignaturePanel;