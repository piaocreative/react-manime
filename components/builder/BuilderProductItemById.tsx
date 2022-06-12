import React, { useEffect, useState } from 'react';
import ProductItem, { ProductItemProps } from '../ProductItem';
import { Builder } from '@builder.io/react';
import ShopifyHOC from '../ShopifyHOC';
import log from '../../utils/logging';
import useGetNailProducts from '../../hooks/useGetNailProducts';
import LoadingAnimation from '../LoadingAnimation';

const ProductItemByIdWithShopify = ShopifyHOC(ProductItem);

type BuilderProductItemByIdProps = ProductItemProps & {productId: string}

const BuilderProductItemById = (props: BuilderProductItemByIdProps) =>  {

  const { isLoading, error, result: nailProducts, } = useGetNailProducts();
  const { from, productId, isMobileView } = props;
  const [ productItemData, setProductItemData ] = useState(null);
  
  useEffect(() => {
    const productItems = nailProducts?.filter(product => product.nailProductId === productId);

    if (productItems.length > 0) {
      setProductItemData(productItems[0]);
    }
    // log.info({productHandle, productItemData, nailProducts});
  }, [nailProducts, productId, from]);

  return productItemData ? (
    <ProductItemByIdWithShopify 
      from={from}
      productItemData={productItemData} 
      isMobileView={isMobileView}
      style={{
        width: "100%",
      }}
    >
    </ProductItemByIdWithShopify>
  ) : <LoadingAnimation isLoading={true} size={200} height='50vh' background='transparent' />;
  // <div>NO PRODUCT SELECTED {productHandle} <p>{JSON.stringify(productItemData)}</p></div>;
}

Builder.registerComponent(BuilderProductItemById, {
  name: 'Product Item By ID',
  inputs: [
    {
      name: 'productId',
      type: 'string',
      defaultValue: '4705982578797',
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

