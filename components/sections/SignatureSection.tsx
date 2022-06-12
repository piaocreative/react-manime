import React, { memo } from 'react';
import { SignatureThinHeader } from '../design/Common';
import ProductItem from '../ProductItem';

const SignatureSection = (props) => {
  const { isMobileView, addVariantToCart, dispatchSetCartSideBar, dispatchSetUIKeyValue, isGroupGift } = props;
  let { nailProducts } = props;
  nailProducts = nailProducts.filter(product => (!product.isArchived && product.tags.includes('signature') && !product.tags.includes('signature-capsule') && !product.tags.includes('signature0721')));

  return (
    <>
      <SignatureThinHeader
        title='Signature'
        description='Designed by Me, specially for You.' />
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

export default memo(SignatureSection);