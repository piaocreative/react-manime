import React, { memo } from 'react';
import { BHMThinHeader } from '../design/Common';
import ProductItem from '../ProductItem';

const HBHSection = (props) => {
  const { isMobileView, addVariantToCart, dispatchSetCartSideBar, dispatchSetUIKeyValue, isGroupGift } = props;
  let { nailProducts } = props;
  nailProducts = nailProducts.filter(product => (!product.isArchived && product.tags.includes('BHM_21')));

  return (
    <>
      <BHMThinHeader
        title='BHM'
        description='Honor the Black community with looks designed exclusively by Black nail artists.' />
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

export default memo(HBHSection);