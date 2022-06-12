import React from 'react';
import Box from '../styled/Box';
// import { HalfBox, ImgBox } from '../styled/StyledComponents';
import { HalfBox, ImgBox } from '../auth/styled';

const TopPanel = () => (
  <HalfBox>
    <ImgBox height='200px' pb={['80px', 0]} display='flex' flexDirection='column' justifyContent='center'>
      <Box
        fontSize={['18px', '35px']}
        textAlign='center'
        fontFamily='avenirLight'
        letterSpacing='2px'>
        PASSWORD <br /> CHANGED!
      </Box>
    </ImgBox>
  </HalfBox>
);

export default TopPanel;