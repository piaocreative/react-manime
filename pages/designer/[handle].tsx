import { builder } from '@builder.io/react';
import 'components/builder/BuilderProductItem';
import GalleryFilterBar from 'components/core/gallery/FilterBar';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import { ThinBannerBox, ThinDescriptionBox, ThinTitleBox } from 'components/design/Common';
import DesignerPhotoSection from 'components/design/designers/DesignerPhotoSection';
import SitePromotions from 'components/design/redirect-banners/SitePromotions';
import LoadingAnimation from 'components/LoadingAnimation';
import PageHead from 'components/PageHead';
import ProductItemWithImage from 'components/ProductItemWithImage';
import Box from 'components/styled/Box';
import YotpoPicturesContainer from 'components/YotpoPicturesContainer';
import useCartFunctions from 'hooks/useCartFunctions';
import useCommonDispatchers from 'hooks/useComonDispatchers';
import { BUILDER_API_KEY, getModelUrls } from 'lib/builder';
import React, { useCallback, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import log from 'utils/logging';
import ErrorPage from '../_error';

builder.init(BUILDER_API_KEY);

interface CollectionData {
  collectionBlurbText?: string;
  collectionName?: string;
  collectionSubtitle?: string;
  collectionTitle?: string;
  headerImageDesktop?: string;
  headerImageDesktopUrl?: string;
  headerImageMobile?: string;
  headerImageMobileUrl?: string;
  headerTextColor?: string;
  headerBackgroundColor?: string;
  menuLabel?: string;
  menuTag?: string;
  products?: Array<any>;
  published?: string;
  searchDescription?: string;
  searchKeywords?: string;
  searchTitle?: string;
  shopifyCollectionTag?: string;
  sortOrder?: number;
  thinHeaderBackgroundColor?: string;
  thinHeaderImageDesktop?: string;
  thinHeaderImageDesktopUrl?: string;
  thinHeaderImageMobile?: string;
  thinHeaderImageMobileUrl?: string;
  thinHeaderSubtitle?: string;
  thinHeaderTextColor?: string;
  thinHeaderTitle?: string;
  url?: string;
}

interface RenderProductsInput {
  nailProducts: any;
  collections: Array<CollectionData>;
  isMobileView: boolean;
  dispatchSetCartSideBar: any;
  dispatchSetUIKeyValue: any;
  addVariantToCart: any;
}

const productsTaggedWithAll = (products, tags) =>
  products.filter(product => tags.every(tag => product.tags.includes(tag)));

const renderProducts = (props: RenderProductsInput) => {
  const {
    nailProducts,
    collections,
    isMobileView,
    dispatchSetCartSideBar,
    dispatchSetUIKeyValue,
    addVariantToCart,
  } = props;

  const collectionProducts = collections
    ? Object.values(collections)
        .map(collection => {
          collection.products = productsTaggedWithAll(nailProducts, [
            collection?.shopifyCollectionTag,
          ]);
          return collection;
        })
        .filter(collection => collection.products.length > 0)
    : [];

  // console.log({ at: '/designer', collectionProducts });

  let jsx = [];
  // nailProducts.sort(sortByList[sortIndex].comp);

  for (const collection of collectionProducts) {
    // console.log({collection});
    jsx.push(
      <ThinBannerBox
        key={collection.collectionName}
        bg={collection.thinHeaderBackgroundColor}
        mobileURL={collection.thinHeaderImageMobile || collection.thinHeaderImageMobileUrl}
        desktopURL={collection.thinHeaderImageDesktop || collection.thinHeaderImageDesktopUrl}
      >
        <ThinTitleBox
          width="50%"
          maxWidth="180px"
          style={{
            color: collection?.thinHeaderTextColor,
            backgroundColor: collection?.thinHeaderBackgroundColor,
          }}
        >
          {collection.thinHeaderTitle} <br />
          <ThinDescriptionBox
            style={{
              color: collection?.thinHeaderTextColor,
              backgroundColor: collection?.thinHeaderBackgroundColor,
            }}
          >
            {ReactHtmlParser(collection.thinHeaderSubtitle)}
          </ThinDescriptionBox>
        </ThinTitleBox>
      </ThinBannerBox>
    );
    for (const product of collection.products) {
      jsx.push(
        <ProductItemWithImage
          isMobileView={isMobileView}
          id={product.nailProductId}
          key={`${collection.collectionName} ${product.nailProductId}`}
          productItemData={product}
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

const DesignerPage = props => {
  const { loading, globalProps, url } = props;
  const { designerData, collectionData } = globalProps;
  const designers = JSON.parse(designerData);
  const collections = JSON.parse(collectionData);
  const data: any = Object.values(designers).find((row: any) => row.url === url);
  const designerLinkImage =
    data?.externalLinkImage ||
    data?.externalLinkImageUrl ||
    data?.portraitImage ||
    data?.portraitImageUrl ||
    'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/manime.jpg';
  const cartFunctions = useCartFunctions();
  const commonDispatchers = useCommonDispatchers();
  const [nailProducts, setNailProducts] = useState<any>([]);

  const productsJsx = renderProducts({
    nailProducts,
    collections,
    addVariantToCart: cartFunctions.addVariantToCart,
    dispatchSetCartSideBar: commonDispatchers.dispatchSetCartSideBar,
    dispatchSetUIKeyValue: commonDispatchers.dispatchSetUIKeyValue,
    isMobileView: false,
  });

  const designerName = data?.siteDisplayNickname || data?.designerName || 'MISSING DESIGNER NAME';

  const productFilter = useCallback(
    product => {
      const designerTag = data?.shopifyDesignerTag;
      if (designerTag) {
        const result = product.tags.includes(designerTag);
        return result;
      } else {
        return false;
      }
    },
    [data?.shopifyDesignerTag]
  );

  // console.log({ at: 'designer/', nailProducts, collections });

  return data ? (
    <>
      <PageHead
        title={data?.searchTitle}
        description={data?.searchDescription}
        keywords={data?.keywords}
        url={url}
        image={designerLinkImage}
      />
      <GalleryFilterBar
        pageName={designerName}
        additionalFilters={productFilter}
        setProductsCallback={setNailProducts}
      />
      <DesignerPhotoSection designerData={data} />
      <Box
        width={1}
        display="flex"
        style={{ flexWrap: 'wrap' }}
        justifyContent="flex-start"
        minHeight={['unset', '600px']}
      >
        {!loading && productsJsx}
        {loading && <LoadingAnimation isLoading={loading} size={200} height="50vh" />}
      </Box>
      <SitePromotions pageInfo={{ data }} />
      {data.yotpoGalleryId && <YotpoPicturesContainer id={data.yotpoGalleryId} />}
    </>
  ) : (
    <ErrorPage url={undefined} statusCode={404} globalProps={props.globalProps} />
  );
};

const _DesignerPage = ManimeStandardContainer(DesignerPage, true);

export async function getStaticPaths() {
  const urls = await getModelUrls('designer-page', 100);
  const paths = urls?.map(url => ({ params: { handle: url.replace('/designer/', '') } }));
  // console.log(paths);
  return {
    paths: paths,
    fallback: true,
  };
}

export const getStaticProps = async props => {
  const handle = props.params.handle;
  const url = `/designer/${handle}`;

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

export default _DesignerPage;
