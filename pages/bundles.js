import { builder } from '@builder.io/react';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import BundlePanel from 'components/design/BundlePanel_V2';
import GalleryHOC from 'components/GalleryHOC';
import LoadingAnimation from 'components/LoadingAnimation';
import ProductItem from 'components/ProductItem';
import ShopifyHOC from 'components/ShopifyHOC';
import StandardBuilderPage from 'components/StandardBuilderPage';
import Box from 'components/styled/Box';
import {
  anniversaryBundleId,
  nnnBundleId,
  roseOmbreProductId,
  signatureBundleId,
  visibleBundlesOnGallery,
} from 'config/config-local';
import { BUILDER_API_KEY, resolveBuilderContent } from 'lib/builder';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { sortByList } from 'utils/galleryUtils';
import { pageLinks } from 'utils/links';
import { hasAnImage, hasTag, isNotArchived } from 'utils/galleryUtils';

builder.init(BUILDER_API_KEY);

const Container = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
`;

const Bundles = props => {
  const { isLoading, url, globalProps } = props;
  const pageInfo = JSON.parse(props?.pageInfo || {});

  const productsJsx = useMemo(() => {
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
    let displayProducts = nailProducts
      .filter(hasAnImage)
      .filter(hasTag('ManiMe Bundle'))
      .filter(isNotArchived)
      .sort(sortByList[sortIndex].comp);

    const isDefaultView = tags.length === 0 && sortIndex === 0;
    if (isDefaultView) {
      // jsx.push(
      //   <AnniversaryBundle
      //     key='AnniversaryBundle'
      //     isMobileView={isMobileView}
      //     nailProducts={props.nailProducts}
      //     addVariantToCart={props.addVariantToCart}
      //     dispatchSetCartSideBar={props.dispatchSetCartSideBar}
      //     dispatchSetUIKeyValue={props.dispatchSetUIKeyValue} />
      // );
      jsx.push(<BundlePanel id="#bundles" key="BundlePanel" {...props} />);
    }
    for (let indexPro = 0; indexPro < displayProducts.length; indexPro++) {
      const productInfo = displayProducts[indexPro];
      const isShowing =
        (isDefaultView &&
          ![nnnBundleId, roseOmbreProductId, anniversaryBundleId, signatureBundleId].includes(
            productInfo.nailProductId
          )) ||
        (!isDefaultView && checkProductTags(productInfo.tags));
      if (productInfo.images[0]) {
        if (isShowing) {
          productsCount++;
          jsx.push(
            <ProductItem
              isMobileView={isMobileView}
              id={`${productInfo.nailProductId}`}
              key={indexPro}
              productItemData={productInfo}
              {...props}
            />
          );
        }
      }
    }

    if (tags.length === 0 && sortIndex === 0) {
      if (displayProductsCount !== productsCount + visibleBundlesOnGallery) {
        setDisplayProductsCount(productsCount + visibleBundlesOnGallery);
      }
    } else {
      if (displayProductsCount !== productsCount) {
        setDisplayProductsCount(productsCount);
      }
    }
    return <Container>{jsx}</Container>;
  }, [props.tags, props.checkProductTags, props.sortIndex, props.nailProducts, props.isMobileView]);

  return (
    <StandardBuilderPage pageInfo={pageInfo}>
      {isLoading ? (
        <LoadingAnimation isLoading={isLoading} size={200} height="50vh" />
      ) : (
        <>{productsJsx}</>
      )}
    </StandardBuilderPage>
  );
};

export const getStaticProps = async ({ req, res }) => {
  const url = pageLinks.ShopBundles.url;
  const pageInfo = await resolveBuilderContent('page', { urlPath: url });

  const props = await getGlobalProps({
    propsToMerge: {
      pageInfo: JSON.stringify(pageInfo || null),
      url,
    },
  });
  return props;
};

export default ManimeStandardContainer(ShopifyHOC(GalleryHOC(Bundles, 'Bundles')));
