import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ProductItem from '../ProductItem';
import style from '../../static/components/design/july-bundle.module.css';
import { useWindowSize } from '../../utils/hooks';
import { anniversaryBundleId as productId } from '../../config/config-local';

const DesignInfoPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  background-image: ${props => props.backImage ? `url(${props.backImage})`: ''};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding-top: 14px;
  padding-bottom: 18px;
  @media (min-width: 1024px) {
    justify-content: center;
    align-items: right;
    padding-left: 15%;
  }
`;

const DesignInfoSection = (props) => {
  const [productInfo, setProductInfo] = useState({});
  const size = useWindowSize();

  const init = async () => {
    const { nailProducts, order } = props;
    let productInfo = null;
      productInfo = nailProducts.find(product => product.nailProductId === productId);

    setProductInfo(productInfo);
  }

  useEffect (() => {
    if (Array.isArray(props.nailProducts) && props.nailProducts.length > 0) {
      init();
    }
  }, [props.nailProducts]);

  const { isMobileView } = props;

  if (!(productInfo || {}).nailProductId) {
    return null;
  }
  // TODO: update video
  const videoSrc = size.width > 1024
    ? 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/anniversary-bundle-desktop.mp4?v=1603738176'
    : 'https://cdn.shopify.com/s/files/1/0253/6561/0605/files/anniversary-bundle-mobile.mp4?v=1603738176'
  return (
    <div className={style.container}>
      <div className={style.videoContainer}>
        <div className={style.infoPanel}>
          <video width="100%" height="100%" autoPlay loop muted playsInline
            className={style.gifImage}>
            <source src={videoSrc} type="video/mp4"/>
            Your browser does not support the video tag.
          </video>
          <DesignInfoPanel
            backImage={''}>
          </DesignInfoPanel>
        </div>
      </div>


      <ProductItem
        noMarginBottom
        isMobileView={isMobileView}
        id={`${productInfo.nailProductId}`}
        productItemData={productInfo}
        {...props} />

    </div>
  );
};

export default DesignInfoSection;
