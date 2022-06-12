import React, { memo } from 'react';
import { BYNThinHeader } from '../design/Common';
import BYNCountDown from '../design/byn/BYNCountDown';
import ProductItem from '../ProductItem';

const BareYourNailsSection = (props) => {
  const { isMobileView, addVariantToCart, dispatchSetCartSideBar, dispatchSetUIKeyValue, isPedis, isGroupGift} = props;
  let { nailProducts } = props;
  nailProducts = nailProducts.filter(product => (!product.isArchived && product.tags.includes('bareyournails') && !product.tags.includes('dreamyescape')));

  return (
    <>
      <BYNThinHeader
        title='Bare Your Nails'
        description='Celebrating individual beauty.'
        style={{marginBottom: '30px'}} />
      
      <BYNCountDown key='BYNCountDown' isPedis={isPedis} />

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

export default memo(BareYourNailsSection);