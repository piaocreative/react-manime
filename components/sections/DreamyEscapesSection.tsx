import React, { memo } from 'react';
import { DreamyEscapeThinHeader } from '../design/Common';
import ProductItem from '../ProductItem';
import VideoBannerPanel from '../design/VideoBannerPanel';
import videoLinks from '../../utils/videoLinks';

const DreamyEscapesSection = (props) => {
  const { isMobileView, addVariantToCart, dispatchSetCartSideBar, dispatchSetUIKeyValue, isPedis, isGroupGift } = props;
  let { nailProducts } = props;
  nailProducts = nailProducts.filter(product => (!product.isArchived && product.tags.includes('dreamyescape')));

  return (
    <>
      <DreamyEscapeThinHeader
        title='Dreamy escapes'
        description='Travel at your fingertips.' />
      <VideoBannerPanel
        isMobileView={isMobileView}
        video={!isPedis ? videoLinks.dreamyEscapeMani: videoLinks.dreamyEscapePedi} />
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

export default memo(DreamyEscapesSection);