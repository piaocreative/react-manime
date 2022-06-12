import React, { memo } from 'react';
import { XOCapsuleThinHeader } from '../design/Common';
import ProductItem from '../ProductItem';

const XOCapsuleSection = (props) => {
  const { isMobileView, addVariantToCart, dispatchSetCartSideBar, dispatchSetUIKeyValue, isGroupGift } = props;
  let { nailProducts } = props;
  nailProducts = nailProducts.filter(product => (product.tags.includes('vday21')));

  return (
    <>
      <XOCapsuleThinHeader
        title='XO Capsule'
        description="Love comes in mani forms." />
      {nailProducts.map((product, index) => {
        return (
          <ProductItem
            isMobileView={isMobileView}
            id={`${product.nailProductId}`}
            key={index}
            isGroupGift={isGroupGift}
            productItemData={product}
            addVariantToCart={addVariantToCart}
            dispatchSetCartSideBar={dispatchSetCartSideBar}
            dispatchSetUIKeyValue={dispatchSetUIKeyValue} />
        );
      })
      }
    </>
  );
};

export default memo(XOCapsuleSection);