import FourSolidsPanel from 'components/design/byn/FourSolidsPanel';
import ProductItem from 'components/ProductItem';
import useCartFunctions from 'hooks/useCartFunctions';
import useCommonDispatchers from 'hooks/useComonDispatchers';
import useGetNailProducts from 'hooks/useGetNailProducts';
import React, { memo } from 'react';

const isNotArchived = product => !product.isArchived;
const hasTag = tag => product => product.tags.includes(tag);
const ofType = productType => product => !productType || product.productType === productType;
const isInStock = product => parseInt(product.quantity || 0) > 0;
const noAction = product => true;

const MonthlySolidSection = props => {
  const {
    isMobileView,
    isPedis,
    tag = 'wintercapsule',
    month = 'January',
    isGroupGift,
    productType,
    section,
  } = props;

  const { isLoading, error, result: products } = useGetNailProducts();
  const cartFunctions = useCartFunctions();
  const commonDispatchers = useCommonDispatchers();

  const nailProducts = products
    .filter(isNotArchived)
    .filter(hasTag(tag))
    .filter(ofType(productType))
    .filter(section?.fields && section?.fields['Exclude Out of Stock'] ? isInStock : noAction);

  // console.log({ month, props, nailProducts });

  if (nailProducts.length === 0) return;

  return (
    <>
      <FourSolidsPanel isPedis={isPedis} month={month} />
      {nailProducts?.map((product, index) => {
        return (
          <ProductItem
            isMobileView={isMobileView}
            id={`${product.nailProductId}`}
            key={index}
            isGroupGift={isGroupGift}
            productItemData={product}
            addVariantToCart={cartFunctions.addVariantToCart}
            dispatchSetCartSideBar={commonDispatchers.dispatchSetCartSideBar}
            dispatchSetUIKeyValue={commonDispatchers.dispatchSetUIKeyValue}
          />
        );
      })}
    </>
  );
};

export default memo(MonthlySolidSection);
