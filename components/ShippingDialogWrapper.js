
import React from 'react';
import styled from 'styled-components';
import Box from '../components/styled/Box';

const Container = styled(Box)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 200;
  padding: 20px;
`;

const ShippingDialogWrapper = ({ children }) => {
  return (
    <Container>
      <Box position='relative' width={['100%', '500px', '668px']} minHeight='400px' background='#FCF9F7' p={4}>
        {children}
      </Box>
    </Container>
  );
}

export default ShippingDialogWrapper;
