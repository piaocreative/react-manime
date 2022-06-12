import React, { memo } from 'react';
import { RemixThinHeader } from '../design/Common';
import ProductItem from '../ProductItem';

const RemixedSection = (props) => {
  const { isMobileView, addVariantToCart, dispatchSetCartSideBar, dispatchSetUIKeyValue , isGroupGift} = props;
  let { nailProducts } = props;
  nailProducts = nailProducts.filter(product => (product.tags.includes('remixcollection')));

  return (
    <>
      <RemixThinHeader
        title='Remixed'
        description="Our favorite manis, remixed." />
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

export default memo(RemixedSection);