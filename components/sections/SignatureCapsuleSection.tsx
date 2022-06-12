import React, { memo } from 'react';
import { SignatureCapsuleThinHeader } from '../design/Common';
import ProductItem from '../ProductItem';

const SignatureCapsuleSection = (props) => {
  const { isMobileView, addVariantToCart, dispatchSetCartSideBar, dispatchSetUIKeyValue, isGroupGift } = props;
  let { nailProducts } = props;
  nailProducts = nailProducts.filter(product => (!product.isArchived && (product.tags.includes('signature-capsule') && !product.tags.includes('signature0721'))));

  return (
    <>
      <SignatureCapsuleThinHeader
        title='Signature Capsule'
        description='Freshen up with naturally inspired looks.' />
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

export default memo(SignatureCapsuleSection);