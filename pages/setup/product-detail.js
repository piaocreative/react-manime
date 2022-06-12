import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

import useGetNailProducts from 'hooks/useGetNailProducts';
import log from 'utils/logging'

const productHandle = ({products, productId}) => {
  const product = products?.filter(p => p.nailProductId === productId);
  return product.length === 1 ? product[0].shopifyHandle : ''
}

const Product = (props) => {
  const router = useRouter()
  const { isLoading, error, result: products } = useGetNailProducts();
  log.verbose("props are", {handle: props?.handle, query: props?.query})
  
  if (typeof window !== 'undefined') {
    const handle = productHandle({products, productId: router.query.productId});
    const from = router.query.from;

    let queryTemp = undefined;
    if(from){
      queryTemp = {query: from}
    }
    router.replace({
      pathname: `/product/${handle}`,
      ...queryTemp
    });

  }else{
    const from = props.from
    const fromString = from  ? `?from=${props.from}` : ""
    props.res.writeHead(301, { Location: `/product/${props.handle}${fromString}` });
    props.res.end();
  }

  return ;
}


Product.getInitialProps = (ctx) =>{
  
  log.verbose("product-detail getInitialProps")
  if (ctx.res) {
    const { productId, from } = ctx?.query
    const handle = productHandle({products, productId})
  //  ctx.res.writeHead(301, { Location: `/product/${ctx?.query?.handle}` });
 //   ctx.res.end();

    return { handle, from, res: ctx.res };
  }
  
}
export default Product