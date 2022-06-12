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

const TaggedProductsSection = props => {
  const { isMobileView, productType, section } = props;
  const { isLoading, error, result: products } = useGetNailProducts();
  const cartFunctions = useCartFunctions();
  const commonDispatchers = useCommonDispatchers();

  const mobileBannerUrl = section?.fields['Section Header Mobile Image URL'];
  const desktopBannerUrl = section?.fields['Section Header Desktop Image URL'];

  const displayProducts = products
    .filter(isNotArchived)
    .filter(withTag(section?.fields['Shopify Tag']))
    .filter(ofType(productType))
    .filter(section?.fields['Exclude Out of Stock'] ? isInStock : noAction);

  // console.log({section, products, displayProducts})

  return displayProducts.length > 0 ? (
    <>
      {(mobileBannerUrl || desktopBannerUrl || section?.fields['Section Title']) && (
        <ThinBannerBox
          key={section?.fields['Section Name']}
          backgroundColor={section?.fields['Section Header Color']}
          mobileURL={mobileBannerUrl}
          desktopURL={desktopBannerUrl}
        >
          <ThinTitleBox
            width="50%"
            maxWidth="180px"
            style={{
              color: section?.fields['Section Header Text Color'],
              backgroundColor: section?.fields['Section Header Color'],
            }}
          >
            {section?.fields['Section Title']} <br />
            <ThinDescriptionBox
              style={{
                color: section?.fields['Section Header Text Color'],
                backgroundColor: section?.fields['Section Header Color'],
              }}
            >
              {ReactHtmlParser(section?.fields['Section Subtitle'])}
            </ThinDescriptionBox>
          </ThinTitleBox>
        </ThinBannerBox>
      )}
      {displayProducts.map((product, index) => {
        return (
          <ProductItem
            isMobileView={isMobileView}
            id={`${product.nailProductId}`}
            key={index}
            productItemData={product}
            addVariantToCart={cartFunctions.addVariantToCart}
            dispatchSetCartSideBar={commonDispatchers.dispatchSetCartSideBar}
            dispatchSetUIKeyValue={commonDispatchers.dispatchSetUIKeyValue}
          />
        );
      })}
    </>
  ) : constants.isProduction() ? null : (
    <div
      style={{
        color: '#007',
        width: '100%',
        border: '1px dotted #007',
        backgroundColor: '#eef',
        padding: '1em',
        margin: '0.5em 0',
      }}
    >
      {section?.fields['Section Name']} has no visible products
    </div>
  );
};

export default memo(TaggedProductsSection);
