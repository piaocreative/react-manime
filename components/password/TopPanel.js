import React from 'react';
import Box from '../styled/Box';
//import { HalfBox, ImgBox } from '../styled/StyledComponents';

import { HalfBox, ImgBox } from '../auth/styled';

const TopPanel = ({isChangeFlow}) => (
  <HalfBox>
    <ImgBox height='200px' pb={['80px', 0]} display='flex' flexDirection='column' justifyContent='center'>
      <Box
        fontSize={['18px', '35px']}
        textAlign='center'
        fontFamily='avenirLight'
        letterSpacing='2px'>
        {!isChangeFlow ?
          <span>LET'S SET A <br />NEW PASSWORD</span>: 
          <span>WANT TO CHANGE <br />YOUR PASSWORD?</span>
        }      
      </Box>
      <Box mt='20px' textAlign='center'>
      {/* {!isChangeFlow ?
        'Don’t worry, it happens to the best of us.':
        'Let’s do it!'
      } */}
        
      </Box>
    </ImgBox>
  </HalfBox>
);

export default TopPanel;