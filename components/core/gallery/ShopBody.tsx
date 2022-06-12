import { AvailableCarts } from 'actions/cart';
import GalleryFilterBar from 'components/core/gallery/FilterBar';
import GalleryMenuBar from 'components/core/gallery/MenuBar';
import ProductItem, { ImageClickMode } from 'components/ProductItem';
import Box from 'components/styled/Box';
import useCartFunctions from 'hooks/useCartFunctions';
import useCommonDispatchers from 'hooks/useComonDispatchers';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import checkMobile from 'utils/checkMobile';

function ShopBody({
  menuBaseUrl = undefined,
  cartName = AvailableCarts.MainCart,
  productFilter = undefined,
  disableFilter = undefined,
  addCtaLabel = undefined,
  disabledCtaLabel = undefined,
  hidePrice = false,
  extraBottomMargin = '0px',
}) {
  const [isMobileView, setIsMobileView] = useState(false);
  const router = useRouter();
  const commonDispatchers = useCommonDispatchers();
  const cartFunctions = useCartFunctions();
  const stepParam = router.query.step as string[];
  let view = 'all';
  if (stepParam && stepParam.length == 2) {
    view = stepParam[1];
  }
  const [displayProducts, setDisplayProducts] = useState([]);

  const addVariantToSpecificCart = (variantId, quantity) =>
    cartFunctions.addVariantToCart(variantId, quantity, cartName);

  const viewFilter = useCallback(
    product => {
      let additionalFilter = true;
      if (productFilter) {
        additionalFilter = productFilter(product);
      }
      if (view === 'all') {
        return additionalFilter;
      }

      return product.productType?.toLowerCase() === view && additionalFilter;
    },
    [view]
  );

  useEffect(() => {
    setIsMobileView(checkMobile());
  }, []);
  return (
    <>
      <Box
        width={1}
        display="flex"
        flexDirection="column"
        flex={3}
        mb={90}
        style={{ flexWrap: 'wrap' }}
        justifyContent="flex-start"
        minHeight={['unset', '600px']}
      >
        <GalleryMenuBar base={menuBaseUrl} view={view} />
        <GalleryFilterBar
          setProductsCallback={setDisplayProducts}
          background="white"
          additionalFilters={viewFilter}
        />
        <Box
          width={1}
          display="flex"
          style={{ flexWrap: 'wrap' }}
          justifyContent="flex-start"
          minHeight={['unset', '600px']}
          mb={extraBottomMargin}
        >
          {displayProducts.map((product, index) => {
            const isOutOfStock =
              parseInt(product.quantity || '0') <=
              parseInt(process.env.OUT_OF_STOCK_THRESHOLD || '0');
            return (
              <ProductItem
                isMobileView={isMobileView}
                id={`${product.nailProductId}`}
                key={index}
                imageClickMode={ImageClickMode.ADD_TO_BAG}
                productItemData={product}
                isOutOfStock={isOutOfStock}
                addVariantToCart={addVariantToSpecificCart}
                dispatchSetUIKeyValue={commonDispatchers.dispatchSetUIKeyValue}
                isDisabled={disableFilter && disableFilter(product)}
                hidePrice={hidePrice}
                addCtaLabel={addCtaLabel}
                disabledCtaLabel={disabledCtaLabel}
              />
            );
          })}
        </Box>
      </Box>
    </>
  );
}

export default ShopBody;
