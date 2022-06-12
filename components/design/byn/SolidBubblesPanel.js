import Link from 'next/link';
import React from 'react';

import { OutlinedDarkButton } from 'components/basic/buttons';
import Bubble from 'components/icons/Bubble';
import SolidDropWithTag from 'components/product-item/SolidDropWithTag';
import { nnnProdList, solidDropList } from 'constants/index';
import useGetNailProducts from 'hooks/useGetNailProducts';
import { pageLinks } from 'utils/links';

import style from './css/solid-bubbles-panel.module.css';

const productList = [ ...nnnProdList, ...solidDropList];

const productHandle = ({products, productId}) => {
  const product = products?.find(p => p.nailProductId === productId);
  return product?.shopifyHandle || '';
}

const productIsInStock = products => product => {
  const productMatch = products?.find(p => p.nailProductId === product.id);
  return parseInt(productMatch?.quantity) > 0; 
}

const doNothing = _ => true;   

const SolidBubblesPanel = ({ isSolidChoice=false, isPedis=false, isMobileView, includeOutOfStock=false }) => {
  const { isLoading, error, result: products } = useGetNailProducts();

  return (
    <div className={style.container}>
      <div className={style.title}>PICK YOUR SHADE</div>
      <div className={style.bubbleList}>
        {productList.filter(includeOutOfStock ? doNothing : productIsInStock(products))
          .map(item => (
          <div key={item.id} className={style.bubbleItem}>
            <SolidDropWithTag
              linkHandle={productHandle({products, productId: isPedis? item.pediId: item.id})}
              color={item.color}
              className={style.bubble}
              productId={isPedis? item.pediId: item.id} />
            <div className={style.bubbleLabel}>
              {item.nnnName} {item.nnnName && <br />} {item.name}
            </div>
          </div>
        ))}
        {!isSolidChoice &&
          (isMobileView ?
            <Link href={pageLinks.Collection['Solid Colors'].url}>
              <OutlinedDarkButton passedClass={style.mobileCheckSolidButton}>
                EXPLORE SOLID COLORS
              </OutlinedDarkButton>
            </Link>:
            <div key='Solid Colors' className={style.bubbleItem}>
              <Link href={pageLinks.Collection['Solid Colors'].url}>
                <a>
                  <Bubble className={style.bubble} color='white' border='black' />
                  <OutlinedDarkButton passedClass={style.checkSolidButton}>
                    EXPLORE SOLIDS
                  </OutlinedDarkButton>
                </a>
              </Link>
            </div>
          )
        }
        </div>
    </div>
  );
};

export default SolidBubblesPanel;
