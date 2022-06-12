import React from 'react';
import styled from 'styled-components';
import Box from '../../styled/Box';

const Container = styled(Box)`
  position: relative;
  padding: 10px 12px 45px;
  width: 100%;
  @media(min-width: 1024px) {
    width: 50%;
  }
`;

const ImagePanel = styled(Box)`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('https://cdn.shopify.com/s/files/1/0253/6561/0605/files/byn-banner-desktop.jpg?v=1602495549');
`;

const BYNBanner = ({ isMobileView }) => {
  if (isMobileView) return null;
  return (
    <Container>
      <ImagePanel />
    </Container>
  );
}

export default BYNBanner;