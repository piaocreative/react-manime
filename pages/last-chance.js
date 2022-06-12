import { builder } from '@builder.io/react';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import ClassicsAlways from 'components/design/redirect-banners/ClassicsAlways';
import EveryOccasionWithAction from 'components/design/redirect-banners/EveryOccasionWithAction';
import GalleryHOC from 'components/GalleryHOC';
import LoadingAnimation from 'components/LoadingAnimation';
import ProductItem from 'components/ProductItem';
import ShopifyHOC from 'components/ShopifyHOC';
import StandardBuilderPage from 'components/StandardBuilderPage';
import Box from 'components/styled/Box';
import { BUILDER_API_KEY, resolveBuilderContent } from 'lib/builder';
import React, { useCallback, useMemo } from 'react';
import { sortByList } from 'utils/galleryUtils';
import { pageLinks } from 'utils/links';

builder.init(BUILDER_API_KEY);

const LastChance = props => {
  const { loading, isMobileView } = props;
  const pageInfo = JSON.parse(props.pageInfo || null);

  const renderProducts = useCallback(
    productType => {
      const {
        tags,
        checkProductTags,
        sortIndex,
        displayProductsCount,
        setDisplayProductsCount,
        isMobileView,
      } = props;
      let { nailProducts } = props;
      let jsx = [];
      let productsCount = 0;
      let nailProductList = nailProducts.filter(
        item => item.images && item.images[0] && item.tags.includes('last chance')
      );
      nailProductList.sort(sortByList[sortIndex].comp);

      for (let indexPro = 0; indexPro < nailProductList.length; indexPro++) {
        const productInfo = nailProductList[indexPro];
        const isShowing = tags.length === 0 || checkProductTags(productInfo.tags);
        if (productInfo.images[0]) {
          if (isShowing && (!productType || productInfo.productType === productType)) {
            productsCount++;
            jsx.push(
              <ProductItem
                isMobileView={isMobileView}
                id={`${productInfo.nailProductId}`}
                key={indexPro}
                productItemData={productInfo}
                allProducts={nailProductList}
                {...props}
              />
            );
          }
        }
      }

      if (displayProductsCount !== productsCount) setDisplayProductsCount(productsCount);
      return <>{jsx}</>;
    },
    [props.tags, props.checkProductTags, props.sortIndex, props.nailProducts, props.isMobileView]
  );

  const productsJsx = useMemo(
    () => renderProducts(),
    [props.tags, props.sortIndex, props.nailProducts, props.isMobileView]
  );

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

export const getStaticProps = async ({ req, res }) => {
  const url = pageLinks.ShopLastChance.url;
  const pageInfo = await resolveBuilderContent('page', { urlPath: url });

  const props = await getGlobalProps({
    propsToMerge: {
      pageInfo: JSON.stringify(pageInfo || null),
      url,
    },
  });
  return props;
};

export default ManimeStandardContainer(ShopifyHOC(GalleryHOC(LastChance, 'Last Chance')));
