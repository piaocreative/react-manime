
import React from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { DarkButton } from '../../basic/buttons';
import { pageLinks } from '../../../utils/links';
import style from '../../../static/components/howto/work/howto-welcome-section.module.css';

const infoList = [
  {
    title: '3D SCAN YOUR NAILS',
    description: 'Using your phone, take 5 photos of your hands and we’ll take care of the rest! We use these photos to create your custom manis!',
    imageURL: 'https://d1b527uqd0dzcu.cloudfront.net/web/gif/howto-scan.gif',
    label: '3D SCAN MY NAILS',
    link: pageLinks.GuidedFitting.url
  },
  {
    title: 'CHOOSE YOUR DESIGN',
    description: 'We have manis for every occasion and style. From chic neutrals to nail art collaborations, we’ve got you covered.',
    imageURL: 'https://d1b527uqd0dzcu.cloudfront.net/web/gif/howto-choose-design.gif',
    label: 'BROWSE STICK ON GELS',
    link: '/shop'
  },
  {
    title: 'ENJOY YOUR MANI MAKEOVER!',
    description: 'Your fully custom, made-to-order manis will arrive in 4-7 business days.Tag @manime.co and show us your #hightechmani!',
    imageURL: 'https://d1b527uqd0dzcu.cloudfront.net/web/gif/howto-enjoy.gif',
    label: 'GET YOUR AT-HOME MANI',
    link: '/shop'
  },
];

const HowToWelcomeSection = () => {
  return (
    <div className={style.container}>
    {infoList.map((item, index) => (
      <div className={style.stepContainer} key={index}>
        <div className={style.gifWrapper}>
          <img src={item.imageURL} className={classNames(style.gifAnimation, index ===1 && style.chooseDesign)} alt={item.title} />
        </div>
        <div className={style.stepNumber}>{`STEP ${index + 1}`}</div>
        <div className={style.title}>{item.title}</div>
        <div className={style.description}>{item.description}</div>
        <Link href={item.link}>
          <a>
            <DarkButton passedClass={style.actionButton}>
              {item.label}
            </DarkButton>
          </a>
        </Link>
      </div>
    ))

    }
    </div>
  );
};

export default HowToWelcomeSection;