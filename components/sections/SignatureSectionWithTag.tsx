import React, { memo } from 'react';
import { Signature0721ThinHeader } from '../design/Common';
import ProductItemWithImage from 'components/ProductItemWithImage';

const SignatureSectionWithTag = (props) => {
  const { isMobileView, addVariantToCart, dispatchSetCartSideBar, dispatchSetUIKeyValue, isGroupGift, tag='signature0721' } = props;
  let { nailProducts } = props;
  nailProducts = nailProducts.filter(product => (!product.isArchived && product.tags.includes(tag)));

  return (
    <>
      <Signature0721ThinHeader
        title='Signature'
        description='Designed by Me, specially for You.' />
      {nailProducts.map((product, index) => {
        return (
          <ProductItemWithImage
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

export default memo(SignatureSectionWithTag);