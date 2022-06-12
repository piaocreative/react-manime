import React, { memo } from 'react';
import { SummerNostalgiaThinHeader } from 'components/design/Common';
import ProductItem from 'components/ProductItem';

const SummerPicnicSection = (props) => {
  const { isMobileView, addVariantToCart, dispatchSetCartSideBar, dispatchSetUIKeyValue } = props;
  let { nailProducts } = props;
  nailProducts = nailProducts.filter(product => (product.tags.includes('summer-nostalgia')));

  return (
    <>
      <SummerNostalgiaThinHeader />
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

export default memo(SummerPicnicSection);