import React, { memo } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import classNames from 'classnames';
import ProductItem from './ProductItem';
import style from '../static/components/design/product-item-with-image.module.css';
import { pageLinks } from '../utils/links';

const DesignInfoPanel = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f5efe7;
  background-image: ${props => props.backImage ? `url(${props.backImage})`: ''};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 80%;
  z-index: 1;
`;

const DesignImagePanel = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f4f0e5;
  background-image: ${props => props.backImage ? `url(${props.backImage})`: ''};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const ProductItemWithImage = (props) => {
  const { productItemData } = props;
    return (
      <>
        {(productItemData?.extraFields?.image || productItemData?.extraFields?.text) &&
          <div className={classNames(style.infoPanel, productItemData?.extraFields?.isDarkImage && style.whiteColor)}>
            <DesignInfoPanel
              backImage={productItemData?.extraFields?.image}>
              <div className={style.title}>{productItemData?.name}</div>
              <div className={style.description}>
                {productItemData?.extraFields?.text || ''}
              </div>

              <Link href={"/product/[handle]"} as={`${pageLinks.ProductDetail.url}${productItemData.shopifyHandle}`}>
                <a className={style.viewMore1}>view more</a>
              </Link>
            </DesignInfoPanel>
          </div>
        }
        {productItemData?.extraFields?.largeImage &&
          <div className={style.imagePanel}>
            <DesignImagePanel
              backImage={productItemData.extraFields.largeImage} />
          </div>
        }
        <ProductItem
          id={`${productItemData.nailProductId}`}
          {...props} />
      </>
    );
};

export default memo(ProductItemWithImage);