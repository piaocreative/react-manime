import React, { memo } from 'react';
import ReactHtmlParser from 'react-html-parser';

import { ThinBannerBox, ThinTitleBox, ThinDescriptionBox } from 'components/design/Common';
import ProductItem from 'components/ProductItem';

import constants from 'constants/index';

import useCartFunctions from 'hooks/useCartFunctions';
import useCommonDispatchers from 'hooks/useComonDispatchers';
import useGetNailProducts from 'hooks/useGetNailProducts';

const isNotArchived = product => !product.isArchived;
const withTag = tag => product => !tag || product.tags.includes(tag);
const ofType = productType => product => !productType || product.productType === productType;
const isInStock = product => parseInt(product.quantity || 0) > 0;
const noAction = product => true;

// TODO: Make this display preview products

const CollectionSection = (props) => {
  const { collection, isMobileView, productType, section } = props;
  const { isLoading, error, result: products } = useGetNailProducts();
  const cartFunctions = useCartFunctions();
  const commonDispatchers = useCommonDispatchers();

  // console.log({section, products})
  const mobileBannerUrl = collection.thinHeaderImageMobile || collection.thinHeaderImageMobileUrl;
  const desktopBannerUrl = collection.thinHeaderImageDesktop || collection.thinHeaderImageDesktopUrl;

  const displayProducts = products
    .filter(isNotArchived)
    .filter(withTag(collection.shopifyCollectionTag))
    .filter(ofType(productType))
    .filter((section?.fields && section?.fields["Exclude Out of Stock"]) ? isInStock : noAction);

  return (displayProducts.length > 0) ? (
    <>
      <ThinBannerBox
        key={collection.collectionName}
        bg={collection.thinHeaderBackgroundColor}
        mobileURL={mobileBannerUrl}
        desktopURL={desktopBannerUrl}>
        <ThinTitleBox width='50%' maxWidth='180px'  style={{
          color: collection?.thinHeaderTextColor, 
          backgroundColor: collection?.thinHeaderBackgroundColor}}>
          {collection.thinHeaderTitle} <br />
          <ThinDescriptionBox  style={{
            color: collection?.thinHeaderTextColor, 
            backgroundColor: collection?.thinHeaderBackgroundColor}}>
            { ReactHtmlParser(collection.thinHeaderSubtitle) }
          </ThinDescriptionBox>
        </ThinTitleBox>
      </ThinBannerBox>
      {
        displayProducts.map((product, index) => {
        return (
          <ProductItem
            isMobileView={isMobileView}
            id={`${product.nailProductId}`}
            key={index}
            productItemData={product}
            addVariantToCart={cartFunctions.addVariantToCart}
            dispatchSetCartSideBar={commonDispatchers.dispatchSetCartSideBar}
            dispatchSetUIKeyValue={commonDispatchers.dispatchSetUIKeyValue} />
        );
      })
      }
    </>
  ) : constants.isProduction() ? null : 
    (<div style={{color:'#ddd'}}>{collection.collectionName} has no visible products</div>);
};

export default memo(CollectionSection);