import React from 'react';
import Box from '../styled/Box';
import Link from 'next/link';
import styled from 'styled-components';
import { pageLinks } from '../../utils/links';

const BlogMastheadBox = styled(Box)`
  background: linear-gradient(to bottom, white 50%, #f4f1ea 0%);
  height: 50px;
`;

const BlogMastheadText = styled(Box)`
  text-align: center;
  & a {
    font-family: GentiumBasic;
    font-size: 32px;
    font-weight: 400
    letter-spacing: 2px;
  }
`;

const blogMasthead = (props) => {
  return (
    <BlogMastheadBox>
      <BlogMastheadText><Link href={pageLinks.Blog.url}><a>The Top Coat</a></Link></BlogMastheadText>
    </BlogMastheadBox>
  )
}

export default blogMasthead;