import { builder } from '@builder.io/react';
import { getArchiveProducts } from 'api/product';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import GalleryHOC from 'components/GalleryHOC';
import LoadingAnimation from 'components/LoadingAnimation';
import ArchiveProductItem from 'components/product-item/ArchiveProductItem';
import ShopifyHOC from 'components/ShopifyHOC';
import StandardBuilderPage from 'components/StandardBuilderPage';
import Box from 'components/styled/Box';
import { BUILDER_API_KEY, resolveBuilderContent } from 'lib/builder';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { compareByReleaseDate, sortByList } from 'utils/galleryUtils';
import { pageLinks } from 'utils/links';

builder.init(BUILDER_API_KEY);

const ContainerBox = styled(Box)`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 28px 20px;
  padding: 0 12px;
  margin: 48px 0;
  grid-auto-rows: 1fr;
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 30px 60px;
    min-width: 600px;
    max-width: 1300px;
    margin: 80px auto;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (min-width: 1600px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const ShopArchive = props => {
  const { url, globalProps } = props;
  const pageInfo = JSON.parse(props?.pageInfo || {});

  const [isLoading, setIsLoading] = useState(true);

  const [archivedProducts, setArchivedProducts] = useState(null);

  const init = async () => {
    try {
      //TODO: Make this page production aware
      let products = await getArchiveProducts();
      products = products.map((prod, index) => ({ ...prod, originIndex: index }));
      setArchivedProducts(products);
    } catch (err) {
      setArchivedProducts([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  const productsJsx = useMemo(
    productType => {
      const { tags, checkProductTags, sortIndex, displayProductsCount, setDisplayProductsCount } =
        props;
      let jsx = [];
      let productsCount = 0;

      let nailProductList = archivedProducts || [];
      if (sortIndex === 0) {
        nailProductList.sort(compareByReleaseDate);
      } else nailProductList.sort(sortByList[sortIndex].comp);

      for (let indexPro = 0; indexPro < nailProductList.length; indexPro++) {
        const productInfo = nailProductList[indexPro];
        const isShowing = tags.length === 0 || checkProductTags(productInfo.tags);
        if (productInfo.archivedImageUrl) {
          if (isShowing && (!productType || productInfo.productType === productType)) {
            productsCount++;
            jsx.push(
              <ArchiveProductItem
                id={`${productInfo.nailProductId}`}
                key={indexPro}
                productItemData={productInfo}
              />
            );
          }
        }
      }

      if (displayProductsCount !== productsCount) setDisplayProductsCount(productsCount);
      return <>{jsx}</>;
    },
    [props.tags, props.checkProductTags, props.sortIndex, archivedProducts]
  );

  return (
    <StandardBuilderPage pageInfo={pageInfo}>
      {isLoading ? (
        <LoadingAnimation isLoading={isLoading} size={200} height="50vh" />
      ) : (
        <ContainerBox>{productsJsx}</ContainerBox>
      )}
    </StandardBuilderPage>
  );
};

export const getStaticProps = async ({ req, res }) => {
  const url = pageLinks.ShopArchive.url;
  const pageInfo = await resolveBuilderContent('page', { urlPath: url });

  const props = await getGlobalProps({
    propsToMerge: {
      pageInfo: JSON.stringify(pageInfo || null),
      url,
    },
  });
  return props;
};

export default ManimeStandardContainer(ShopifyHOC(GalleryHOC(ShopArchive, 'ARCHIVE')));
