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

  & > video {
    position: absolute;
    top: 10px;
    left: 12px;
    right: 12px;
    border: 10px;
    width: calc(100% - 24px);
    height: calc(100% - 55px);
    object-fit: cover;
    background-color: ${props => props.backgroundColor || '#c2bbe7'};
  }
`;

const VideoBannerPanel = ({ isMobileView, video }) => {
  return (
    <Container backgroundColor={video?.backgroundColor}>
      {isMobileView ? 
        <video width="100%" height="100%" autoPlay loop muted playsInline>
          <source src={video?.mobileUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>:
        <video width="100%" height="100%" autoPlay loop muted playsInline>
          <source src={video?.desktopUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>        
      }
    </Container>
  );
}

export default VideoBannerPanel;