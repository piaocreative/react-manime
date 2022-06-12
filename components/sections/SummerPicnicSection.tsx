import React, { memo } from 'react';
import { SummerPicnicThinHeader } from 'components/design/Common';
import ProductItem from 'components/ProductItem';

const SummerPicnicSection = (props) => {
  const { isMobileView, addVariantToCart, dispatchSetCartSideBar, dispatchSetUIKeyValue } = props;
  let { nailProducts } = props;
  nailProducts = nailProducts.filter(product => (product.tags.includes('summer-picnic')));

  return (
    <>
      <SummerPicnicThinHeader />
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