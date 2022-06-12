import React from 'react';
import styled from 'styled-components';
import Box from '../../../components/styled/Box';
import {Product, Address} from '../../../types';
import {GiftMessageForm} from './GiftMessage';
import log from '../../../utils/logging'
const Container = styled(Box)`
  background: #f9f9f9;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
  flex: 1; 
  max-width: 480px;
  @media (min-width: 1024px) {
    padding: 24px 40px;
  }
`;

const LineItem = styled(Box)`
  display: grid;
  grid-template-columns: auto 1fr;
  background: #fff;
  padding: 10px;

  @media (min-width: 1024px) {
    padding: 20px;
  }
`;

const ProductImage = styled.div`
  width: 80px;
  height: 80px;
  background-image: ${props => `url(${props.imageBg})`};
  background-color: #fff;
  background-size: cover;
  background-repeat: no-repeat;

  @media (min-width: 1024px) {
    width: 100px;
    height: 100px;
  }
`;

const ProductInfoBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const PriceLine = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
`;


export type Order = {
  taxes: number,
  shipping: number,
  quantity: number,
  product: Product,
  estimate?: boolean
};

type OrderSummaryProps ={
  order: Order
  giftMessage: GiftMessageForm,
  shippingAddress: Address,
  preLaunchDateString?: string,
};

export default function OrderSummary({order, giftMessage, shippingAddress, preLaunchDateString}: OrderSummaryProps){
  const {taxes, shipping} = order

  const price = order?.product?.price || 0
  const shippingTotal = order?.shipping || 0
  const taxesTotal = order?.taxes || 0
  const total = price + shippingTotal + taxesTotal;


  return (
    <Container>
      <Box fontSize={['14px', '16px']} pb={['8px', '20px']} mb={['8px', '20px']} borderBottom='1px solid' letterSpacing='1px'>ORDER DETAILS</Box>
      <LineItem>
        <ProductImage imageBg={order?.product?.picuri1} />
        <ProductInfoBox ml='16px' fontSize={['14px', '14px']}>
          <Box>{order?.product?.name}</Box>
          <Box display='flex' justifyContent='space-between'>
            <Box>Qty: {order?.quantity || 0}</Box>
            <Box>$ {order?.product?.price?.toFixed(2)}</Box>
          </Box>
        </ProductInfoBox>

      </LineItem>
      <PriceLine mt={3}>
        <Box>Bag Items:</Box><Box>${price.toFixed(2)}</Box>
      </PriceLine>
      <PriceLine>
        <Box fontSize={['12px', '14px']}>Shipping (3-4 business days{preLaunchDateString? `, starting ${preLaunchDateString}` : ''})</Box>
        <Box>${  (order.estimate?  0.00 : order.shipping).toFixed(2) }</Box>
      </PriceLine>
      <PriceLine>
         { !order.estimate && <><Box>Total Taxes:</Box><Box>${taxes}</Box> </>}
      </PriceLine>
      <Box height='1px' borderBottom='1px solid' my={3}/>
      <PriceLine>
        <Box fontFamily='avenirHeavy'>{!taxes ? 'Subtotal pre tax' : 'Total price'}</Box><Box fontFamily='avenirHeavy'>
          ${total?.toFixed(2)}
        </Box>
      </PriceLine>
    </Container>
  );
};

