import React from 'react';
import Box from '../styled/Box';
import styled from "styled-components";

const BlogHeaderBox = styled(Box)`
  background-image: url('${props => props.mobileUrl}');
  background-repeat: no-repeat;
  background-position: center;
  min-height: 350px;
  margin: 20px 0 0 0;
  @media (min-width: 480px) {
    background-image: url('${props => props.desktopUrl}');
    background-position: center;
    min-height: 350px;
  }
`;

const blogImageHeader = (props) => {
  return (
    <BlogHeaderBox 
      mobileUrl={props.mobileUrl} 
      desktopUrl={props.desktopUrl} />
  )
}

export default blogImageHeader;