import React, { memo } from 'react';
import { CareCollectionThinHeader } from '../design/Common';
import ProductItem from '../ProductItem';

const CareCollectionSection = (props) => {
  const { isMobileView, addVariantToCart, dispatchSetCartSideBar, dispatchSetUIKeyValue , isGroupGift} = props;
  let { nailProducts } = props;
  nailProducts = nailProducts.filter(product => (!product.isArchived && product.tags.includes('CARE')));

  return (
    <>
      <CareCollectionThinHeader
        title='Care Collection'
        description='11 looks from top artists; 100% proceeds donated to social good funds.' />
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

export default memo(CareCollectionSection);