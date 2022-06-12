import { EssentialsThinHeader } from 'components/design/Common';
import ProductItem from 'components/ProductItem';
import useGetNailProducts from 'hooks/useGetNailProducts';
import React, { memo } from 'react';
import { isInStock, isNotArchived, noAction, ofType } from 'utils/galleryUtils';

const EssentialsSection = props => {
  const {
    isMobileView,
    addVariantToCart,
    dispatchSetCartSideBar,
    dispatchSetUIKeyValue,
    isGroupGift,
    section,
  } = props;
  const { isLoading, error, result: products } = useGetNailProducts();

  const filteredProducts = products
    .filter(isNotArchived)
    .filter(ofType('Essentials'))
    .filter(section?.fields?.['Exclude Out of Stock'] ? isInStock : noAction);

  return (
    <>
      <EssentialsThinHeader
        title="Essentials"
        description="Our specially designed, go-to hand care products."
      />
      {filteredProducts.map((product, index) => {
        return (
          <ProductItem
            isMobileView={isMobileView}
            id={`${product.nailProductId}`}
            key={index}
            isGroupGift={isGroupGift}
            productItemData={product}
            addVariantToCart={addVariantToCart}
            dispatchSetCartSideBar={dispatchSetCartSideBar}
            dispatchSetUIKeyValue={dispatchSetUIKeyValue}
          />
        );
      })}
    </>
  );
};

export default memo(EssentialsSection);
