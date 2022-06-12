import React, { Fragment, useState } from 'react';


import Box from '../styled/Box';
import ReactMarkdown  from 'react-markdown'
import { A, HalfBox, ImgBox, Line, BackBox } from './styled';
import style  from '../../static/components/auth/error.module.css';

type ErrorProps = {
  error: string
  back: Function
}

export default function ErrorPage({ error, back }: ErrorProps) {




  return (
    <Fragment>
      <HalfBox >
        <ImgBox height='250px' pb={['80px', 0]}>
          <Box
            display='flex'
            alignItems='center'
            textAlign='center'
            height='100%'
            px={4} >
            <Box
              width={1}
              flex='1 0 auto'
              px={3}
              mt={['-50px', 0]}
              fontFamily='avenirBook'
              fontSize={['18px', '35px']}
              letterSpacing='2px'
              fontWeight='500'
              style={{ cursor: 'default' }}>
              <span style={{ textTransform: 'uppercase' }}>
                Houston we have a problem
              </span>
            </Box>
          </Box>
        </ImgBox>
      </HalfBox>
      <HalfBox
        decoration
        p={['0 12px', 0]} position='relative' 
      >

        <Box p={[3, 5]} background='#F9F9F9' >

          <BackBox
            onClick={back}>
            <img src='/static/icons/back.svg' />
            BACK
          </BackBox>
          <Box display='flex' my={4}>
            <Box
              className={style.authError}
              display='flex'
              justifyContent='center'
              px={2}
              fontFamily='avenirBook'
              fontSize={4}
              fontWeight='500'
              letterSpacing='2px'
              style={{ cursor: 'default' }}>
                <ReactMarkdown source={error} />
            </Box>
          </Box>
        </Box>


      </HalfBox>
    </Fragment>
  );
}
