import Head from 'next/head';

const PageHead = props => {
  const defaultImage =
    'https://cdn.shopify.com/s/files/1/0253/6561/0605/products/070_a.jpg?v=1592330523';
  const {
    pageInfo,
    title = 'ManiMe',
    description = 'MISSING DESCRIPTION',
    keywords = 'MISSING KEYWORDS',
    url,
    image = defaultImage,
  } = props;

  const pageData = pageInfo?.data;

  return (
    <Head>
      <title>{pageData?.title || title}</title>
      <meta name="description" content={pageData?.description || description} />
      <meta name="keywords" content={pageData?.keywords || keywords} />
      <meta
        name="og:image"
        content={pageData?.pageLinkImage || pageData?.pageLinkImageUrl || image || defaultImage}
      />
      <meta
        name="twitter:image"
        content={pageData?.pageLinkImage || pageData?.pageLinkImageUrl || image || defaultImage}
      />
      <link rel="canonical" href={`https://manime.co${pageData?.url || url || ''}`} />
    </Head>
  );
};

export default PageHead;
