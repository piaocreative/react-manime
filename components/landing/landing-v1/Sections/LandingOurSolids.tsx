import React from 'react';
import classNames from 'classnames';
import Router from 'next/router';
import Link from 'next/link';
import Bubble from 'components/icons/Bubble';

import { DarkButton } from 'components/basic/buttons';
import { solidDropList, nnnProdList } from 'constants/index';
import useGetNailProducts from 'hooks/useGetNailProducts';
import { pageLinks } from 'utils/links';

import style from '../../../../static/components/design/our-solids.module.css';

const displayInfoList = [...nnnProdList, ...solidDropList];

const productHandle = ({products, productId}) => {
  const product = products?.filter(p => p.nailProductId === productId);
  return product.length === 1 ? product[0].shopifyHandle : ''
}

const LandingOurSolids = ({ isMobileView }) => {
  const { isLoading, error, result: products } = useGetNailProducts();

  const moveToSolidChoiceHandler = () => {
    Router.push(pageLinks.Collection['Solid Colors'].url);
  };

  return (
    <div className={style.container}>
      <div className={style.title}>Explore Our Solids</div>
        {displayInfoList.map((item, index ) => {
          return (
            <div key={item.id} className={style.bubbleItem}>
              <Link href={`${pageLinks.ProductDetail.url}${productHandle({products, productId: item.id})}`}>
                <a>
                  {item.color?
                    <Bubble color={item.color} className={style.bubble} />:
                    <img
                      className={style.bubble}
                      src={`https://d1b527uqd0dzcu.cloudfront.net/web/product-svgs/${item.id}.svg`}
                      alt='solid-drop'/>
                  }
                </a>
              </Link>
              <div className={style.productTitle}>
                <div className={classNames(style.centerTitle, [].includes(index) && style.bigTitle)}>
                  {item.nnnName} {item.nnnName && <br />} {item.name}
                </div>
              </div>
            </div>
          );
        })}
      <div className={style.actionButtonWrapper}>
        <DarkButton onClick={moveToSolidChoiceHandler}>
          Discover All Designs
        </DarkButton>
      </div>
    </div>
  );
};

export default LandingOurSolids;
