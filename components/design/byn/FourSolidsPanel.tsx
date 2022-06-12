import Link from 'next/link';
import React from 'react';

import Bubble from 'components/icons/Bubble';
import { janSolidList, febSolidList, marchSolidList, aprilSolidList, maySolidList, juneSolidList, julySolidList, augustSolidList, septemberSolidList } from 'constants/index';
import useGetNailProducts from 'hooks/useGetNailProducts';
import { pageLinks } from 'utils/links';

import style from './css/four-solids.module.css';

const solidMap = {
  'January': janSolidList,
  'February': febSolidList,
  'March': marchSolidList,
  'April': aprilSolidList,
  'May': maySolidList,
  'June': juneSolidList,
  'July': julySolidList,
  'August': augustSolidList,
  'September': septemberSolidList,
}

const productHandle = ({products, productId}) => {
  const product = products?.filter(p => p.nailProductId === productId);
  return product.length === 1 ? product[0].shopifyHandle : ''
}

const FourSolidsPanel = ({ isPedis=false, month='January' }) => {
  const { isLoading, error, result: products } = useGetNailProducts();

  const solidList = solidMap[month];
  return (
    <div className={style.container}>
      <div className={style.bubblePanel}>
        <div className={style.bubblePanelTitle}>{`${month} Solids`}</div>
        <div className={style.bubbleList}>
        {solidList?.map(item => (
          <div key={item.id} className={style.bubbleItem}>
            <Link href={'/product/[handle]'} as={`${pageLinks.ProductDetail.url}${productHandle({products, productId: isPedis? item.pediId: item.id})}`}>
              <a>
                {item.color?
                  <Bubble color={item.color} className={style.bubble} />:
                  <img
                    className={style.bubble}
                    src={`https://d1b527uqd0dzcu.cloudfront.net/web/product-svgs/${isPedis? item.pediId: item.id}.svg`}
                    alt='solid-drop'/>
                }
              </a>
            </Link>
            <div className={style.bubbleLabel}>{item.name}</div>
          </div>
        ))
        }
        </div>
      </div>
    </div>
  );
};

export default FourSolidsPanel;