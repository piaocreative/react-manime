import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import Slider from 'react-slick';
import style from './css/landing-banner.module.css';

import LandingImageSection4 from './LandingImageSection4';
import LandingPediSection from './LandingPediSection';
import LandingCareImageSection from './LandingCareImageSection';
import LandingImageSection2 from './LandingImageSection2';
import Bubble from '../../icons/Bubble';
import BubbleWithBorder from '../../icons/BubbleWithBorder';
import ArrowIcon from '../../icons/ArrowIcon';
import log from '../../../utils/logging'

const LandingBanner = props => {
  const slider = useRef();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { isMobileView } = props;

  const settings = () => ({
    className: style.slider,
    infinite: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    dots: true,
    centerMode: true,
    centerPadding: '0px',
    // lazyLoad: true,
    beforeChange: (prev, next) => {
      setCurrentSlide(next);
    },
    appendDots: dots => (
      <div className={style.mySlickDots}>
        <ul className={style.dotsLine}> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      currentSlide === i ?
      <Bubble
        className={style.bubbleDot}
        color={'#fff'}/>:
      <BubbleWithBorder
        className={style.bubbleDot} />
    ),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          speed: 200
        }
      },
    ]
});

  const prevClickHandler = () => {
    log.info(slider);
    const temp = slider as any;
    temp.current.slickPrev()
  };

  const nextClickHandler = () => {
    log.info(slider);
    const temp = slider as any;
    temp.current.slickNext();
  };

  const propParam = {
    trackFunnelAction: props.trackFunnelAction,
    trackFunnelActionProjectFunnel: props.trackFunnelActionProjectFunnel,
    isMobileView: isMobileView
  };

  return (
    <div className={style.container}>
      <Slider
        ref={slider}
        {...settings()}
      >
        <LandingImageSection4 {...propParam} />
        <LandingPediSection {...propParam} />
        <LandingCareImageSection {...propParam} />
        <LandingImageSection2 {...propParam} />
      </Slider>
      <div className={style.arrowLine}>
        <ArrowIcon onClick={prevClickHandler} className={style.leftArrow} />
        <ArrowIcon onClick={nextClickHandler} className={style.rightArrow} />
      </div>
    </div>
  );
};

export default LandingBanner;