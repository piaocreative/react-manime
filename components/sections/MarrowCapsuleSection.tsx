import React, { memo } from 'react';
import { MarrowCapsuleThinHeader } from '../design/Common';
import ProductItem from '../ProductItem';

const MarrowCapsuleSection = (props) => {
  const { isMobileView, addVariantToCart, dispatchSetCartSideBar, dispatchSetUIKeyValue } = props;
  let { nailProducts } = props;
  nailProducts = nailProducts.filter(product => (product.tags.includes('marrow-capsule')));

  return (
    <>
      <MarrowCapsuleThinHeader />
      {nailProducts.map((product, index) => {
        return (
          <ProductItem
            isMobileView={isMobileView}
            id={`${product.nailProductId}`}
            key={index}
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

export default memo(MarrowCapsuleSection);