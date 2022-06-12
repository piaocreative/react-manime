import { builder } from '@builder.io/react';
import 'components/builder/BuilderProductItem';
import GalleryFilterBar from 'components/core/gallery/FilterBar';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import { BannerCenterBox, DescriptionBox, TitleBox } from 'components/design/Common';
import DataDrivenPromotion from 'components/design/redirect-banners/DataDrivenPromotion';
import LoadingAnimation from 'components/LoadingAnimation';
import ProductItem from 'components/ProductItem';
import Box from 'components/styled/Box';
import useCartFunctions from 'hooks/useCartFunctions';
import useCommonDispatchers from 'hooks/useComonDispatchers';
import { BUILDER_API_KEY } from 'lib/builder';
import Head from 'next/head';
import React, { useCallback, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import log from 'utils/logging';
import ErrorPage from '../_error';

builder.init(BUILDER_API_KEY);

const renderProducts = ({
  nailProducts,
  isMobileView,
  dispatchSetCartSideBar,
  dispatchSetUIKeyValue,
  addVariantToCart,
}) => {
  let jsx = [];

  for (let indexPro = 0; indexPro < nailProducts.length; indexPro++) {
    const productInfo = nailProducts[indexPro];
    // console.log({productInfo});
    const isShowing = true;
    if (isShowing) {
      jsx.push(
        <ProductItem
          isMobileView={isMobileView}
          id={`${productInfo.nailProductId}`}
          key={indexPro}
          productItemData={productInfo}
          allProducts={nailProducts}
          dispatchSetUIKeyValue={dispatchSetUIKeyValue}
          dispatchSetCartSideBar={dispatchSetCartSideBar}
          addVariantToCart={addVariantToCart}
        />
      );
    }
  }
  return jsx;
};

const renderPromoBlocks = (props: any) => {
  const promotions = props.promotions.filter(promotion => promotion);
  // console.log({at: 'renderPromoBlocks', promotions});
  const jsx = promotions.map(
    promotion =>
      promotion && (
        <DataDrivenPromotion key={`promotion-block-${promotion.id}`} promotion={promotion.data} />
      )
  );

  return jsx;
};

const CollectionPage = props => {
  const { loading, handle, url } = props;
  const collections = JSON.parse(props.globalProps.collectionData);
  const data: any = Object.values(collections).find((row: any) => row.url === url);
  const [nailProducts, setNailProducts] = useState([]);

  const collectionLinkImage =
    data?.externalLinkImage ||
    data?.externalLinkImageUrl ||
    'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/manime.jpg';

  const cartFunctions = useCartFunctions();
  const commonDispatchers = useCommonDispatchers();

  const productsJsx = renderProducts({
    nailProducts,
    addVariantToCart: cartFunctions.addVariantToCart,
    dispatchSetCartSideBar: commonDispatchers.dispatchSetCartSideBar,
    dispatchSetUIKeyValue: commonDispatchers.dispatchSetUIKeyValue,
    isMobileView: false,
  });
  const promotions = [data?.promotion1?.value, data?.promotion2?.value].filter(p => p);
  const promotionsJsx = renderPromoBlocks({ promotions, isMobileView: false });

  const productFilter = useCallback(
    product => {
      const collection = data?.shopifyCollectionTag;
      if (collection) return product.tags.includes(collection);
      else return false;
    },
    [data?.shopifyCollectionTag]
  );

  return data && nailProducts ? (
    <>
      <Head>
        <title>{data?.searchTitle || 'ManiMe'}</title>
        <meta name="description" content={data?.searchDescription || 'ManiMe'}></meta>
        <meta name="keywords" content={data?.keywords || ''}></meta>
        <link rel="canonical" href={`https://manime.co${url}`} />
        <meta name="og:image" content={collectionLinkImage}></meta>
        <meta name="twitter:image" content={collectionLinkImage}></meta>
      </Head>
      <GalleryFilterBar
        pageName={data?.collectionName}
        additionalFilters={productFilter}
        setProductsCallback={setNailProducts}
      />
      <BannerCenterBox
        bg="#d3e6eb"
        isMobileView={props.isMobileView}
        mobileURL={data?.headerImageMobile || data?.headerImageMobileUrl}
        desktopURL={data?.headerImageDesktop || data?.headerImageDesktopUrl}
      >
        <TitleBox
          style={{ color: data?.headerTextColor, backgroundColor: data?.headerBackgroundColor }}
        >
          {data?.collectionTitle}
          <DescriptionBox
            style={{ color: data?.headerTextColor, backgroundColor: data?.headerBackgroundColor }}
          >
            {ReactHtmlParser(data?.collectionSubtitle)}
          </DescriptionBox>
        </TitleBox>
      </BannerCenterBox>
      <Box
        width={1}
        display="flex"
        style={{ flexWrap: 'wrap' }}
        justifyContent="flex-start"
        minHeight={['unset', '600px']}
      >
        {!loading && productsJsx}
        {loading && <LoadingAnimation isLoading={loading} size={200} height="50vh" />}
        {promotions.length > 0 && (
          <Box width={1} display="flex" style={{ flexWrap: 'wrap' }} justifyContent="flex-start">
            {promotionsJsx}
          </Box>
        )}
      </Box>
    </>
  ) : (
    <ErrorPage url={undefined} statusCode={404} globalProps={props.globalProps} />
  );
};
const _CollectionPage = ManimeStandardContainer(CollectionPage, true);

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps = async props => {
  const handle = props.params.handle;
  const url = `/collection/${handle}`;

  try {
    const globalProps = await getGlobalProps({ propsToMerge: { url, handle } });
    return globalProps;
  } catch (err) {
    log.error('[collection generic page]', err);
    return {
      notFound: true,
    };
  }
};

export default _CollectionPage;
