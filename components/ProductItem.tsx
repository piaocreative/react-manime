import style from '@styles/design/product-item.module.css';
import { UI_SET_KEY_VALUE } from 'actions';
import { inDevelopment, inProduction } from 'api/product';
import VideoBundlePanel from 'components/design/VideoBannerPanel';
import Badge from 'components/product-item/Badge';
import Box from 'components/styled/Box';
import { StandardOutlinedButton } from 'components/styled/StyledComponents';
import config from 'config';
import Link from 'next/link';
import Router from 'next/router';
import React, { memo, useEffect, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
// import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Product } from 'types';
import { pageLinks } from 'utils/links';
import { getProfileId } from 'utils/profileData';
import { trackCheckout, trackFunnelActionProjectFunnel } from 'utils/track';
// const RequestProductPanel = dynamic(() => import('./product-item/RequestProductPanel'));
import RequestProductPanel from './product-item/RequestProductPanel';

const Container = styled(Box)`
  position: relative;
  width: ${props => props?.style?.width || '50%'};
  margin-bottom: ${props => (!props.landing && !props.noMarginBottom ? '35px' : '0px')};
  padding: ${props => (!props.landing ? '10px 12px' : '10px 16px')};
  z-index: 10;
  background: ${props => (props.isDisabled && '#F2F2F2') || (props.isPreview && '#F2F2FF')};
  border: ${props => props.isPreview && '1px dashed #00F'};
  @media (min-width: 480px) {
    width: 50%;
    &:hover {
      background: ${props => !props.landing && '#F2F2F2'};
    }
    // height: 50%;
  }

  @media (min-width: 768px) {
    width: ${props => (props.isTopLeft ? '50%' : '50%')};

    min-height: ${props => (props.isTopLeft ? '50%' : '30%')};
  }

  @media (min-width: 1024px) {
    width: ${props => (props.isTopLeft ? '50%' : '25%')};

    min-height: ${props => (props.isTopLeft ? '50%' : '30%')};
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  cursor: pointer;
  // TODO: carousel switching. if carousel remove
  padding-top: 120%;

  position: relative;
  & .control-dots {
    padding-left: 0 !important;
  }
`;

const OneLineBox = styled(Box)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  cursor: pointer;
`;

const PriceAddBagBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  & button {
    text-transform: uppercase;
  }
`;

const ListingTitle = styled(Box)`
  font-family: Avenir-Book;
  text-transform: uppercase;
  font-size: 12px;
  width: 160px;
  height: 52px;
  margin: 0 auto;
  line-height: 1.67;
  letter-spacing: 4px;
  text-align: center;
  color: #2c4349;
  @media (min-width: 768px) {
    width: unset;
  }
`;

const AddBagButton = styled(StandardOutlinedButton)`
  border: 1px solid #2c4349;
  letter-spacing: 2px;
  width: 100%;
  height: 32px;
  font-size: 12px;
  font-family: 'avenirMedium';
  color: ${props => props.disabled && '#aaa'};
  border-color: ${props => props.disabled && '#aaa'};
  @media (min-width: 480px) {
    position: relative;
    overflow: hidden;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 150%;
      width: 200%;
      height: 100%;
      -webkit-transform: skewX(-20deg);
      transform: skewX(-20deg);
      transition: background 0.4s ease 0s;
      background-image: linear-gradient(
        to right,
        transparent,
        rgba(255, 255, 255, 0.25),
        transparent
      );
    }

    &:hover {
      transition-delay: 0.25s;
      background: #2c4349;
      // opacity: 0.8;
      transition: ease-out 0.3s;
    }

    &:hover:after {
      animation: shine 0.75s cubic-bezier(0.01, 0.56, 1, 1);
    }

    ${Container}:hover & {
      background: ${props => (!props.disabled ? '#2C4349' : '#fff')};
      color: ${props => (!props.disabled ? '#fff' : '#aaa')};
    }
  }

  @keyframes shine {
    0% {
      left: 200%;
    }
    100% {
      left: -200%;
    }
  }
`;

const LinkButton = styled(AddBagButton)`
  text-transform: uppercase;
  border: none;
  background: #2c4349;
  color: #fcf8f7;
  &:hover {
    color: #2c4349;
    background: #fcf8f7;
  }
  @media (min-width: 480px) {
    &:hover {
      color: #2c4349;
      background: #fcf8f7;
    }
  }
  ${Container}:hover & {
    color: #fcf8f7;
    background: #2c4349;
    border: 1px solid;
  }
`;

const WaitListButton = styled(AddBagButton)`
  border: none;
  background: #f2f3f4;
  &:hover {
    color: #fcf8f7;
    background: #2c4349;
  }
  @media (min-width: 480px) {
    &:hover {
      color: #fcf8f7;
      background: #2c4349;
    }
  }
  ${Container}:hover & {
    color: #2c4349;
    background: #fcf8f7;
    border: 1px solid;
  }
`;

const OriginalPriceSpan = styled.span`
  margin-left: 8px;
  margin-right: 8px;
  text-decoration-line: line-through;
  position: relative;
  color: #919191;
`;
const DiscountPercentSpan = styled.span`
  position: relative;
  top: -1px;
  border: 1px solid #c83430;
  padding: 4px 8px 4px 4px;
  border-radius: 12.5px;
  font-size: 12px;
`;
<span style={{ position: 'relative', top: '-2px',border: '1px solid #c83430', padding: '0px 8px', borderRadius: '12.5px' }}></span>
export enum DisplayMode {
  ADD,
  WAITLIST,
  LINK,
}

export enum ImageClickMode {
  ADD_TO_BAG,
  GO_TO_PDP,
}

export type ProductItemProps = {
  productItemData: Product;
  landing: any;
  profileData: any;
  isOutOfStock: any;
  id: any;
  isMobileView: any;
  noMarginBottom: any;
  addVariantToCart: Function;
  dispatchSetCartSideBar?: Function;
  dispatchSetUIKeyValue: Function;
  mode: DisplayMode;
  link?: string;
  style?: any;
  from?: string;
  imageClickMode?: ImageClickMode;
  addCtaLabel?: string;
  disabledCtaLabel?: string;
  isDisabled?: boolean;
  hidePrice?: boolean;
};
const ProductItem = ({ mode = DisplayMode.ADD, ...props }: ProductItemProps) => {
  const [openArchiveRequest, setOpenArchiveRequest] = useState(false);

  const {
    productItemData,
    id,
    landing,
    isMobileView,
    noMarginBottom,
    imageClickMode = ImageClickMode.GO_TO_PDP,
    isDisabled = false,
    hidePrice = false,
    addCtaLabel = 'Add To Bag',
    disabledCtaLabel = 'Unavailable',
  } = props;

  const isOutOfStock =
    parseInt(productItemData?.quantity || '0') <= config.soldOutThreshold &&
    !productItemData?.tags?.includes('evergreen');

  const isPreview = inDevelopment(productItemData) && !inProduction(productItemData);

  useEffect(() => {
    showDescriptionById();
  }, []);

  const showDescriptionById = () => {
    if (document.getElementById('product-description'))
      document.getElementById('product-description').style.display = 'none';
  };

  const showDetailHandler = (waitList, event) => {
    if (mode === DisplayMode.WAITLIST || waitList) {
      try {
        event.preventDefault();
      } catch (error) {}
      showJoinWaitListHandler();
      return;
    } else if (mode === DisplayMode.LINK) {
      try {
        event.preventDefault();
      } catch (error) {}
      linkHandler();
      return;
    } else {
      return;
    }
  };

  const addToBagClickHandler = event => {
    const { productItemData, profileData } = props;
    const { productType } = productItemData;
    const profileId = getProfileId(profileData.profiles, productType);

    const variantId = btoa(`gid://shopify/ProductVariant/${productItemData.variantId}`);
    // console.log({productItemData, variantId});
    // const variantId = productItemData && Array.isArray(productItemData.variants) &&
    // productItemData.variants.length > 0 ? productItemData.variants[0].id : '';

    event?.stopPropagation();

    props.addVariantToCart(variantId, 1);
    trackCheckout('[atb]', { from: 'ProductItem', productType });
    trackFunnelActionProjectFunnel(`A. Add Product To Cart`, { profileId, productType });

    if (window['dataLayer']) {
      const gtm = {
        event: 'addToCart',
        content_type: 'product',
        content_ids: [productItemData.variantId],
        product_name: productItemData.name,
        value: productItemData.price,
        currency: 'USD',
      };
      // log.info(gtm);
      window['dataLayer'].push(gtm);
    }

    if (props.dispatchSetCartSideBar) {
      props.dispatchSetCartSideBar(true);
    }
  };

  function linkHandler(event = undefined) {
    const { productItemData, profileData } = props;
    const { productType } = productItemData;
    const profileId = getProfileId(profileData.profiles, productType);

    event?.stopPropagation();
    trackFunnelActionProjectFunnel(`View product`, { profileId, productType });
    Router.push(`/${props.link}`);
  }

  const showJoinWaitListHandler = () => {
    const { productItemData } = props;
    const { nailProductId } = productItemData || {};
    props.dispatchSetUIKeyValue('joinWaitList', {
      productId: nailProductId,
      open: true,
      product: productItemData,
    });
  };

  const { name, images, subtitle, nailProductId, tags, isArchived } = productItemData || {};

  if (!productItemData) return null;

  const price = productItemData?.extraFields?.priceLabel || `$${productItemData?.price}`;
  const compareAtPrice = productItemData?.compareAtPrice;
  const discount = productItemData?.extraFields?.discountLabel || '';

  const closeArchiveRequestHandler = () => {
    setOpenArchiveRequest(false);
  };

  const openArchiveRequestHandler = () => {
    setOpenArchiveRequest(true);
  };

  const from = props.from || (typeof window !== 'undefined' ? Router.pathname : '/');

  const imageQuery = isMobileView ? '&width=1200' : '&width=600';
  const waitList =
    !productItemData?.tags?.includes('evergreen') &&
    productItemData?.extraFields?.waitList?.emailTemplate != undefined &&
    productItemData?.extraFields?.waitList?.enabled === true;
  const originalPrice =
    productItemData?.extraFields?.originalPrice || parseFloat(compareAtPrice) || 0;

  const discountPercent = originalPrice ? +(((productItemData?.price - originalPrice) / originalPrice).toFixed(2))*100 : 0;
  
  const link =
    props.link ||
    `${pageLinks.ProductDetail.url}${productItemData?.shopifyHandle}?${
      landing ? '&landing=' + landing : ''
    }${from ? '&from=' + from : ''}`;
  const isComingSoon = tags?.includes('coming soon');
  const styleOverride = props?.style;

  const linkPathname = `${pageLinks.ProductDetail.url}${productItemData?.shopifyHandle}`;

  const linkPath = {
    pathname: linkPathname,
    query: {
      ...(from && { from }),
      ...(landing && { landing })
    }
  };

  const imageStyle = productItemData?.extraFields?.imageStyle;
  const bundleVideo = productItemData?.extraFields?.bundleVideo;

  return (
    <>
      {bundleVideo && <VideoBundlePanel video={bundleVideo} isMobileView={isMobileView} />}
      <Container
        landing={landing}
        id={id}
        style={{ width: landing && '100%', ...styleOverride }}
        isDisabled={isDisabled}
        noMarginBottom={noMarginBottom}
        mb={3}
        isPreview={isPreview}
      >
        <Badge isOutOfStock={isOutOfStock} isArchived={isArchived} tags={tags} productName={name} />
        {productItemData?.listingTitle && (
          <ListingTitle>{productItemData?.listingTitle}</ListingTitle>
        )}

        <ImageContainer>
          {/* TODO: carousel switch with/without carousel */}
          {imageClickMode === ImageClickMode.GO_TO_PDP ? (
            <Link href={linkPath} >
              <a
                data-testid={
                  isOutOfStock || isDisabled || isPreview ? 'disabled-product-item' : 'product-item'
                }
                className={style.productItem}
                onClick={event => {
                  event.stopPropagation();
                  showDetailHandler(waitList, event);
                }}
              >
                <LazyLoadImage
                  alt={name}
                  threshold={300}
                  height={'100%'}
                  width={'100%'}
                  className={style.productImage}
                  style={imageStyle}
                  effect="blur"
                  src={images?.length > 0 ? `${images[0]}${imageQuery}` : ''}
                />
              </a>
            </Link>
          ) : (
            <div
              className={style.productItem}
              onClick={event => {
                !isDisabled && addToBagClickHandler(null);
              }}
            >
              <LazyLoadImage
                alt={name}
                threshold={300}
                style={imageStyle}
                width={'100%'}
                height={'100%'}
                className={style.productImage}
                effect="blur"
                src={images?.length > 0 ? `${images[0]}${imageQuery}` : ''}
              />
            </div>
          )}
        </ImageContainer>

        <OneLineBox
          fontSize={['12px', '17px', '17px']}
          letterSpacing={['-0.3px', '0px', '1px']}
          fontFamily="avenirBook"
          mt={3}
          onClick={event => {
            if (imageClickMode === ImageClickMode.ADD_TO_BAG) {
              addToBagClickHandler(undefined);
            } else {
              showDetailHandler(waitList, event);
            }
          }}
        >
          {name}
        </OneLineBox>

        {productItemData?.shortDescription && (
          <Box
            textAlign="center"
            fontSize={['12px']}
            fontWeight="400"
            color="#919191"
            height={['73.5px', '53.5px']}
            mb="15px"
            onClick={linkHandler}
          >
            {productItemData.shortDescription}
            {!subtitle && <>&nbsp;</>}
          </Box>
        )}
        {mode !== DisplayMode.LINK && (
          <OneLineBox
            textAlign="center"
            fontSize={['12px', '14px', '14px']}
            fontWeight="400"
            color="#919191"
            py="5px"
            onClick={event => showDetailHandler(waitList, event)}
          >
            {subtitle != 'Plain' ? subtitle : 'ESSENTIALS'}
            {!subtitle && <>&nbsp;</>}
          </OneLineBox>
        )}

        <PriceAddBagBox>
          {!hidePrice && (
            <Box mb="10px" fontSize={['12px', '15px']} color={compareAtPrice ? '#d30047' : ''}>
              <span>{`${price}`}</span>
              {discountPercent !== 0 && <OriginalPriceSpan>${originalPrice}</OriginalPriceSpan>}
              <span style={{ color: '#919191' }}>{discount}</span>
              {discountPercent !== 0 && <DiscountPercentSpan>{discountPercent > 0 && "+"} { `${discountPercent}` + "%"}</DiscountPercentSpan>}
            </Box>
          )}

          {isComingSoon || mode === DisplayMode.WAITLIST || waitList ? (
            <WaitListButton color="forecolor.0" onClick={showJoinWaitListHandler}>
              Join Waitlist
            </WaitListButton>
          ) : isArchived || isOutOfStock ? (
            <WaitListButton color="forecolor.0" onClick={openArchiveRequestHandler}>
              Bring It Back
            </WaitListButton>
          ) : mode === DisplayMode.ADD ? (
            <AddBagButton
              data-testid={
                isOutOfStock || isDisabled || isPreview
                  ? 'disabled-product-item-cta'
                  : 'product-item-cta'
              }
              color="forecolor.0"
              disabled={isOutOfStock || isDisabled || isPreview}
              onClick={addToBagClickHandler}
            >
              {isPreview ? '<PREVIEW>' : isDisabled ? disabledCtaLabel : addCtaLabel}
            </AddBagButton>
          ) : (
            <LinkButton onClick={linkHandler}>{productItemData?.linkLabel}</LinkButton>
          )}
          {productItemData?.extraFields?.ctaDescription && (
            <Box mt="8px" fontSize={['10px', '12px']}>
              {productItemData?.extraFields?.ctaDescription}
            </Box>
          )}
        </PriceAddBagBox>
      </Container>
      {openArchiveRequest && (
        <RequestProductPanel
          productItemData={productItemData}
          onClose={closeArchiveRequestHandler}
        />
      )}
    </>
  );
};
const mapStateToProps = state => ({
  profileData: state.profileData,
});

const mapDispatchToProps = dispatch => ({
  dispatchSetUIKeyValue: (key, value) => dispatch(UI_SET_KEY_VALUE(key, value)),
});

export default memo(connect(mapStateToProps, mapDispatchToProps)(ProductItem)) as any;
