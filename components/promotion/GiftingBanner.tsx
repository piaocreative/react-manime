import React from 'react';
import Link from 'next/link';
import style from './css/gifting-banner.module.css';
import { pageLinks } from '../../utils/links';

const GiftingBanner = () => {
  return (
    <Link href={pageLinks.Gift.url}>
      <a className={style.container}>
      </a>
    </Link>
  );
};

export default GiftingBanner;