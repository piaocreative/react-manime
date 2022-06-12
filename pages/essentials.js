import { builder } from '@builder.io/react';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import GalleryHOC from 'components/GalleryHOC';
import LoadingAnimation from 'components/LoadingAnimation';
import ProductItem from 'components/ProductItem';
import ShopifyHOC from 'components/ShopifyHOC';
import StandardBuilderPage from 'components/StandardBuilderPage';
import Box from 'components/styled/Box';
import { BUILDER_API_KEY, resolveBuilderContent } from 'lib/builder';
import Link from 'next/link';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { sortByList } from 'utils/galleryUtils';
import { pageLinks } from 'utils/links';

builder.init(BUILDER_API_KEY);

const isType = productType => product => product?.productType === productType;

const Container = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  width: 100%;
`;

const ProductList = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  place-items: center;
  width: 100%;
  margin: 60px 0 40px;
  padding: 0 24px;

  & > a {
    text-align: center;
  }

  & > a > div {
    font-size: 12px;
    margin-top: 12px;
    max-width: 80px;
  }

  & > a > img {
    min-width: 21px;
    min-height: 92px;
    max-height: 107px;
    object-fit: contain;
  }

  @media (min-width: 1024px) {
    margin: 80px 0 40px;
    padding: 0 calc(50% - 512px);

    grid-template-columns: repeat(7, 1fr);

    & > a > div {
      font-size: 14px;
      max-width: 94px;
    }

    & > a > img {
      min-width: 26px;
      min-height: 76px;
      max-height: 84px;
    }
  }
`;

const productType = 'Essentials';

const ShopEssentials = props => {
  const {
    loading,
    tags,
    checkProductTags,
    sortIndex,
    displayProductsCount,
    setDisplayProductsCount,
    isMobileView,
    addVariantToCart,
    dispatchSetCartSideBar,
    dispatchSetUIKeyValue,
  } = props;

  const { nailProducts = [] } = props;

  const productFilter = useCallback(isType(productType), [productType]);

  const displayProducts = nailProducts.filter(isType(productType)).sort(sortByList[sortIndex].comp);

  setDisplayProductsCount(displayProducts.length);

  // console.log({ nailProducts, displayProducts });

  const pageInfo = JSON.parse(props.pageInfo || null);

  return (
    <StandardBuilderPage pageInfo={pageInfo}>
      {loading ? (
        <LoadingAnimation isLoading={loading} size={200} height="50vh" />
      ) : (
        <Container minHeight={['unset', '600px']}>
          <ProductList key={'ProductList'}>
            {displayProducts.map(product =>
              product.shopifyHandle.indexOf('bundle') !== -1 ? null : (
                <Link
                  href={'/product/[handle]'}
                  as={`${pageLinks.ProductDetail.url}${product.shopifyHandle}?productId=${product.nailProductId}&from=${pageLinks.ShopEssentials.url}`}
                  key={product.nailProductId}
                >
                  <a>
                    <img src={product?.extraFields?.productImage} alt={product.name} />
                    <Box>{product.name}</Box>
                  </a>
                </Link>
              )
            )}
          </ProductList>
          {displayProducts.map((product, index) => (
            <ProductItem
              isMobileView={isMobileView}
              id={`${product.nailProductId}`}
              key={index}
              productItemData={product}
              addVariantToCart={addVariantToCart}
              dispatchSetCartSideBar={dispatchSetCartSideBar}
              dispatchSetUIKeyValue={dispatchSetUIKeyValue}
            />
          ))}
        </Container>
      )}
    </StandardBuilderPage>
  );
};

export const getStaticProps = async ({ req, res }) => {
  const url = pageLinks.ShopEssentials.url;
  const pageInfo = await resolveBuilderContent('page', { urlPath: url });

  const props = await getGlobalProps({
    propsToMerge: {
      pageInfo: JSON.stringify(pageInfo || null),
    },
  });
  return props;
};

export default ManimeStandardContainer(ShopifyHOC(GalleryHOC(ShopEssentials, productType)));
