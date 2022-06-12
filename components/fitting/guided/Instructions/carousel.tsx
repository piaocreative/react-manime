import React from 'react';
import CheckIcon from 'components/icons/howto/CheckIcon';
import UnCheckIcon from 'components/icons/howto/UncheckIcon';
import Slider from 'react-slick';
import style from '@styles/fitting/guided/instructions.module.css';
import cStyle from '@styles/fitting/guided/carousel.module.css';
export default function Carousel(props) {
  const checkIconJsx = (
    <CheckIcon className={cStyle.checkIcon} color="#59ab8f" />
  );
  const unCheckIconJsx = (
    <UnCheckIcon className={cStyle.checkIcon} color="#ec7653" />
  );

  const standardCardList = [
    {
      label: 'Credit Card',
      checked: true,
    },
    {
      label: 'Driver’s license',
      checked: true,
    },
    {
      label: 'Library Card',
      checked: true,
    },
  ];
  var settings = {
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  return (
    <div className={cStyle.carousel}>
      <Slider {...settings}>
        <div className={cStyle.card}>
          <div className={style.subTitle}>
            Getting your custom-fit is fast and easy!
          </div>
          <div className={cStyle.cardRow}>
            We’ll walk you through exactly how to take picture of your nails so
            your ManiMe stick on gels fit your nails. Don’t forget to give us
            camera access so we can work our magic.
          </div>
        </div>
        <div className={cStyle.card}>
          <div className={style.subTitle}>Lights! Camera! Action!</div>
          <div className={cStyle.cardRow}>
            Make sure you’ve got lots of lighting. If your pictures are blurry
            or poorly lit, the scanning won’t be as accurate.
          </div>
        </div>
        <div className={cStyle.card}>
          <div className={style.subTitle}>Grab a card and get started!</div>
          <div className={cStyle.cardRow}>
            Grab a credit card, driver’s license, or another standard-sized card
            to make sizing more accurate. All info is kept private, and your
            fingers should be covering up most of your card. Time to get
            started!
          </div>
        </div>
      </Slider>
    </div>
  );
}
