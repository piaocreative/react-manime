import React from 'react';
import { useSelector } from 'react-redux';
import ProductItem from 'components/ProductItem';
import { nnnBundleId, roseOmbreProductId, signatureBundleId } from '../../config/config-local';

const BundlePanel = ({ isMobileView, video, hideSignature, ...rest }) => {
  const nailProducts = useSelector((state) => state.productsData.products);
  const nnnBundleInfo = nailProducts.find(product => product.nailProductId === nnnBundleId);
  const roseOmbreInfo = nailProducts.find(product => product.nailProductId === roseOmbreProductId);
  const signatureBundleInfo = nailProducts.find(product => product.nailProductId === signatureBundleId);

  return (
    <>
      <ProductItem
        isMobileView={isMobileView}
        id={nnnBundleId}
        productItemData={nnnBundleInfo}
        {...rest} />      
      <ProductItem
        isMobileView={isMobileView}
        id={roseOmbreProductId}
        productItemData={roseOmbreInfo}
        {...rest} />
      {!hideSignature &&
        <ProductItem
          isMobileView={isMobileView}
          id={signatureBundleId}
          productItemData={signatureBundleInfo}
          {...rest} />
      }
    </>
  );
}

export default BundlePanel;