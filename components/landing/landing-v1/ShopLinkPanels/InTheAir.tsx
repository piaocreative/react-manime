import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { pageLinks } from '../../../../utils/links';
import style from './css/solid-choice.module.css';

const imgDesktopSrc = 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/intheair-desktop.jpg?v=1592577761';
const butterflySrc = 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/butterfly.png?v=1592577760';

const InTheAirPanel = ({ isMobileView }) => {
  return (
    <div className={classNames(style.container, style.inTheAirContainer)}>
      <img className={style.butterfly} src={butterflySrc} alt='butterfly' loading='lazy' />
      <div className={classNames(style.textPanel, style.inTheAirTextPanel)}>
        <div className={classNames(style.title, style.inTheAirTitle)}>
          In The Air
        </div>
        <Link href={pageLinks.Collection['In the Air'].url}>
          <a className={style.link}>
            SHOP COLLECTION
          </a>
        </Link>
      </div>
      <img
        className={classNames(style.imgStyle, style.inTheAirImgStyle)}
        src={imgDesktopSrc}
        loading='lazy'
        alt='in-the-air' />
    </div>
  );
};

export default InTheAirPanel;