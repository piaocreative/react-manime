import React, { memo } from 'react';
import { ButterflyThinHeader } from '../design/Common';
import ProductItem from '../ProductItem';

const InTheAirSection = (props) => {
  const { isMobileView, addVariantToCart, dispatchSetCartSideBar, dispatchSetUIKeyValue, isGroupGift } = props;
  let { nailProducts } = props;
  nailProducts = nailProducts.filter(product => (!product.isArchived && product.tags.includes('intheair')));

  return (
    <>
      <ButterflyThinHeader
        title='In the air'
        description='Light, airy and fresh.' />
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

export default memo(InTheAirSection);