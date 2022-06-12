import Link from 'next/link';
import React, { useEffect } from 'react';

import Bubble from 'components/icons/Bubble';
import { nnnProdList } from 'constants/index';
import useGetNailProducts from 'hooks/useGetNailProducts';
import { pageLinks } from 'utils/links';

import style from './css/byn-countdown.module.css';

const productHandle = ({products, productId}) => {
  const product = products?.filter(p => p.nailProductId === productId);
  return product.length === 1 ? product[0].shopifyHandle : ''
}

const isNotArchived = product => !product.isArchived;
const hasTag = tag => product => product.tags.includes(tag);
const ofType = productType => product => !productType || product.productType === productType;
const isInStock = product => parseInt(product.quantity || 0) > 0;
const noAction = product => true;

const BYNCountDown = ({ isPedis=false, section={} }) => {
  const { isLoading, error, result: products } = useGetNailProducts();
  const galleryProdList = nnnProdList
    .filter(isNotArchived)
    .filter((section?.fields && section?.fields["Exclude Out of Stock"]) ? isInStock : noAction);

  return (
    <div className={style.container}>
      <div className={style.bubblePanel}>
        <div className={style.bubblePanelTitle}>NUDE IS NOT ONE COLOR</div>
        <div className={style.bubbleList}>
        {galleryProdList.map(item => (
          <div key={item.id} className={style.bubbleItem}>
            <Link href={`${pageLinks.ProductDetail.url}${productHandle({products, productId: isPedis? item.pediId: item.id})}`}>
              <a>
                <Bubble color={item.color} className={style.bubble} />
              </a>
            </Link>
            <div className={style.bubbleLabel}>{item.nnnName} <br /> {item.name}</div>
          </div>
        ))
        }
        </div>
      </div>
    </div>
  );
};

export default BYNCountDown;