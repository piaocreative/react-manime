import React from 'react';
import classNames from 'classnames';
import { PrimaryButton } from 'components/basic/buttons';
import style from '@styles/fitting/mani/mobile/prepare.module.css';
import CheckIcon from 'components/icons/howto/CheckIcon';
import UnCheckIcon from 'components/icons/howto/UncheckIcon';

const logoImageSrc = 'https://d1b527uqd0dzcu.cloudfront.net/mobile/fitting/prepare-fitting-logo.jpg';

const cardList = [
  "Driver's license",
  'Library Card',
  'Credit Card',
  'Bus Card',
  'Student ID',
  'Business Card'
];

const Prepare = ({ nextButton, profileType=undefined, disabled }) => {
  return (
    <div className={style.container}>
      <div className={style.contentContainer}>
        <div className={style.titleContainer}>
          LET'S 3D SCAN YOUR {profileType || 'NAILS'}!
        </div>
        <div className={style.grabCard}>
          Before we begin, <span className={style.highLight}>grab a standard-size card!</span>
        </div>
        <div className={style.logoContainer}>
          <img src={logoImageSrc} alt='prepare-card' />
        </div>
        <div className={style.subTitle}>
          What’s a standard-size card? 
        </div>
        <div className={style.description}>
          {/* Your driver’s license or credit card - any card of this size works! You can also use a student ID, library card, bus card, gym membership car, etc. */}
        {cardList.map((card, index) => (
          <div className={style.cardItem} key={index}>
            {index < cardList.length - 1 ? <CheckIcon className={style.icon} color='green' />: <UnCheckIcon className={style.icon} /> }
            <span className={style.cardTitle}>{card}</span>
          </div>
        ))

        }
        </div>
        <div className={style.subDescription}>
          We recommend hiding sensitive information.
        </div>

        <div className={style.subTitle}>
          Why a standard-size card? 
        </div>
        <div className={classNames(style.description, style.whyCard)}>
          Our software uses the card as a reference to size your unique nails and customize a mani for you!
        </div>
      </div>
      <PrimaryButton
        disabled={disabled}
        passedClass={style.floatButton}
        onClick={nextButton}>
        I HAVE A CARD, LET'S DO IT
      </PrimaryButton>
    </div>
  );
}

export default Prepare;