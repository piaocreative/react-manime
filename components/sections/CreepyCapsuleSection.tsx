import React, { memo } from 'react';
import { CreepyThinHeader } from '../design/Common';
import CreepyCapsuleBanner from '../design/creepy-capsule/CreepyCapsuleBanner';
import ProductItem from '../ProductItem';

const CreepyCapsuleSection = (props) => {
  const { isMobileView, addVariantToCart, dispatchSetCartSideBar, dispatchSetUIKeyValue, isGroupGift } = props;
  let { nailProducts } = props;
  nailProducts = nailProducts.filter(product => (product.tags.includes('creepycapsule')));

  return (
    <>
      <CreepyThinHeader
        key='Creepy Capsule'
        title='Creepy Capsule'
        description='Ominous manis are custom curated for spooky season.' />
      <CreepyCapsuleBanner key='CreepyCapsuleBanner' />
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

export default memo(CreepyCapsuleSection);