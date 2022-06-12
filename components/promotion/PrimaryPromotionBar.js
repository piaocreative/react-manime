import React, { useRef } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Slider from 'react-slick';
import Box from '../styled/Box';
import ArrowIcon from '../icons/ArrowIcon';
import style from './css/promotion.module.css';

const ContainerBox = styled(Box)`
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 30px;
  background-color: ${props => (props.backgroundColor || '#f7bfa0')};
  background-image: ${props => (props.backgroundImage || '')};
  color: ${props => (props.color || '#2c4349')};
  display: flex;
  align-items: center;
  transition: transform .3s ease-in-out,-webkit-transform .3s ease-in-out;
  -webkit-transition-delay: .3s;
  transform: ${props => props.primaryPromotionHeight ? 'translateY(0%)': `translateY(-${props.primaryPromotionHeight}px)`};

  & div {
    color: ${props => (props.color || '#2c4349')};
  }
`;

const FreeShippingBox = styled(Box)`
  position: relative;
  width: 100%;
  z-index: 100;
  height: 30px;
  font-size: 12px;
  display: flex !important;
  justify-content: center;
  align-items: center;

  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const LeftArrow = styled(ArrowIcon)`
  cursor: pointer;
  transform: rotate(90deg);
  position: absolute;
  left: 28px;
  z-index: 250;
  @media (min-width: 768px) {
    left: 70px;
  }
`;

const RightArrow = styled(ArrowIcon)`
  cursor: pointer;
  transform: rotate(-90deg);
  position: absolute;
  right: 28px;
  z-index: 250;
  @media (min-width: 768px) {
    right: 70px;
  }
`;

const CustomLink = styled(Box)`
  text-decoration: underline;
  cursor: pointer;
  @media (max-width: 340px) {
    margin-right: 32px;
  }
`;

const Img = styled.img`
  cursor: pointer;
  position: absolute;
  right: 8px;
  z-index: 200;
`;

const settings = {
  className: style.slider,
  dots: false,
  infinite: true,
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  pauseOnHover: true,
  arrows: false
};

const PrimaryPromotionBar = ({ primaryPromotionHeight, onClose, contents }) => {
  const slider = useRef();

  const promotionJsxList = (contents?.cards || []).map(card => (
    <FreeShippingBox key={1}>
      <Box letterSpacing={[0, '1px']}>
        {card.content}
      </Box>
      <Box pr={2} />
      <Link href={card.redirectUrl}>
        <a>
          <CustomLink>{card.redirectLabel}</CustomLink>
        </a>
      </Link>
    </FreeShippingBox>    
  ));
  
  const addIndexHandler = increment => () => {
    if (increment > 0)
      slider.current.slickNext();
    else
      slider.current.slickPrev();
  };

  return (
    <ContainerBox
      primaryPromotionHeight={primaryPromotionHeight}
      backgroundColor={contents?.backgroundColor}
      backgroundImage={contents?.backgroundImage}
      color={contents?.textColor || '#2C4349'}>
      <LeftArrow color={contents?.textColor || '#2C4349'} onClick={addIndexHandler(-1)} />
      {promotionJsxList.length > 0 ?
        <Slider
          ref={slider}
          {...settings}>
          {promotionJsxList}
        </Slider>: null
      }
      <RightArrow color={contents?.textColor || '#2C4349'} onClick={addIndexHandler(1)} />
      {contents?.canClose &&
        <Img src='/static/icons/close-dark-icon.svg' alt='close' onClick={onClose} />
      }
    </ContainerBox>
  );
};

export default PrimaryPromotionBar;