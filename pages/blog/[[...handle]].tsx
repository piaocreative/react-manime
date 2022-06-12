import { builder, BuilderComponent } from '@builder.io/react';
import BlogArticleHeader from 'components/blog/BlogArticleHeader';
import 'components/builder/BuilderProductItem';
import 'components/builder/BuilderProductItemById';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import Box from 'components/styled/Box';
import Head from 'next/head';
import { ErrorPage } from 'pages/_error';
import log from 'utils/logging';
import { BUILDER_API_KEY } from '../../lib/builder';

builder.init(BUILDER_API_KEY);

// const BlogFooterProductHeaderBox = styled(Box)`
//   font-family: 'avenirHeavy';
//   font-weight: bold;
//   letter-spacing: 4px;
//   text-transform: uppercase;
//   text-align: center;
// `;

function Blog(props) {
  const { builderPage, builderContent, headerRibbon, asPath } = props;
  const pageData =
    builderContent && builderContent.results.length > 0 ? builderContent.results[0].data : {};
  // log.info({"builderPage.data.searchKeywords":builderPage.data.searchKeywords})
  // const keywords = builderPage?.data?.searchKeywords ? builderPage?.data?.searchKeywords.map(o => o.keyword).join(",") : null
  log.info('builderContet is ', { builderContent });
  return (
    <>
      {builderContent && builderContent.results.length > 0 ? (
        <>
          <Head>
            <title>{pageData.searchTitle}</title>
            <meta name="description" content={pageData.searchDescription}></meta>
            <meta name="keywords" content={pageData.searchKeywords}></meta>
            <link rel="canonical" href={`https://manime.co${asPath}`} />
          </Head>
          {props.isBase ? (
            <BuilderComponent model="page" content={builderPage} />
          ) : (
            <>
              <Box maxWidth="990px" mx="auto">
                <BuilderComponent model="header-ribbon" content={headerRibbon} />
                <BlogArticleHeader pageData={pageData} />
                <BuilderComponent model="blog-article" content={builderPage} />
                {/* <BlogFooterProductHeaderBox><h2><strong>{pageData.footerProductHeader}</strong></h2></BlogFooterProductHeaderBox> */}
              </Box>
            </>
          )}
        </>
      ) : (
        <ErrorPage statusCode={404} globalProps={props.globalProps} />
      )}
    </>
  );
}

const _Blog = ManimeStandardContainer(Blog);
export default _Blog;

_Blog['getInitialProps'] = async context => {
  // console.log('process env host is ' + process.env.APP_URL);
  const { res, req, asPath, query } = context;

  let host = req?.headers.host;

  let prod =
    process.env.APP_URL.includes('/manime.co') || process.env.APP_URL.includes('www.manime.co');

  let cacheBuster = !prod ? '&cacheSeconds=0' : '';
  const isBase = !query?.handle;
  let builderUrl = `https://cdn.builder.io/api/v2/content/page?apiKey=${BUILDER_API_KEY}&userAttributes.urlPath=${encodeURIComponent(
    '/blog'
  )}&limit=1&includeRefs=true&includeUnpublished=${!prod}${cacheBuster}`;
  if (!isBase) {
    builderUrl = `https://cdn.builder.io/api/v2/content/blog-article?apiKey=${BUILDER_API_KEY}&query.data.link=${encodeURIComponent(
      asPath
    )}&limit=1&includeRefs=true&includeUnpublished=${!prod}${cacheBuster}`;
    // console.log(' query handle');
  }
  // console.log("calling ", {builderUrl})
  const builderRes = await fetch(builderUrl);
  const pageJson = await builderRes.json();
  // log.info({builderUrl, pageJson})

  // If there is a Builder page for this URL, this will be an object, otherwise it'll be null
  const page = await builder
    .get(isBase ? 'page' : 'blog-article', {
      req,
      res,
      url: asPath,
      userAttributes: { host },
    })
    .promise();
  const header = await builder
    .get('header-ribbon', {
      req,
      res,
      url: asPath,
      userAttributes: { host },
    })
    .promise();
  log.info({ page, pageJson, header });
  const { props: globalProps } = await getGlobalProps({
    propsToMerge: {
      builderPage: page,
      builderContent: pageJson,
      headerRibbon: header,
      isBase: !query?.handle,
      asPath,
    },
  });
  return globalProps;
};
