import { getLiveProductByHandle } from 'api/product';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import LoadingAnimation from 'components/LoadingAnimation';
import PageHead from 'components/PageHead';
import Instruction from 'components/product-detail/Instruction';
import {
  BackButton,
  BagButton,
  BagButtonContainer,
  Container,
  Gallery,
  Gallery2,
  GalleryBox,
  ProductImage,
  ProductInfo,
  QuantityBox,
  QuantityButtonBox,
  SmallImg,
  StepButton,
} from 'components/product-detail/styled';
import RequestProductPanel from 'components/product-item/RequestProductPanel';
import Box from 'components/styled/Box';
import config from 'config';
import useCartFunctions from 'hooks/useCartFunctions';
import useCommonDispatchers from 'hooks/useComonDispatchers';
import { Markup } from 'interweave';
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ReactImageMagnify from 'react-image-magnify';
import { useSelector } from 'react-redux';
import { pageLinks } from 'utils/links';
import log from 'utils/logging';
import { getProfileId } from 'utils/profileData';
import { trackCheckout, trackFunnelActionProjectFunnel } from 'utils/track';
import styled from 'styled-components';

declare var yotpo;

const ProductName = styled.h1`
  font-family: 'gentiumBasic';
  font-size: 20px;
  font-weight: normal;
  color: forecolor.0;
  margin: 0 0 1em;
`;
const OriginalPriceSpan = styled.span`
  margin-left: 2px;
  margin-right: 2px;
  text-decoration-line: line-through;
  position: relative;
  color: #919191;
  font-size: 12px;
`;
const DiscountPercentSpan = styled.span`
  position: relative;
  border: 1px solid #c83430;
  padding: 0px 8px 0px 4px;
  border-radius: 12.5px;
  font-size: 12px;
`;

const DELUXE_GIFT_KIT_PRODUCTID = '4843424252013';
const GIFT_CARD_PRODUCTID = '4261687132269';

const ProductDetail = props => {
  const cartFunctions = useCartFunctions();
  const commonDispatchers = useCommonDispatchers();

  const { productInfo } = props;
  const router = useRouter();
  const { isFallback } = router;

  const [handle, setHandle] = useState(router.asPath.match(/\/product\/([^\/?]*)[\/?]?/)[1]);

  const [invalidSmallImages, setInvalidSmallImages] = useState([] as Array<Boolean>);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(true);
  const [openArchiveRequest, setOpenArchiveRequest] = useState(false);
  const [productData, setProductData] = useState({} as any);
  const [productImages, setProductImages] = useState([] as Array<String>);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [yotpoInitialized, setYotpoInitialized] = useState(false);

  const profileData = useSelector((state: any) => state.profileData);

  // useEffect(() => {
  //   const fetchProductInfo = async handle => {
  //     let response = await getLiveProductByHandle(handle);
  //     setProductData(response);
  //   };
  //   if (isFallback && !productData?.productId) {
  //     fetchProductInfo(handle);
  //   }
  // }, [handle, isFallback, productData]);

  const categoriesText = {
    __default: 'At-Home Nail Care Product',
    Manis: 'At-Home Gel Manicure Kit',
    Pedis: 'At-Home Gel Pedicure Kit',
    Essentials: 'At-Home Nail Care Product',
  };
  const categoryText = categoriesText[productData?.productType] || categoriesText['__default'];
  const mobileImageQuery = '?width=600&quality=70';
  const imageQuery = isMobileView ? mobileImageQuery : '';
  const url =
    router.asPath.indexOf('?') === -1
      ? router.asPath
      : router.asPath.substring(0, router.asPath.indexOf('?'));

  const pageHead = {
    title: productData?.name + ' | ' + categoryText + ' | ' + 'ManiMe',
    description: `The future of manicures is here. ManiMe offers at-home manis &amp; pedis in minutes, customized for you. Get our ${
      productData?.name
    } ${categoryText.toLowerCase()} today. Toxin-free and cruelty-free stick on nails that fit to your unique nail shape, for every occasion and style.`,
    keywords: 'Stick On Gel Nails, Nail Art Design, Custom Nails',
    url: url,
    image: productImages[0],
  };

  const isOutOfStock =
    parseInt(productData?.quantity || 0) <= config.soldOutThreshold &&
    !productData?.tags?.includes('evergreen');
  const isEssentialProduct =
    productData?.productType === 'Essentials' || productData?.subtitle === 'ManiMe Bundle';
  const isPedis = productData?.productType === 'Pedis';

  const compareAtPrice = productData?.compareAtPrice;
  const originalPrice =
    productData?.extraFields?.originalPrice || parseFloat(compareAtPrice) || 0;
  const discountPercent = originalPrice ? +(((productData?.price - originalPrice) / originalPrice).toFixed(2))*100 : 0;

  const addToBagHandler = () => {
    if (isOutOfStock || !productData || !productData.nailProductId) return;

    const variantId = btoa(`gid://shopify/ProductVariant/${productData.variantId}`);
    const profileId = getProfileId(profileData.profiles, productData.productType);

    if (window['dataLayer']) {
      const gtm = {
        event: 'addToCart',
        content_type: 'product',
        content_ids: [productData?.variantId],
        product_name: productData?.name,
        value: productData?.price,
        currency: 'USD',
      };
      // log.info(gtm);
      window['dataLayer'].push(gtm);
    }

    cartFunctions.addVariantToCart(variantId, quantity);
    commonDispatchers.dispatchSetCartSideBar(true);
    trackCheckout('[atb]', {
      from: '[handle]',
      productType: productData.productType,
    });
    trackFunnelActionProjectFunnel(`A. Add Product To Cart`, {
      profileId,
      productType: productData.productType,
    });
  };

  const goBackHandler = () => {
    if (window.history.length > 2) {
      Router.back();
    } else {
      Router.push(pageLinks.SetupDesign.url);
    }
  };

  const hideSelectedIndex = invalidIndex => {
    const newInvalidSmallImages = [...invalidSmallImages];
    newInvalidSmallImages[invalidIndex] = true;
    setInvalidSmallImages(newInvalidSmallImages);
  };

  const productImageChangeHandler = index => {
    if (selectedImageIndex !== index) setSelectedImageIndex(index);
  };

  const quantityChangeHandler = step => () => {
    const newQuantity = quantity + step;
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const closeArchiveRequestHandler = () => {
    setOpenArchiveRequest(false);
  };

  const openArchiveRequestHandler = () => {
    setOpenArchiveRequest(true);
  };

  const navToGiftBundle = () => {
    Router.push(pageLinks.GiftDeluxeGiftKit.url);
  };

  const navToGiftCard = () => {
    Router.push(pageLinks.GiftCard.url);
  };

  const navToGalleryHandler = () => {
    if(isLoading) return;

    const productId = productData?.nailProductId;
    const query = router?.query;
    const from = decodeURIComponent(query?.from as string);

    if (query?.landing) {
      Router.push({
        pathname: pageLinks.Home.url,
        query: { landing: props.query.landing },
      });
    } else if (from === 'pickyourshade') {
      Router.push(`${pageLinks.Collection['Solid Colors'].url}#${query?.from}`);
    } else if (!query || !productId) {
      Router.push(pageLinks.SetupDesign.url);
    } else {
      const from = query?.from || pageLinks.SetupDesign.url;
      Router.push(`${from}#${productId}`);
    }
  };
  const fetchProductInfo = async () => {
    const handle = router.asPath.match(/\/product\/([^\/?]*)[\/?]?/)[1];
    setHandle(handle);
    const newProductData = await getLiveProductByHandle(handle);
    setProductData(newProductData);

    setYotpoInitialized(false);
    setIsLoading(false);
  };

  useEffect(() => {
    if(!handle) {
      setIsLoading(false);
      return;
    }
    setIsMobileView(window.innerWidth < 768);
    setIsLoading(true);
    fetchProductInfo();
  }, []);

  useEffect(() => {
    if (handle && !productData) {
      setProductImages([]);
      return;
    }
    const { picuri1, picuri2, picuri3, picuri4, picuri5 } = productData;
    const newProductImages = [picuri1, picuri2, picuri3, picuri4, picuri5].filter(picuri => picuri);
    setProductImages(newProductImages);
  }, [productData]);

  useEffect(() => {
    if (isLoading || yotpoInitialized) return;

    if(!productData || !productData?.nailProductId){
      navToGalleryHandler();
      return;
    }
    if (productData?.nailProductId === DELUXE_GIFT_KIT_PRODUCTID) {
      // log.info(DELUXE_GIFT_KIT_PRODUCTID);
      navToGiftBundle();
      return;
    }
    else if (productData?.nailProductId === GIFT_CARD_PRODUCTID) {
      // log.info(GIFT_CARD_PRODUCTID);
      navToGiftCard();
      return;
    }

    if (typeof yotpo === 'object' && yotpo?.initialized) {
      yotpo?.refreshWidgets();
      setYotpoInitialized(true);
    }
  }, [isLoading]);

  log.verbose(`rendering product id ${productData?.nailProductId}`);
  log.verbose(productData);

  return (
    <>
      <PageHead
        title={pageHead.title}
        description={pageHead.description}
        keywords={pageHead.keywords}
        url={pageHead.url}
        image={pageHead.image}
      />
      <Container>
        <Gallery>
          <BackButton onClick={goBackHandler}>{'<  BACK'}</BackButton>
          <GalleryBox>
            {productImages.map((each, index) => (
              <SmallImg
                hide={invalidSmallImages[index] === true}
                onError={err => hideSelectedIndex(index)}
                key={`smallImg${index}`}
                src={`${each}${imageQuery}`}
                opacity={index === selectedImageIndex ? 1 : 0.3}
                alt={`${productData?.name} thumbnail ${index + 1}`}
                onClick={() => productImageChangeHandler(index)}
              />
            ))}
          </GalleryBox>
        </Gallery>
        {isLoading && (
          <LoadingAnimation
            isLoading={isLoading}
            size={200}
            height="50vh"
            background="transparent"
          />
        )}
        <ProductImage>
          {!isLoading &&
            Array.isArray(productImages) &&
            productImages.length > selectedImageIndex &&
            productImages[selectedImageIndex] &&
            productImages[selectedImageIndex] && (
              <ReactImageMagnify
                {...{
                  smallImage: {
                    alt: productData?.name,
                    isFluidWidth: true,
                    src: productImages[selectedImageIndex],
                  },
                  largeImage: {
                    src: productImages[selectedImageIndex],
                    width: 1800,
                    height: 1800,
                  },
                }}
                style={{ zIndex: 1 }}
              />
            )}
        </ProductImage>
        <Gallery2>
          <GalleryBox mobile={true}>
            {productImages.map((each, index) => {
              // TODO: show all later
              const src = each || '';
              return (

                <SmallImg
                  alt={`${productData?.name} thumbnail ${index + 1}`}
                  hide={invalidSmallImages[index] === true}
                  onError={err => hideSelectedIndex(index)}
                  key={`key${index}`}
                  src={`${src}${imageQuery}`}
                  opacity={index === selectedImageIndex ? 1 : 0.3}
                  onClick={() => productImageChangeHandler(index)}
                />
              );
            })}
          </GalleryBox>
        </Gallery2>
        <ProductInfo>
          {!isLoading && (
            <Box>
              <Box fontFamily="gentiumBasic" fontSize={20} color="forecolor.0">
                {productData?.name}
              </Box>
              {productData?.nailProductId && (
                <div
                  className="yotpo bottomLine"
                  data-product-id={`${productData?.nailProductId}`}
                  // data-url={`https://manime.co/setup/product-detail?productId=${productData.nailProductId}`}>Router?.query?.handle
                  data-url={`https://manime.co/product/${handle}`}
                ></div>
              )}
              <Box color="forecolor.0" mt={3} fontSize="14px">
                <Markup content={productData?.description} />
              </Box>
              <QuantityBox
                isOutOfStock={isOutOfStock}
                showBorder={!isEssentialProduct && !isOutOfStock}
              ></QuantityBox>
              {!isEssentialProduct && <Instruction isPedis={isPedis} />}
              <BagButtonContainer display="flex" mt={4}>
                <>
                  {!productData?.isArchived && !isOutOfStock && (
                    <QuantityButtonBox>
                      <StepButton px="3" onClick={quantityChangeHandler(-1)}>
                        {' '}
                        −{' '}
                      </StepButton>
                      <Box fontSize="18px"> {quantity} </Box>
                      <StepButton px="3" onClick={quantityChangeHandler(1)}>
                        {' '}
                        +{' '}
                      </StepButton>
                    </QuantityButtonBox>
                  )}
                  {productData?.isArchived || isOutOfStock ? (
                    <BagButton
                      // minWidth='100%'
                      flexGrow={1}
                      onClick={openArchiveRequestHandler}
                    >
                      <span style={{ textTransform: 'uppercase' }}>Bring It Back</span>
                    </BagButton>
                  ) : (
                    <BagButton
                      // minWidth='100%'
                      flexGrow={1}
                      isDisabled={isOutOfStock}
                      onClick={addToBagHandler.bind(this)}
                      style = {discountPercent ? {paddingLeft: '10px', paddingRight: '10px'} : {}}
                    >
                      <span>ADD TO BAG</span>
                      
                      {discountPercent === 0 ?
                        <span>${productData?.price}</span>
                        :
                        <div>
                          {/* <span style={{position: 'relative', top: '3px'}}>${`${productData?.price}`}</span> */}
                          <span style={{marginLeft: '5px'}}>${`${productData?.price}`}</span>
                          <OriginalPriceSpan>${originalPrice}</OriginalPriceSpan>
                          <DiscountPercentSpan>{discountPercent > 0 && "+"} { `${discountPercent}` + "%"}</DiscountPercentSpan>
                        </div>
                      }

                    </BagButton>
                  )}
                </>
              </BagButtonContainer>
            </Box>
          )}
        </ProductInfo>
      </Container>
      <Box my="32px">
        {productData?.tags && (
          <div
            style={{ width: '100%' }}
            className="yotpo yotpo-pictures-widget"
            data-gallery-id={
              productData.tags.indexOf('solidchoice') === -1
                ? '605a20e2d6553403b6f8ed6c'
                : '607dba63f1b75c1cfd96d88b'
            }
          ></div>
        )}
      </Box>
      <Container>
        {productData?.nailProductId && (
          <div
            className="yotpo yotpo-main-widget"
            data-product-id={`${productData.nailProductId}`}
            data-price={productData.price}
            data-currency={'USD'}
            data-name={productData.name}
            // data-url={`https://manime.co/setup/product-detail?productId=${product.nailProductId}`}
            data-url={`https://manime.co/product/${handle}`}
            data-image-url={`${productImages.length > 0 ? productImages[0] : ''}`}
          ></div>
        )}
      </Container>
      {openArchiveRequest && (
        <RequestProductPanel productItemData={productData} onClose={closeArchiveRequestHandler} />
      )}{' '}
    </>
  );
};

const _ProductDetail = ManimeStandardContainer(ProductDetail, true);

export default _ProductDetail;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export const getStaticProps = async props => {
  const handle = props.params.handle;
  const url = `/product/${handle}`;

  const productInfo = null; // await getLiveProductByHandle(handle);

  try {
    const globalProps = await getGlobalProps({
      propsToMerge: { url, handle, productInfo },
    });
    return globalProps;
  } catch (err) {
    log.error('[product page]', err);
    return {
      notFound: true,
    };
  }
};
