import React, { useEffect, useState } from 'react';
import ProductItem, { ProductItemProps } from '../ProductItem';
import { Builder } from '@builder.io/react';
import ShopifyHOC from '../ShopifyHOC';
import log from '../../utils/logging';
import useGetNailProducts from '../../hooks/useGetNailProducts';
import LoadingAnimation from '../LoadingAnimation';

const ProductItemWithShopify = ShopifyHOC(ProductItem);

type BuilderProductItemProps = ProductItemProps & {productHandle: string}

const BuilderProductItem = (props: BuilderProductItemProps) =>  {

  const { isLoading, error, result: nailProducts, } = useGetNailProducts();
  const { from, productHandle, isMobileView } = props;
  const [ productItemData, setProductItemData ] = useState(null);
  
  useEffect(() => {
    const productItems = nailProducts?.filter(product => product.shopifyHandle === productHandle);

    if (productItems.length > 0) {
      setProductItemData(productItems[0]);
    }
    // log.info({productHandle, productItemData, nailProducts});
  }, [nailProducts, productHandle, from]);

  return productItemData ? (
    <ProductItemWithShopify 
      from={from}
      productItemData={productItemData} 
      isMobileView={isMobileView}
      style={{
        width: "100%",
      }}
    >
    </ProductItemWithShopify>
  ) : <LoadingAnimation isLoading={true} size={200} height='50vh' background='transparent' />;
  // <div>NO PRODUCT SELECTED {productHandle} <p>{JSON.stringify(productItemData)}</p></div>;
}

Builder.registerComponent(BuilderProductItem, {
  name: 'Product Item',
  inputs: [
    {
      name: 'productHandle',
      type: 'string',
      defaultValue: 'enigma',
    },
    {
      name: 'from',
      type: 'string',
      defaultValue: '/',
    },
    // {
    //   name: 'shopifyProduct',
    //   type: 'shopifyProduct',
    //   defaultValue: null,
    // },
  ],
})

