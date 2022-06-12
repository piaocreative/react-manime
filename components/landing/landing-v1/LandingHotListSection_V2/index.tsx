import React, { useState, useEffect, useRef } from 'react';
import Router from 'next/router';
import { useSelector } from 'react-redux';
import Slider from 'react-slick';
import ShopifyHOC from 'components/ShopifyHOC';
import ProductItem from 'components/ProductItem';
import CustomArrow from './CustomArrow';
import CustomPrevArrow from './CustomPrevArrow';
import { PrimaryButton } from 'components/basic/buttons';
import { pageLinks } from 'utils/links';
import style from './css/landing-hot-list-v2.module.css';
import log from 'utils/logging'

import { isEmpty } from 'utils/validation';

const LandingHotListSection = ({trackFunnelAction, trackFunnelActionProjectFunnel, globalProps, ...props }) => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const [products, setProducts] = useState([]);
  const slider = useRef();
  const productsMap = useSelector((state : any) => state?.productsData?.productsMap);
  let trendingProductIds : string[] = [];
  if (globalProps.productList["What's Trending"]) {
    trendingProductIds = globalProps.productList["What's Trending"].products.map(data => data.productHandle);
    // console.log({trendingProductIds})
  }
  const productIds = trendingProductIds

  const settings = () => ({
    className: style.slider,
    infinite: false,
    speed: 200,
    slidesToShow: 5,
    slidesToScroll: 1,
    adaptiveHeight: true,
    // autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <CustomArrow disabled={activeSlide === 4} />,
    prevArrow: <CustomPrevArrow isLeft disabled={activeSlide === 0} />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots: true
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: true
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
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: '0px',
          dots: true
        }
      }
    ]
});



  const clickHandler = () => {
    // trackFunnelAction('A. Landing Page - HotList');
    trackFunnelActionProjectFunnel('A. Landing Page - HotList');
    Router.push(pageLinks.SetupDesign.url);
  };

  const resizeInit = async () => {
    await handleResize();
    window.addEventListener('resize', handleResize);
  }

  const handleResize = () => {
    if (typeof window !=='undefined') {
      if (window.innerWidth >= 768) {
        if (!isDesktop) setIsDesktop(true);
      } else if (window.innerWidth < 768) {
        if (isDesktop) setIsDesktop(false);
      }
    }
  };

  useEffect(() => {
    if (productIds.length && productsMap) {
      const allProducts = Object.values(productsMap);
      if (isEmpty(allProducts)) return;
      setProducts(
        productIds.map(
          productId => allProducts.find((product: any) => product.shopifyHandle === productId)).map((product: any) => ({...product, images: [product?.picuri1]})
        )
      );
    }
  }, [productsMap]);

  useEffect(() => {
    resizeInit();
    const url = new URL(window.location.href);
    const landing = url.searchParams.get('landing');
    if (landing) {
      let index = parseInt(landing) || 0;
      if (window.innerWidth >= 768) {
        index = (index >= 3)? 3: 0;
      }
      setActiveSlide(index);
      setTimeout(() => {
        Router.push(`${pageLinks.Home.url}#hotlist`);
        window.scrollTo(window.scrollX, window.scrollY - 300);
        log.info(index);
        if (index >= 1 && slider?.current) {
          const temp = slider as any;
          temp.current.slickGoTo(index);
        }
      })
    }
  }, []);

  return (
    <div className={style.container} id='hotlist'>
      <Slider
        ref={slider}
        {...settings()}
        // centerMode={!isDesktop}
        dots={!isDesktop}
        afterChange={setActiveSlide}
      >

        {products.map((product, index) => (
          <ProductItem
            landing={`${index}`}
            id={`${product.nailProductId}`}
            key={index}
            productItemData={product}
            {...props}
          />
        ))}
      </Slider>
      <div className={style.header}>
        <div className={style.title}>What's Trending</div>
        {/* <div className={style.description}>Our favorite manis</div> */}
      </div>
      <PrimaryButton passedClass={style.browseAll} onClick={clickHandler}>
        Browse All Manis
      </PrimaryButton>
    </div>
  );
};

export default ShopifyHOC(LandingHotListSection);
