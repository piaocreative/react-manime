import React from 'react';
import styled from 'styled-components';
import Box from '../styled/Box';

const Container = styled(Box)`
  position: relative;
  padding: 10px 12px 45px;
  width: 50%;
  @media(min-width: 1024px) {
    width: 25%;
  }
`;

const TitleBox = styled(Box)`
  font-size: 16px;
  top: 30px;
  width: 100%;
  text-align: center;
  transform: translate(-50%, 0);
  left: 50%;
  @media(min-width: 768px) {
    top: 50px;
    font-size: 24px;
  }
`;

const DescriptionBox = styled(Box)`
  font-size: 10px;
  letter-spacing: 0;
  @media(min-width: 768px) {
    font-size: 14px;
  }
`;

const ImagePanel = styled(Box)`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('https://d1b527uqd0dzcu.cloudfront.net/web/design/design-essentials.jpg');
  background-color: #e8e9eb;
`;

const TopCoatAndCuticle = ({ isMobileView }) => {
  return (
    <Container>
      <TitleBox position='absolute' fontFamily='gentiumBasic'>
        <Box fontSize='10px' mb={2} fontFamily='avenirHeavy'>INTRODUCING</Box>
        Max Top Coat & <br />
        Magic Cuticle Pen
        <DescriptionBox mt={2}>
          Prime & shine - nail care <br />
          essentials for your deluxe <br />
          at-home manicure
        </DescriptionBox>
      </TitleBox>
      <ImagePanel />
    </Container>
  );
}

export default TopCoatAndCuticle;