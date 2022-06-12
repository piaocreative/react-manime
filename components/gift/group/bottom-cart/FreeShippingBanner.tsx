import React from 'react';
import Box from 'components/styled/Box';

export default function FreeShippingBanner () {
  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      background='#f5bfa0'
      height='30px'
      fontSize='12px'
      letterSpacing='1px'
      style={{textTransform: 'uppercase'}}>
      Free shipping over $30 / Kit
    </Box>
  )
}