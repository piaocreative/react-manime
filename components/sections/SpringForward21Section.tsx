import React, { memo } from 'react';
import { SpringForwardThinHeader } from '../design/Common';
import ProductItem from '../ProductItem';

const SpringForward21Section = (props) => {
  const { isMobileView, addVariantToCart, dispatchSetCartSideBar, dispatchSetUIKeyValue, isPedis } = props;
  let { nailProducts } = props;
  nailProducts = nailProducts.filter(product => (!product.isArchived && product.tags.includes('spring21')));

  return (
    <>
      <SpringForwardThinHeader
        title='Spring Forward'
        description='Blooming with freshly picked manis.' />

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

export default memo(SpringForward21Section);