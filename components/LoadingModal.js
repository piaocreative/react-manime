import * as React from 'react';
import Box from './styled/Box';
import dynamic from 'next/dynamic'
const Lottie = dynamic(()=>import('react-lottie')) 

export const LoadingModal = props => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require('../static/anim_manime_apricot.json'),
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };
  return (
    <div id='loadingModal'>
      {props.isLoading && (
        <div>
          <Box
            display='flex'
            width='100%'
            height='100%'
            justifyContent='center'
            alignItems='center'
            position='fixed'
            bg='#fff'
            opacity={props.isLoading ? 1 : 0}
            zIndex={10000}
            style={{ pointerEvents: 'none' }}>
            <Box width={250} height={250}>
              <Lottie
                options={defaultOptions} />
            </Box>
          </Box>
        </div>
      )}
    </div>
  );
};
