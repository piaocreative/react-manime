import React, { useState, useEffect } from 'react';
import Box from './styled/Box';
import dynamic from 'next/dynamic'
const Lottie = dynamic(()=>import('react-lottie')) 

// import { track } from '../utils/track';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: require('../static/anim_manime_apricot.json'),
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

const LoadingAnimation = props => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props.isLoading == true) {
      setIsLoading(true);
      // track(`set loading animation true`);
      // mixpanel.track(`set loading animation true`);
    } else {
      // track(`set timeout 1000 then set animation false`);
      // mixpanel.track(`set timeout 1000 then set animation false`);
      setTimeout(() => {
        setIsLoading(false);
        // track(`set loading animation false`);
        // mixpanel.track(`set loading animation false`);
      }, 1000);
    }
  }, [props.isLoading]);

  const size = props.size || 100;
  const height = props.height || '100%';
  const background = props.background || '#fff';

  return (
    <Box
      display='flex'
      width='100%'
      height={height}
      justifyContent='center'
      alignItems='center'
      bg={background}
      opacity={isLoading ? 1 : 0}
      style={{ pointerEvents: 'none' }}>
      <Box width={size} height={size}>
        <Lottie
          options={defaultOptions} />
      </Box>
    </Box>
  );
}

export default LoadingAnimation;