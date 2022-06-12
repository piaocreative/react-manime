import { builder, BuilderComponent } from '@builder.io/react';
import { SET_CART_SIDEBAR, UPDATE_PRODUCTS_MAP } from 'actions';
import { AvailableCarts } from 'actions/cart';
import { getLiveProducts } from 'api/product';
import BagLogo from 'components/BagLogo';
import HappinessGuarantee from 'components/cart/HappinessGuarantee';
import RedeemManiMoney_V1 from 'components/cart/RedeemManiMoney';
import RedeemManiMoney_V2 from 'components/cart/RedeemManiMoney_V2';
import WarningIcon from 'components/icons/Warning';
import LineItem from 'components/LineItem';
import RedeemBox from 'components/RedeemBox';
import Box from 'components/styled/Box';
import {
  StandardOutlinedButton,
  StyledStandardDarkButton,
} from 'components/styled/StyledComponents';
//import { useSpring, animated } from 'react-spring'
import config from 'config';
import constants, {
  giftsWithPurchase,
  EMPTY_PRODUCT_TITLE,
  giftMaxTopCoatNo2,
} from 'constants/index';
import { motion, useAnimation } from 'framer-motion';
import useCartFunctions from 'hooks/useCartFunctions';
import useGetAllNailProductsMap from 'hooks/useGetAllNailProductsMap';
import { BUILDER_API_KEY, resolveBuilderContent } from 'lib/builder';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Product } from 'types';
import { convertFloatFixedTwo } from 'utils/calculateOrderData';
import {
  checkIsDiscountApplied,
  checkManiBag,
  getAppliedDiscountCode,
  isHiddenTitle,
} from 'utils/cartUtils';
import { pageLinks } from 'utils/links';
import log from 'utils/logging';
import { decimalFormat } from 'utils/math';
import { trackCheckout, trackFunnelActionProjectFunnel } from 'utils/track';

builder.init(BUILDER_API_KEY);

const TopBox = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
  padding: 8px 16px;
  height: calc(var(--vh, 1vh) * 100 - 260px);

  @media (min-width: 480px) {
    padding: 8px 32px;
    height: calc(var(--vh, 1vh) * 100 - 300px);
  }
`;

const TitleBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  color: #f7bfa0;
  letter-spacing: 2px;
  padding: 0 6px 8px 8px;
  border-bottom: 1px solid #2c4349;
  text-align: center;
`;

const CartImg = styled.img`
  height: 100px;
  width: 100px;
  object-fit: cover;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.15);
`;

const ColorLink = styled(Box)`
  text-decoration: underline;
  color: #f7bfa0;
  cursor: pointer;
`;

const SignInLink = styled.span`
  color: #999;
  text-decoration: underline;
  cursor: pointer;
`;

const ContinueButton = styled(StandardOutlinedButton)`
  letter-spacing: 1px;
  text-decoration: underline;
`;

type CartContentProps = {
  mainCartData: any;
  userData: any;
  profileData: any;
  groupGiftData: any;
  uiData: any;
  discountResponse: any;
  dispatchSetCartSideBar: Function;
  dispatchUpdateProductMap: Function;
  emptyCart: Function;
};

const CartContent = (props: CartContentProps) => {
  const cartFunctions = useCartFunctions();
  const warningColor = '#ED7658';

  const controls = useAnimation();
  const closeHandler = () => {
    props.dispatchSetCartSideBar(false);
  };

  const continueShoppingHandler = () => {
    closeHandler();
    Router.push(pageLinks.SetupDesign.url);
  };

  const [state, setState] = useState<{
    totalPrice: any;
    total: any;
    lineItemsSubtotalPrice: any;
    edges: any;
    variantIds: any;
    discountCode: any;
    hasOutOfStock: boolean;
    isNewCheckoutFlow: boolean;
  }>({} as any);

  const [animate, toggle] = useState(true);
  //const { x } = useSpring({ from: { x: 0 }, x: animate ? 1 : 0, config: { duration: 300 } })
  const [cartPromo, setCartPromo] = useState(null);

  const THRESHOLD = config.soldOutThreshold;

  const { isLoading, error, result: nailProducts } = useGetAllNailProductsMap();

  const giftWithPurchaseTitles = giftsWithPurchase.map(gift => gift.productTitle);

  /**
   * does real time check of invetory levels for the product ids and returns false IFF
   * any product is OOS
   * @param productIds
   */
  function checkOutOfStock(products: Product[], edges): boolean {
    const quantityByVariant = {};
    edges.forEach(edge => {
      if (
        !edge ||
        !edge?.node?.title ||
        !edge?.node?.variant?.id ||
        isHiddenTitle(edge.node.title) ||
        giftWithPurchaseTitles.includes(edge.node.title) //TODO Do we check for stock on free gifts?
      ) {
        return;
      }
      const variantId = atob(edge.node.variant.id).replace('gid://shopify/ProductVariant/', '');
      quantityByVariant[variantId] = parseInt(edge?.node?.quantity || 0);
    });
    const oos = products.some(product => {
      return (
        parseInt(product?.quantity || '0') - (quantityByVariant?.[product?.variantId] || 0) <=
        THRESHOLD
      );
    });
    return oos;
  }

  const goCheckout = async () => {
    const updatedProducts: Product[] = await getLiveProducts(state.variantIds);
    const map = {};
    updatedProducts.forEach(product => {
      map[product.variantId] = product;
    });

    props.dispatchUpdateProductMap(map);

    try {
      const oos = checkOutOfStock(updatedProducts, state.edges);

      log.verbose('can proceed', { oos });

      if (oos) {
        controls.start({
          x: [5, -5, 5, -5, 0],
          backgroundColor: '#f00',
          transition: { duration: 0.5 },
        });

        setState({ ...state, hasOutOfStock: true });
        // toggle(!animate ) for react-spring
        return;
      }
    } catch (err) {
      log.error('Cannot check stock so aborting checkout', err);
      return;
    }

    trackFunnelActionProjectFunnel('[action] Go To Checkout Button');

    const { userData, mainCartData } = props;
    const isAuth = (userData || {}).isAuth || undefined;

    let nextPath = pageLinks.Checkout.url;
    const { hasItems } = checkManiBag(mainCartData?.cart);

    const email = userData.email;
    let nextPage = '';

    if (!hasItems) {
      nextPage = pageLinks.SetupDesign.url;
    } else {
      nextPage = pageLinks.Checkout.url;
    }

    if (window['dataLayer']) {
      const edges = mainCartData?.cart?.lineItems.edges;

      let purchaseEdges = edges.filter(
        edge => (edge?.node?.title || EMPTY_PRODUCT_TITLE) !== EMPTY_PRODUCT_TITLE
      );

      const productHashes = purchaseEdges.map(edge => atob(edge?.node?.variant?.id || ''));
      const productIds = productHashes.map(hash => hash.slice(hash.lastIndexOf('/') + 1));
      const gtm = {
        event: 'initiateCheckout',
        content_type: 'product',
        content_ids: productIds,
        num_items: purchaseEdges.length || 0,
        value: purchaseEdges.reduce(
          (acc, cur) => acc + parseFloat(cur.node.variant.price) * cur.node.quantity,
          0
        ),
        currency: 'USD',
      };
      // log.info({at: "initiateCheckout event", gtm});
      window['dataLayer'].push(gtm);
    }

    trackCheckout('[clickCheckout]', { from: 'CartContent', to: nextPage });

    props.dispatchSetCartSideBar(false);

    Router.push(nextPage);
  };

  const navToGalleryHandler = () => {
    props.dispatchSetCartSideBar(false);
    Router.push(pageLinks.SetupDesign.url);
  };

  const signInClickHandler = () => {
    const currentPage = Router?.asPath || '//';

    if (currentPage.indexOf(pageLinks.Auth.url) > -1) {
      return;
    }

    Router.push(`${pageLinks.SignUp.url}?currentPage=${currentPage}`);
    props.dispatchSetCartSideBar(false);
  };

  const { mainCartData } = props;

  useEffect(() => {
    async function fetchCartPromo() {
      const newCartPromo = await resolveBuilderContent('cart-promotion', { zoneName: 'cart-top' });
      setCartPromo(newCartPromo);
    }

    fetchCartPromo();
    setState(prevState => ({ ...prevState, isNewCheckoutFlow: true }));
  }, []);

  useEffect(() => {
    let edges = [];
    let checkout = null;
    edges = mainCartData?.cart?.lineItems?.edges || [];
    checkout = mainCartData?.cart;

    let variantIds = [];
    edges &&
      Array.isArray(edges) &&
      edges.forEach(edge => {
        if (!isHiddenTitle(edge?.node?.title)) {
          if (!edge?.node?.variant?.id) return;
          const variantId = atob(edge.node.variant.id).replace('gid://shopify/ProductVariant/', '');

          variantIds.push(variantId);
        }
      });

    log.verbose('productIds are', { variantIds });

    const totalPrice = checkout && checkout.totalPrice ? checkout.totalPrice : 0;
    const total = checkout && checkout.subtotalPrice ? checkout.subtotalPrice : 0;

    const lineItemsSubtotalPrice = parseFloat(
      ((checkout || {}).lineItemsSubtotalPrice || {}).amount || 0
    );
    let discountCode = '';

    // FIXME: let's not do this here
    if (
      checkout &&
      Array.isArray(checkout.customAttributes) &&
      checkout.customAttributes.length > 0
    ) {
      checkout.customAttributes.map(customAttribute => {
        if (customAttribute.key == 'discountName') discountCode = customAttribute.value;
      });
    }

    setState(prevState => ({
      ...prevState,
      totalPrice,
      total,
      lineItemsSubtotalPrice,
      edges,
      variantIds,
      discountCode,
      hasOutOfStock: false,
    }));
  }, [mainCartData]);

  useEffect(() => {
    if (state.edges && Object.entries(nailProducts).length > 0) {
      const newLineItems = [];
      let hasOutOfStock = false;
      // things not to display in cart
      state.edges.forEach(edge => {
        if (!edge || !edge.node || isHiddenTitle(edge?.node?.title)) return;

        if (!edge?.node?.variant?.id) return;
        const variantId = atob(edge.node.variant.id).replace('gid://shopify/ProductVariant/', '');
        let cartProduct = nailProducts[variantId];
        const node = { ...edge.node };
        node.inventory = cartProduct ? cartProduct.quantity : 0;
        if (!constants?.notEditableInCart?.includes(edge?.node?.title)) {
          hasOutOfStock = node.inventory - node.quantity <= THRESHOLD || hasOutOfStock;
        }
        newLineItems.push({ node: node });
      });

      setState(state => {
        const newState = { ...state };
        newState.edges = newLineItems;
        newState.hasOutOfStock = hasOutOfStock;
        return newState;
      });
    }
    log.verbose('getting nail products');
  }, [state.variantIds, nailProducts]);

  const isAuth = (props.userData || {}).isAuth || false;
  const credits = isAuth ? (props.userData || {}).credits || 0 : 0;

  const { countOfProducts: quantity } = checkManiBag(
    mainCartData.cart,
    props?.userData?.totalOrders
  );

  function removeDiscountHandler() {
    cartFunctions.removeDiscountCode();
  }
  let line_items = state?.edges?.map(edge => {
    if (isHiddenTitle(edge.node.title)) return;
    return (
      <LineItem
        isCart
        removeLineItemInCart={cartFunctions.removeLineItemInCart}
        updateLineItemInCart={cartFunctions.updateLineItemInCart}
        key={edge.node.id.toString()}
        line_item={edge.node}
        inventory={edge.node.inventory}
        notEditable={
          constants?.notEditableInCart?.includes(edge.node.title) ||
          giftWithPurchaseTitles.includes(edge.node.title)
        }
      />
    );
  });

  const totalFloat = convertFloatFixedTwo(state.total);
  const totalCost = typeof totalFloat == 'number' ? decimalFormat(totalFloat) : '';

  const RedeemManiMoney = state.isNewCheckoutFlow ? RedeemManiMoney_V2 : RedeemManiMoney_V1;

  const isDiscountApplied = checkIsDiscountApplied(mainCartData?.cart);
  const code = getAppliedDiscountCode(mainCartData?.cart);

  function emptyCart() {
    // console.log('calling empty cart in page');
    cartFunctions.emptyCart(AvailableCarts.MainCart);
  }

  return (
    <>
      <TopBox>
        <div style={{ display: 'none' }} onClick={emptyCart} data-testid="empty-cart-button"></div>
        <Box>
          <TitleBox>
            <BagLogo quantity={quantity} location="cart" />
            <Box fontFamily="avenirHeavy" data-testid="mani-bag">
              MY MANIBAG
            </Box>

            <Box
              fontSize="40px"
              onClick={closeHandler}
              style={{ cursor: 'pointer' }}
              data-testid="close-bag"
            >
              ×
            </Box>
          </TitleBox>
          {state.hasOutOfStock && (
            <motion.div animate={controls}>
              <Box
                background={warningColor}
                px={1}
                py={2}
                mt={3}
                display={'flex'}
                alignItems={'center'}
              >
                <WarningIcon color={'white'} />
                <Box
                  color={'white'}
                  fontFamily={'AvenirBook'}
                  style={{ flexShrink: 10 }}
                  px={2}
                  fontSize={'11px'}
                >
                  Sorry, some items are not in stock. Please remove them and try again. We apologize
                  for any inconvenience caused.{' '}
                </Box>
              </Box>
            </motion.div>
          )}
          {<BuilderComponent model="cart-promo" content={cartPromo} />}
          {code === 'IPSYGLAM' && isDiscountApplied && (
            <LineItem
              isCart
              notEditable
              freeItem
              removeLineItemInCart={cartFunctions.removeLineItemInCart}
              updateLineItemInCart={cartFunctions.updateLineItemInCart}
              key="topCoat"
              line_item={giftMaxTopCoatNo2}
            />
          )}

          {line_items}
        </Box>

        <Box mt="24px" fontSize="14px">
          <HappinessGuarantee dispatchSetCartSideBar={props.dispatchSetCartSideBar} />
          <Box display="flex" justifyContent="space-between" mt="24px" mb={2}>
            <Box>Bag Items</Box>
            <Box>
              <span>$</span>
              <span>{decimalFormat(state.lineItemsSubtotalPrice)}</span>
            </Box>
          </Box>
          {state.lineItemsSubtotalPrice > totalFloat && (
            <Box display="flex" justifyContent="space-between">
              <Box flex="5" display="flex" justifyContent="space-between">
                <Box>Promo {state.discountCode && `"${state.discountCode}"`}</Box>
                <Box marginRight="15">
                  <a
                    href="#"
                    style={{ textDecoration: 'underline' }}
                    onClick={removeDiscountHandler}
                  >
                    [Remove]
                  </a>
                </Box>
              </Box>
              <Box flex="1" textAlign="right">
                -${decimalFormat(state.lineItemsSubtotalPrice - totalFloat)}
              </Box>
            </Box>
          )}
          <Box display="flex" justifyContent="space-between" mb="10px">
            <Box>Tax (calculated in checkout)</Box>
            <Box>&ndash;&ndash;&ndash;</Box>
          </Box>
          <Box display="flex" justifyContent="space-between" mb="10px">
            <Box>Shipping (calculated in checkout)</Box>
            <Box>&ndash;&ndash;&ndash;</Box>
          </Box>
          <Box fontFamily="avenirHeavy" fontSize="12px">
            Free shipping on orders over $30
          </Box>
        </Box>
      </TopBox>
      <Box
        position="absolute"
        width={1}
        bottom={0}
        p={['16px 16px', '16px 32px']}
        background="#fff"
        boxShadow="0px -10px 10px 0px rgba(0,0,0,0.1)"
      >
        <Box fontSize="14px">
          <RedeemBox />
          {!isAuth && (
            <>
              <Box height={25}> </Box>
              <Box fontSize="14px" color="silver" mt="8px">
                <SignInLink onClick={signInClickHandler}>Sign in</SignInLink> to apply gift card or
                discount code
              </Box>
            </>
          )}
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          mt={3}
          fontWeight="600"
          fontSize={['14px', '16px']}
        >
          <Box fontFamily="avenirHeavy">Subtotal</Box>
          <Box fontFamily="avenirHeavy">${totalCost}</Box>
        </Box>

        {false && state.lineItemsSubtotalPrice > totalFloat && (
          <Box display="flex" justifyContent="space-between" mt={3} mb={2} fontWeight="600">
            <Box>Estimated Total </Box>
            <Box>${decimalFormat(state.totalPrice)}</Box>
          </Box>
        )}
        <RedeemManiMoney isAuth={isAuth} hideButton credits={credits || 0} />
        <StyledStandardDarkButton width={1} fontSize="14px" onClick={goCheckout}>
          CHECKOUT
        </StyledStandardDarkButton>

        <ContinueButton
          display={['none', 'flex']}
          width={1}
          height="20px"
          fontSize="12px"
          border="none"
          color="forecolor.0"
          mt="10px"
          onClick={continueShoppingHandler}
        >
          {'CONTINUE SHOPPING '}
          {/* <ArrowImg src='/static/icons/arrow-down-icon.svg' alt='arrow-down' /> */}
        </ContinueButton>
        <Box
          fontSize={['12px', '13px']}
          textAlign="center"
          letterSpacing={['-0.4px']}
          pt={['16px', '6px']}
        ></Box>
      </Box>
    </>
  );
};

const mapStateToProps = state => ({
  userData: state.userData,
  profileData: state.profileData,
  mainCartData: state.mainCartData,
  uiData: state.uiData,
  discountResponse: state.mainCartData.discountResponse,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetCartSideBar: isOpen => dispatch(SET_CART_SIDEBAR(isOpen)),
  dispatchUpdateProductMap: productMap => dispatch(UPDATE_PRODUCTS_MAP(productMap)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CartContent);
