import Box from '../../components/styled/Box';
import styled from "styled-components";
import BlogMasthead from './BlogMasthead';
import BlogImageHeader from './BlogImageHeader';
import BlogCategories from './BlogCategories';
// import log from '../../utils/logging';

const BlogTitleBox = styled(Box)`
  font-family: gentiumBasic;
  font-size: 50px;
  font-style: italic;
  color: #2C4349;
  & p {
    font-family: gentiumBasic;
    margin-block-start: 0;
    margin-block-end: 0;
  }
`;

const BlogSubtitleBox = styled(Box)`
  font-size: 20px;
  & p {
    margin-block-start: 0;
    margin-block-end: 0;
  }
`;

const BlogBylineBox = styled(Box)`
  font-size: 13px;
  margin: 0.5em 0;
`;

const BlogDatelineBox = styled(Box)`
  font-size: 13px;
`;


const blogArticleHeader = (props) => {
  const {pageData} = props;
  // console.log("blogArticleHeader",{pageData})

  return (
    <>
      <BlogMasthead />
      <BlogImageHeader 
        mobileUrl={pageData.headerImageUrlMobile || pageData.headerImageMobile} 
        desktopUrl={pageData.headerImageUrlDesktop || pageData.headerImageDesktop} />
      <Box style={{
        display: "flex",
        flexDirection: "row"
      }}>
        <BlogCategories categories={pageData.categories}/>
        <Box style={{
          display: "flex",
          flexDirection: "column",
          width: "auto"
        }}></Box>
      </Box>
      <BlogTitleBox dangerouslySetInnerHTML={{__html: pageData.title}}></BlogTitleBox>
      <BlogSubtitleBox dangerouslySetInnerHTML={{__html: pageData.subtitle}}></BlogSubtitleBox>
      <BlogBylineBox><strong>By:</strong> {pageData.author?.value.data.fullName}</BlogBylineBox>
      <BlogDatelineBox>{pageData.publishDate ? pageData.publishDate.slice(4,15) : null}</BlogDatelineBox>
    </>
  )
}

export default blogArticleHeader;