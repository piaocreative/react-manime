import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import config from 'config';
import { pageLinks } from 'utils/links';

import Bubble from '../icons/Bubble';

const colorMap = {
  'new': {bg: '#f7bfa0', color: '#2c4349'},
  'sold out': {bg: '#d0d0d0', color: '#2c4349'},
  'back in stock': {bg: '#2c4349', color: '#fff'},
  'sale': {bg: '#cf211b', color: '#fff'},
  'last chance': {bg: '#f5ddcb', color: '#2c4349'},
  'coming soon': {bg: '#f5ddcb', color: '#2c4349'},
};

const Container = styled.div`
  position: relative;
  text-align: center;
`;

const TagBox = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  height: 16px;
  padding: 2px 6px 0;
  font-size: 9px;
  text-transform: uppercase;
  color: ${props => colorMap[props.tagType].color};
  background-color: ${props => colorMap[props.tagType].bg};
  border: 1px solid transparent;
  border-color: ${props => colorMap[props.tagType].border};
  white-space: nowrap;
  margin-top: -12px;
  margin-bottom: -4px;
  z-index: 1;

  @media (min-width: 1024px) {
    height: 20px;
    font-size: 10px;
    margin-top: -14px;
    margin-bottom: -6px;
  }

`;

const SolidDropWithTag = ({
  color=undefined, 
  className='', 
  productId, 
  linkHandle=undefined, 
  image=`https://d1b527uqd0dzcu.cloudfront.net/web/product-svgs/${productId}.svg`}) => {

  const products = useSelector((state : any) => state.productsData.products);
  const productData = products.find(product => product.nailProductId === productId);
  // const productData = productsMap?.[productId];
  const tags = productData?.tags || [];
  const isOutOfStock = parseInt(productData?.quantity || '0') <= config.soldOutThreshold;
  const isNew = tags.includes('new');
  const isLastChance = tags.includes('last chance');
  const isSale = tags.includes('sale');
  const isBackInStock = tags.includes('backinstock');

  const tagType = isOutOfStock? 'sold out': isNew? 'new':
    isLastChance? 'last chance': isSale? 'sale': isBackInStock? 'back in stock': '';

  return (
    <Link href={'/product/[handle]'} as={`${pageLinks.ProductDetail.url}${linkHandle}`}>
      <a>
        <Container>
          {color ?
            <Bubble
              className={className}
              color={color} />:
            <img
              className={className}
              src={image}
              alt='solid-drop'/>
          }
          {tagType &&
            <TagBox tagType={tagType}>
              {tagType}
            </TagBox>
          }
        </Container>
      </a>
    </Link>
  );
};

export default SolidDropWithTag;