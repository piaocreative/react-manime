import React from 'react';
import Box from '../styled/Box';
import styled from "styled-components";
import Link from 'next/link';

const BlogCategoryBox = styled(Box)`
  text-transform: uppercase;
  font-size: 12px;
  padding: 8px 10px;
  margin: 0 15px 0 0;
  color: ${props => props.color};
  background-color: ${props => props.backgroundColor};
  display: flex;
  flex-direction: column;
  @media (min-width: 480px) {
    font-size: 14px;
    padding: 12px 15px;
  }
`;

const blogCategoryBox = (props) => {
  const categoriesPlaceholder = (props.categories || []).map(row => row.category?.value.data.name).join(", ")

  const categoryTags = (props.categories || []).map(row => (
    <BlogCategoryBox 
      key={row.category.id}
      color={row.category.value.data.color}
      backgroundColor={row.category.value.data.backgroundColor}>
      <Link href={row.category.value.data.link}><a>{row.category.value.data.name}</a></Link>
    </BlogCategoryBox>
    )
  )

  return (
    <Box style={{
      display: "flex",
      margin: "10px 0"
    }}>
    {categoryTags}
    </Box>
  )
}

export default blogCategoryBox;