import React from 'react';
import styled from 'styled-components';
import { Product, } from 'types';

const Container = styled.div`
  display: grid;
  grid-template-columns: ${props => `repeat(${props.counts}, 1fr)`};
  grid-gap: 8px;
  width: 100%;
  max-width: 480px;
  margin: 20px auto;
  text-align: center;
  padding: 0 12px;

  @media (min-width: 480px) {
    grid-gap: 16px;
    padding: 0;
  }
`;

const BannerIcon = styled.img`
  width: 64px;
  height: 64px;
`;

const Title = styled.div`
  font-family: AvenirHeavy;
  font-size: 12px;
  margin: 8px 0;
  min-height: 34px;

  @media (min-width: 480px) {
    font-size: 14px;
  }
`;

const Text = styled.div`
  font-size: 12px;
  color:#a3a3a3;
`;

type Props = {
  products: Product[]
}

export default function GiftShortBanner ({ products }: Props) {
  return (
    <Container counts={products?.length}>
    {products.map((product, index) => (
      <div key={index}>
        <BannerIcon src={product?.extraFields?.banner?.icon} alt='gift-icon' />
        <Title>
          {product?.name?.includes('Gift Kit') ?
          <>
            {product?.name.replace('Gift Kit', '')} <br />
            Gift Kit
          </>:
          product?.name
        }
        </Title>
        <Text>{product?.extraFields?.banner?.description}</Text>
      </div>
    ))}
    </Container>
  );
};