import React, { memo } from 'react';
import { PrideCapsuleThinHeader } from 'components/design/Common';
import ProductItem from 'components/ProductItem';

const PrideCapsuleSection = (props) => {
  const { isMobileView, addVariantToCart, dispatchSetCartSideBar, dispatchSetUIKeyValue } = props;
  let { nailProducts } = props;
  nailProducts = nailProducts.filter(product => (product.tags.includes('pride21')));

  return (
    <>
      <PrideCapsuleThinHeader />
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

export default memo(PrideCapsuleSection);