import { builder, BuilderComponent } from '@builder.io/react';
import GalleryFilterBar from 'components/core/gallery/FilterBar';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import { BannerCenterBox, DescriptionBox, TitleBox } from 'components/design/Common';
import MarketingFooter from 'components/design/MarketingFooter';
import DataDrivenPromotion from 'components/design/redirect-banners/DataDrivenPromotion';
import LoadingAnimation from 'components/LoadingAnimation';
import PageHead from 'components/PageHead';
import ProductItem from 'components/ProductItem';
import Box from 'components/styled/Box';
import useCartFunctions from 'hooks/useCartFunctions';
import useCommonDispatchers from 'hooks/useComonDispatchers';
import { BUILDER_API_KEY, resolveBuilderContent } from 'lib/builder';
import React, { useCallback, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';

builder.init(BUILDER_API_KEY);

const PAGE_TAG = 'sale';

const renderProducts = ({
  nailProducts,
  isMobileView,
  dispatchSetCartSideBar,
  dispatchSetUIKeyValue,
  addVariantToCart,
}) =>
  nailProducts.map(product => (
    <ProductItem
      isMobileView={isMobileView}
      id={`${product.nailProductId}`}
      key={product.nailProductId}
      productItemData={product}
      allProducts={nailProducts}
      dispatchSetUIKeyValue={dispatchSetUIKeyValue}
      dispatchSetCartSideBar={dispatchSetCartSideBar}
      addVariantToCart={addVariantToCart}
    />
  ));

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

const SalePage = (props: any) => {
  const { loading } = props;

  const [nailProducts, setNailProducts] = useState([]);

  const pageInfo = JSON.parse(props.pageInfo || null);
  const pageData = pageInfo?.data;

  const headerMobileURL = pageData?.headerImageMobile || pageData?.headerImageMobileUrl;
  const headerDesktopURL = pageData?.headerImageDesktop || pageData?.headerImageDesktopUrl;
  const headerBackgroundColor = pageData?.headerBackgroundColor;
  const showHeader = headerMobileURL || headerDesktopURL || headerBackgroundColor;

  const cartFunctions = useCartFunctions();
  const commonDispatchers = useCommonDispatchers();

  const productFilter = useCallback(product => product.tags.includes(PAGE_TAG), []);

  const promotions = [pageData?.promotion1?.value, pageData?.promotion2?.value].filter(p => p);

  const productsJsx = renderProducts({
    nailProducts,
    addVariantToCart: cartFunctions.addVariantToCart,
    dispatchSetCartSideBar: commonDispatchers.dispatchSetCartSideBar,
    dispatchSetUIKeyValue: commonDispatchers.dispatchSetUIKeyValue,
    isMobileView: false,
  });

  const promotionsJsx = renderPromoBlocks({ promotions, isMobileView: false });

  return (
    <>
      <PageHead pageInfo={pageInfo} />
      <GalleryFilterBar
        pageName="Sale"
        additionalFilters={productFilter}
        setProductsCallback={setNailProducts}
      />
      <BuilderComponent model="page" content={pageInfo} />
      {showHeader && (
        <BannerCenterBox
          bg="#d3e6eb"
          isMobileView={props.isMobileView}
          mobileURL={headerMobileURL}
          desktopURL={headerDesktopURL}
        >
          <TitleBox
            style={{
              color: pageData?.headerTextColor,
              backgroundColor: pageData?.headerBackgroundColor,
            }}
          >
            {pageData?.headerTitle}
            <DescriptionBox
              style={{
                color: pageData?.headerTextColor,
                backgroundColor: pageData?.headerBackgroundColor,
              }}
            >
              {ReactHtmlParser(pageData?.headerSubtitle)}
            </DescriptionBox>
          </TitleBox>
        </BannerCenterBox>
      )}
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
      <MarketingFooter pageInfo={pageInfo} />
    </>
  );
};

export const getStaticProps = async ({ req, res }) => {
  const pageInfo = await resolveBuilderContent('page', { urlPath: '/sale' });

  const props = await getGlobalProps({
    propsToMerge: {
      pageInfo: JSON.stringify(pageInfo || null),
    },
  });
  return props;
};

export default ManimeStandardContainer(SalePage);
