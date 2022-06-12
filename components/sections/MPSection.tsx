import React, { memo } from 'react';
import { MPHandThinHeader } from '../design/Common';
import ProductItem from '../ProductItem';
import { inTheAirMpNails } from '../../config/config-local';

const MPSection = (props) => {
  const { isMobileView, addVariantToCart, dispatchSetCartSideBar, dispatchSetUIKeyValue, isGroupGift } = props;
  let { nailProducts } = props;
  nailProducts = nailProducts
    .filter(product => (!product.isArchived && product.tags.includes('MP nails x ManiMe')))
    .filter(product => !inTheAirMpNails.includes(product.nailProductId));

  return (
    <>
      <MPHandThinHeader
        title='100% MP'
        description='Designed by the one & only Madeline Poole.' />
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

export default memo(MPSection);