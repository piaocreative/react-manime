import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Box from '../../../components/styled/Box';
import {Product, Address} from '../../../types';
import {GiftMessageForm} from './GiftMessage';
import { isEmpty } from '../../../utils/validation';

const Container = styled(Box)`
  background: #f5f1e9;
  width: 100%;
  margin: 0 auto;
  padding: 24px;
  flex: 1;
  font-size: 14px;
  max-width: 480px;
  margin-top: 24px;
  @media (min-width: 1024px) {
    padding: 24px 40px;
    margin-top: 40px;
  }
`;

const BoldBox = styled(Box)`
  font-family: avenirHeavy;
  margin-right: 8px;
  @media (min-width: 1024px) {
    font-size: 14px;
  }
`;

const EditBox = styled(Box)`
  cursor: pointer;
`;

export type Order = {
  taxes: number,
  shipping: number,
  quantity: number,
  product: Product
};

type GiftDetailsProps ={
  order: Order
  giftMessage: GiftMessageForm,
  shippingAddress: Address,
  step: string,
  editable?: boolean
};


const defaultGiftMessage = {
  fromName: 'Sender',
  fromEmail: 'gifter@manime.co',
  toName: 'Receiver',
  message: 'I love you',
};

const defaultShippingAddress = {
  firstName: 'First Name',
  lastName: 'Last Name', 
  firstLine: '90405 Olympic St',
  lastLine: 'Santa Monica, California',
  city: 'San Francisco',
  state: 'CA', 
  zip: '90405',
  country: 'United States',
}

export default function GiftDetails({order, giftMessage, shippingAddress, step='', editable=false}: GiftDetailsProps){
  if (!step) return null;
  const router = useRouter();

  const moveToMessageHandler = () => {
    const path = router.asPath.replace('/shipping', '').replace('/creditCard', '');
    router.push(router.pathname, `${path}`, { shallow: true });
  };

  const moveToShipingHandler = () => {
    const path = router.asPath.replace("/creditCard", "/shipping")
    router.push(router.pathname, `${path}`, { shallow: true });
  };

  return (
    <Container>
      <Box fontSize={['14px', '16px']} pb={['8px', '20px']} mb={['8px', '20px']} borderBottom='1px solid' letterSpacing='1px'>GIFT DETAILS</Box>
      <Box display='flex' mt={3}>
        <BoldBox>Gift box custom message</BoldBox>
        { editable  && <EditBox ml='auto' onClick={moveToMessageHandler}>Edit</EditBox> }
      </Box>
      {!isEmpty(giftMessage) &&
        <>
          <Box display='flex' my={1}>
            <BoldBox>From:</BoldBox>
            <Box>{giftMessage?.fromName || ''}</Box>
          </Box>
          <Box display='flex' my={1}>
            <BoldBox>To:</BoldBox>
            <Box>{giftMessage?.toName || ''}</Box>
          </Box>
          <Box display='flex' my={1}>
            <BoldBox>Message:</BoldBox>
            <Box>{giftMessage?.message || ''}</Box>
          </Box>
        </>
      }
      {step !== 'shipping' &&
        <>
          <Box height='1px' width={1} my={3} borderBottom='1px solid' />
          <Box display='flex' mt={3}>
            <BoldBox>Shipping Details</BoldBox>
            { editable  && <EditBox ml='auto' onClick={moveToShipingHandler}>Edit</EditBox> }
          </Box>
          {!isEmpty(shippingAddress) &&
            <>
              <Box my={1}>{shippingAddress?.line1 || ''}</Box>
              <Box>{shippingAddress?.line2 || ''}</Box>
              <Box>{`${shippingAddress?.city}, ${shippingAddress.state} ${shippingAddress.zip}`}</Box>
            </>
          }
        </>
      }
      <Box height='1px' width={1} my={3} borderBottom='1px solid' />
    </Container>
  );
};

