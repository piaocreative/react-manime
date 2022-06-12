import React, { useRef } from 'react';
import classNames from 'classnames';
import Slider from 'react-slick';
import style from './css/landing-feature.module.css';
import log from '../../../../utils/logging'
const featureList = [
  {
    text: "The gel-like stickies are a genius way to get dope nail art if you're strapped for time, the worst at doing your own nails, or almost broke.",
    imgSrc: '../../../../static/images/landing/cosmopolitan-logo.png'    
  },
  {
    text: "These DIY Gel Nail Polish Stickers Are a Total Game Changer.",
    imgSrc: '../../../../static/images/landing/glamour-logo.png'
  },
  {
    text: "Think of chic packaging, easy application, and achievable nail goals.",
    imgSrc: '../../../../static/images/landing/marie-claire-logo.png'
  },
  {
    text: "A seamless process to custom-fit intricate nail designs to your nails that involves 3D modeling and laser cutting.",
    imgSrc: '../../../../static/images/landing/popsugar-logo.png'
  },
  {
    text: "Manicure of the future... the first-ever custom-fit stick-on gels developed with 3-D technology.",
    imgSrc: '../../../../static/images/landing/well-good-logo.png'
  },
  {
    text: "Best custom press-on nails... easy, no-glue needed application and even easier removal.",
    imgSrc: '../../../../static/images/landing/byrdie-logo.png'
  }
];

const LandingFeatureSection = props => {
  const slider = useRef();
  const { isMobileView } = props;

  const settings = () => ({
    className: style.slider,
    infinite: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 3,
    adaptiveHeight: true,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: false
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: false
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          speed: 200,
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true
        }
      }
    ]
});

  const prevClickHandler = () => {
    log.info(slider);
    const temp = slider as any;
    temp.current.slickPrev();
  };

  const nextClickHandler = () => {
    log.info(slider);
    const temp = slider as any;
    temp.current.slickNext();
  };

  return (
    <div className={style.container}>
      <div className={style.content}>
      <div className={style.title}>
        FEATURED IN
      </div>
      <Slider
        ref={slider}
        {...settings()}
        dots={isMobileView}
      >
      {featureList.map((item, index) => (
        <div key={index} className={style.featurePanel}>
          <div className={style.description}>
            <span className={classNames(![0, 3].includes(index) && style.descriptionText)}>"{item.text}"</span>
          </div>
          <div className={style.logoWrapper}>
            <img className={classNames(style.logo, index === 3 && style.popSugar, index ==4 && style.wellGood)} src={item.imgSrc} alt='logo' />
          </div>
        </div>
      ))}
      </Slider>
      </div>
      <div className={style.arrowLine}>
        <img
          src='/static/icons/arrow-right-long.svg'
          onClick={prevClickHandler}
          alt='arrow-left' />
        <img
          src='/static/icons/arrow-right-long.svg'
          onClick={nextClickHandler}
          alt='arrow-right' />
      </div>
    </div>
  );
};

export default LandingFeatureSection;