import Link from 'next/link';
import React, { useState } from 'react';
import Slider from 'react-slick';

import CustomArrow from './CustomArrow';
import HowToRemoveSection from './HowToRemoveSection';
import { pageLinks } from 'utils/links';

import style from '../../../static/components/howto/apply/howto-extra-remove.module.css';

const miracleBaseCoatLink = `${pageLinks.ProductDetail.url}miracle-base-coat}`

const ShortNailsJsx = () => (
  <>
    Try trimming the excess gel with <span className={style.bold}>nail clippers</span> instead of filing. <br /><br />
    Need a length adjustment for your next set? Shoot us an email to <a  target="_top" href={'mailto:care@manime.co'} className={style.underline}>care@manime.co</a>
  </>
);

const BrittleJsx = () => (
  <>
    We recommend applying a strengthening base coat like our <Link href={miracleBaseCoatLink}><a className={style.underline}>Miracle Base Coat</a></Link>. <br /><br />
    Infused with argan oil, keratin, and calcium, Miracle Base Coat helps strengthen nails damaged by gel or acrylic product removal. <br /><br />
    The Miracle Base Coat will also help prime your nails to be perfectly ready for ManiMe gel application.
  </>
);

const OilJsx = () => (
  <>
    Avoid oil-based products before mani application (lotion, sunscreen, etc). <br /><br />
    Nails are porous and can retain oil even after hand-washing. <br /><br />
    Excess oil on nails will cause the gels to lose their adhesion. 
  </>
);

const WaterExposureJsx = () => (
  <>
    Wait at least 30 minutes before exposing your mani or pedi to water. <br /><br />
    After that, the gels are made to withstand swimming, bathing, handwashing, etc!
  </>
);

const extraInfoList = [
  {title: 'Short nails', description: <ShortNailsJsx />},
  {title: 'Brittle / weak nails', description: <BrittleJsx />},
  {title: 'Oil is the enemy!', description: <OilJsx />},
  {title: 'Water exposure', description: <WaterExposureJsx />},
];

const HowToExtraAndRemove = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const settings = () => ({
    className: style.slider,
    infinite: false,
    speed: 200,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <CustomArrow disabled={activeSlide === 3} />,
    prevArrow: <CustomArrow isLeft disabled={activeSlide === 0} />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true
        }
      }
    ]
});

  return (
    <div className={style.root}>
      <div className={style.extraContainer}>
        <div className={style.titlePanel}>
          <div className={style.titleTop}>EXTRA</div>
          <div className={style.titleBottom}>RECOMMENDATIONS</div>
        </div>
        <Slider
          {...settings()}
          centerMode={false}
          dots={true}
          afterChange={setActiveSlide}>
          {extraInfoList.map((extraInfo, index) => (
            <div key={index} className={style.slideItem}>
              <div className={style.extraInfoTitle}>{extraInfo.title}</div>
              <div className={style.extraInfoDescription}>{extraInfo.description}</div>
            </div>
          ))}
        </Slider>
      </div>
      <div className={style.removeContainer}>
        <HowToRemoveSection />
      </div>
    </div>
  );
};

export default HowToExtraAndRemove;