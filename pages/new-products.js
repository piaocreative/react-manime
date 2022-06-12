import { builder } from '@builder.io/react';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import GalleryHOC from 'components/GalleryHOC';
import LoadingAnimation from 'components/LoadingAnimation';
import ProductItem from 'components/ProductItem';
import ShopifyHOC from 'components/ShopifyHOC';
import StandardBuilderPage from 'components/StandardBuilderPage';
import Box from 'components/styled/Box';
import { BUILDER_API_KEY, resolveBuilderContent } from 'lib/builder';
import React, { useMemo } from 'react';
import { compareByCreatedAt, sortByList } from 'utils/galleryUtils';
import { pageLinks } from 'utils/links';

builder.init(BUILDER_API_KEY);

const NewProducts = props => {
  const { loading } = props;

  const pageInfo = JSON.parse(props.pageInfo || null);

  const productsJsx = useMemo(() => {
    let {
      tags,
      checkProductTags,
      sortIndex,
      nailProducts,
      displayProductsCount,
      setDisplayProductsCount,
      isMobileView,
      productType,
    } = props;
    let jsx = [];
    let productsCount = 0;
    nailProducts = nailProducts.filter(productInfo => productInfo.tags.includes('new'));
    if (sortIndex === 0) {
      nailProducts.sort(compareByCreatedAt);
    } else {
      nailProducts.sort(sortByList[sortIndex].comp);
    }

    for (let indexPro = 0; indexPro < nailProducts.length; indexPro++) {
      const productInfo = nailProducts[indexPro];
      const matchTags = tags.length === 0 || checkProductTags(productInfo.tags);
      const isShowing = matchTags && (!productType || productType === productInfo.productType);
      if (productInfo.images[0]) {
        if (isShowing) {
          productsCount++;
          jsx.push(
            <ProductItem
              isMobileView={isMobileView}
              id={`${productInfo.nailProductId}`}
              key={indexPro}
              productItemData={productInfo}
              allProducts={nailProducts}
              addVariantToCart={props.addVariantToCart}
              dispatchSetCartSideBar={props.dispatchSetCartSideBar}
              dispatchSetUIKeyValue={props.dispatchSetUIKeyValue}
            />
          );
        }
      }
    }

    if (displayProductsCount !== productsCount) setDisplayProductsCount(productsCount);
    return <>{jsx}</>;
  }, [
    props.tags,
    props.checkProductTags,
    props.sortIndex,
    props.nailProducts,
    props.isMobileView,
    props.productType,
  ]);

  return (
    <StandardBuilderPage pageInfo={pageInfo}>
      {loading ? (
        <LoadingAnimation isLoading={loading} size={200} height="50vh" />
      ) : (
        <>
          <Box
            width={1}
            display="flex"
            style={{ flexWrap: 'wrap' }}
            justifyContent="flex-start"
            minHeight={['unset', '600px']}
          >
            {productsJsx}
          </Box>
        </>
      )}
    </StandardBuilderPage>
  );
};

export const getStaticProps = async ({ res, req }) => {
  const url = pageLinks.NewProduct.url;
  const pageInfo = await resolveBuilderContent('page', { urlPath: url });

  const props = await getGlobalProps({
    propsToMerge: {
      pageInfo: JSON.stringify(pageInfo || null),
    },
  });
  return props;
};

export default ManimeStandardContainer(ShopifyHOC(GalleryHOC(NewProducts, "What's New")));
