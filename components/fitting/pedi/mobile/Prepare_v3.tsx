import React from 'react';
import classNames from 'classnames';
import { PrimaryButton } from '../../../basic/buttons';
import style from '../../../../static/components/fitting/pedi/mobile/prepare-v3.module.css';
import CheckIcon from '../../../icons/howto/CheckIcon';
import UnCheckIcon from '../../../icons/howto/UncheckIcon';

const logoImageSrc = 'https://d1b527uqd0dzcu.cloudfront.net/mobile/fitting/pedi-prepare.jpg';

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
      <img src='/static/icons/pedi-circle-icon.svg' className={style.pediIcon} />
      <div className={style.contentContainer}>
        <div className={style.titleContainer}>
          LET'S 3D SCAN YOUR TOENAILS!
        </div>
        <div className={style.grabCard}>
          Before we begin, <span className={style.highLight}>put a standard-size card on the floor!</span>
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
          Our software uses the card as a reference to size your unique nail and customize a pedi for you!
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