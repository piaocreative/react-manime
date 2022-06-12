import React from 'react';
import styled from 'styled-components';
import Box from '../styled/Box';

const Container = styled.div`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  gap: 8px;
  place-content: center;
  place-items: center;
  // grid-gap: 8px;
  font-size: 12px;
  width: calc(100% - 40px);
  margin: 60px 20px -20px;
  padding: 30px 20px 20px;
  background-color: #f5ddcb;
  letter-spacing: 1px;
  @media (min-width: 768px) {
    width: 100%;
    margin-top: 100px;
    font-size: 14px;
    padding: 40px 0 32px;
  }
`;

const TopTitle = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 0;
  display: flex;
  place-items: center;
  font-size: 12px;
  letter-spacing: 2px;
  color: #fff;
  background-color: #F7BFA0;
  height: 32px;
  padding: 0 16px;
  text-transform: uppercase;
  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const Title = styled.div`
  font-family: avenirHeavy;
  font-size: 18px;
  letter-spacing: 1px;
  text-transform: uppercase;
  @media (min-width: 768px) {
    font-size: 24px;
  }
`;

const Description = styled.div`
  max-width: 240px;
  text-align: center;
  @media (min-width: 768px) {
    max-width: unset;
  }
`;

const ArchiveBanner = ({}) => {
  return (
    <Container>
      <TopTitle>Limited Time</TopTitle>
      <Title>'Bring it back' Offer</Title>
      <Description>Vote for your favorite looks and receive $5 credit if they're restocked</Description>
      <Box color='#90908a'>Offer valid through February 28th</Box>
    </Container>
  );
};

export default ArchiveBanner;