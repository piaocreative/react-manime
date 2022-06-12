import { ManimeApi } from 'api/connections/manimeApi';
import { PaymentApi } from 'api/connections/paymentApi';
import { addShopifyOrder } from 'api/order';
import { getCustomer } from 'api/payment';
import { addReferralToUser, getReferralLink } from 'api/referral';
import { addCredits, retrieveUserData } from 'api/user';
import { sendKlaviyoEmail, sendSlackMessage } from 'api/util';
import config from 'config';
import constants, { giftsWithPurchase } from 'constants/index';
import _ from 'lodash';
import Router from 'next/router';
import pRetry from 'p-retry';
import React from 'react';
import { connect } from 'react-redux';
import { calculateOrderData, convertFloatFixedTwo } from 'utils/calculateOrderData';
import { pageLinks } from 'utils/links';
import log from 'utils/logging';
import { trackFunnelActionProjectFunnel } from 'utils/track';
import { DarkButton } from './basic/buttons';
import DialogWrapper from './basic/dialog';
import ShopifyHOC from './ShopifyHOC';
import Box from './styled/Box';
import { PaymentLoadingButton } from './styled/StandardButton';

class PlaceOrderButton extends React.Component {
  state = {
    enableByToggle: false,
    isFailedDialogOpen: false,
    dialogMessage: null,
  };

  componentDidMount = () => {
    trackFunnelActionProjectFunnel('[PlaceOrderButton] PlaceOrderButton CDM');
  };

  enablePaymentButton = () => {
    this.setState({ enableByToggle: !this.state.enableByToggle });
  };

  sendSlackNotification = () => {
    sendSlackMessage(
      '#alerts-and-warnings',
      `Stripe with no shopify order ${this.props.userData.email}`
    );
  };

  charge = async () => {
    const { mainCartData, userData } = this.props;
    const orderData = calculateOrderData(userData, mainCartData);
    const { totalPrice, credits, newCredits, newTotal, creditsToRedeem } = orderData;
    const checkout = this.props.mainCartData?.cart;

    trackFunnelActionProjectFunnel(`Checkout - Click Place Order`);

    const isDefaultShippingAddress = this.props.isDefaultShippingAddress();
    if (isDefaultShippingAddress) {
      trackFunnelActionProjectFunnel('[PlaceOrderButton] isDefaultShippingAddress! not valid');
      this.props.tabClickHandler(0);
      return;
    }

    const shippingLine = mainCartData?.cart?.shippingLine;
    if (!shippingLine) {
      log.error('[PlaceOrderButton] !shippingLine - no STRIPE no SHOPIFY', {
        mainCartData,
        userData,
      });
      return;
    }

    // NOTE: SOURCE OF TRUTH PRICE
    const priceSourceOfTruth = this.props.redeemed ? newTotal : totalPrice;

    trackFunnelActionProjectFunnel(
      '[PlaceOrderButton] before parseFloat priceSourceOfTruth < 0.60'
    );

    let idempotencyKey = checkout.id + `-${priceSourceOfTruth}`;
    if (priceSourceOfTruth < 0.6) {
      trackFunnelActionProjectFunnel('[PlaceOrderButton] priceSourceOfTruth is less than 0.60');
      this.createOrders(orderData, null, idempotencyKey);
      return;
    }

    // stripeTotal from checkout
    // FIXME:
    // productIdNumber, -> cms needs several by... variantId?

    // variantIdNumber, -> several lineItems.edges
    // shopifyTax tax included? from checkout

    // discountCodes as well

    // SHOPIFY, CMS AND STRIPE NEED THIS DATA
    // STRIPE -> total
    // CMS -> productIdNumber
    // SHOPIFY -> variantIdNumber, totalTax, discountCode
    trackFunnelActionProjectFunnel('[PlaceOrderButton] before await default source object');
    const defaultSourceObject = await this.getDefaultSourceObject();
    if (!defaultSourceObject) {
      // FIXME: default card not found! track
      trackFunnelActionProjectFunnel(
        '[PlaceOrderButton] defaultSourceObject is null! order cancelled'
      );
      return;
    }

    const stripeId = (((this || {}).props || {}).userData || {}).stripeId || '';
    if (
      !stripeId ||
      isNaN(priceSourceOfTruth) ||
      typeof priceSourceOfTruth != 'number' ||
      !checkout
    ) {
      const chargeParams = {
        stripeId,
        priceSourceOfTruth,
      };
      trackFunnelActionProjectFunnel(
        `[PlaceOrderButton] charge params invalid -> (!stripeId || isNaN(priceSourceOfTruth) || typeof priceSourceOfTruth != 'number' || !checkout)`,
        { chargeParams }
      );
      return;
    }

    trackFunnelActionProjectFunnel('[PlaceOrderButton] before userData');
    const concatCheckoutId = checkout.id.length >= 30 ? checkout.id.slice(-30) : checkout.id;
    idempotencyKey =
      concatCheckoutId +
      `-${defaultSourceObject.card.exp_month}${defaultSourceObject.card.exp_year}${defaultSourceObject.card.last4}` +
      `-${priceSourceOfTruth}`;
    let apiBody = {
      customerId: stripeId,
      total: priceSourceOfTruth,
      idempotencyKey,
    };

    const tempCheckout = mainCartData.cart;
    trackFunnelActionProjectFunnel('[PlaceOrderButton] Before PaymentApi API post');
    let paymentSuccess = null;
    try {
      const response = await PaymentApi('post', '/payment/live', apiBody);
      // this.props.setErrorMessage(false, null);
      paymentSuccess = true;
      trackFunnelActionProjectFunnel('[PlaceOrderButton] PaymentApi /payment/live response', {
        response,
      });
      await this.createOrders(orderData, response, idempotencyKey);
    } catch (err) {
      // this.props.setErrorMessage(true, err);
      log.info('[PlaceOrderButton], err =>', err);
      if (!paymentSuccess) {
        this.setState({
          isFailedDialogOpen: true,
          dialogMessage: err.response.data.message,
        });
      }
      log.error(`[PlaceOrderButton][charge] ${err}`, { err, state: this.state });

      this.enablePaymentButton();
    }
  };

  createOrders = async (orderData, stripeResponse, idempotencyKey) => {
    const checkout = this.props?.mainCartData?.cart;

    const gtm = {
      event: 'createOrders',
      ...orderData,
      checkoutId: checkout.id,
      orderTotal: checkout.totalPrice,
      checkout,
      totalOrders: this.props?.userData?.totalOrders || 0,
    };
    log.info('createOrders dataLayer.push gtm', { ...gtm });

    try {
      if (window['dataLayer']) {
        window['dataLayer'].push(gtm);
      }
    } catch (err) {}

    this.referralPoints();
    if (this.props.redeemed) this.redeemPoints(orderData);

    // NOTE: add to totalOrders
    // const totalOrders = this.props.userData.totalOrders && typeof this.props.userData.totalOrders == 'number' ? this.props.userData.totalOrders + 1 : 1;
    // updateUserColumn(this.props.userData.identityId, 'totalOrders', totalOrders);

    const { totalPrice, credits, newCredits, newTotal, creditsToRedeem } = orderData;

    const { lineItems, shippingAddress, totalTax, lineItemsSubtotalPrice, shippingLine } = checkout;
    trackFunnelActionProjectFunnel('[PlaceOrderButton] createOrders param', {
      orderData,
      checkout,
    });

    const firstName = shippingAddress.firstName || '-';
    const lastName = shippingAddress.lastName || '-';
    // const firstName = this.props.userData && this.props.userData.name && this.props.userData.name.firstName
    //   ? this.props.userData.name.firstName : '-';
    // const lastName = this.props.userData && this.props.userData.name && this.props.userData.name.lastName
    //   ? this.props.userData.name.lastName : '-';

    const priceSourceOfTruth = this.props.redeemed ? newTotal : totalPrice;

    trackFunnelActionProjectFunnel('[PlaceOrderButton] POB - 1');

    const maniProfileId = this?.props?.maniProfile?.profileId || '';
    const pediProfileId = this?.props?.pediProfile?.profileId || '';
    const totalOrders = this?.props?.userData?.totalOrders;

    const giftWithPurchaseTitles = giftsWithPurchase.map(gift => gift.productTitle);

    let lineItemsRemoveDefaultItems = { edges: [] };
    lineItems.edges.map(lineItem => {
      const title = ((lineItem || {}).node || {}).title || constants.EMPTY_PRODUCT;
      if (title !== constants.EMPTY_PRODUCT) {
        const isFreeProduct = [...giftWithPurchaseTitles, constants.WELCOME_CARD_TRIFOLD].includes(
          title
        );
        if (!isFreeProduct) {
          const customAttributes = lineItem?.node?.customAttributes || [];
          const productType = lineItem?.node?.variant?.product?.productType || '';
          if (!customAttributes.find(attr => attr.key === 'profileId' && attr.value)) {
            const profileId =
              productType === 'Manis'
                ? maniProfileId
                : productType === 'Pedis'
                ? pediProfileId
                : '';
            customAttributes.pop();
            customAttributes.push({ key: 'profileId', value: profileId, __typename: 'Attribute' });
            lineItem.node.customAttributes = customAttributes;
          }
          lineItemsRemoveDefaultItems.edges.push(lineItem);
        }
      }
    });

    log.info('[TEST lineItemsRemoveDefaultItems] =>', lineItemsRemoveDefaultItems);

    trackFunnelActionProjectFunnel('[PlaceOrderButton] POB - 2');

    if (!shippingLine || !lineItemsSubtotalPrice) {
      let params = {};
      if (shippingLine) params.shippingLine = shippingLine;
      if (lineItemsSubtotalPrice) params.lineItemsSubtotalPrice = lineItemsSubtotalPrice;

      log.error('[PlaceOrderButton] !shippingLine || !lineItemsSubtotalPrice', { params });

      this.sendSlackNotification();
      return;
    }

    trackFunnelActionProjectFunnel('[PlaceOrderButton] POB - 3');

    const lineItemsSubtotalPriceFloat = convertFloatFixedTwo(lineItemsSubtotalPrice.amount);
    const shippingCostFloat = convertFloatFixedTwo(shippingLine.priceV2.amount);
    const totalTaxFloat = convertFloatFixedTwo(totalTax);

    trackFunnelActionProjectFunnel('[PlaceOrderButton] POB - 4');

    if (
      isNaN(lineItemsSubtotalPriceFloat) ||
      isNaN(shippingCostFloat) ||
      isNaN(totalTaxFloat) ||
      isNaN(priceSourceOfTruth) ||
      isNaN(totalPrice)
    ) {
      log.error('[PlaceOrderButton] createOrders params are NaN!');

      this.sendSlackNotification();
      return;
    }

    trackFunnelActionProjectFunnel('[PlaceOrderButton] POB - 5');

    let discountAmount =
      lineItemsSubtotalPriceFloat + totalTaxFloat + shippingCostFloat - totalPrice;
    discountAmount = convertFloatFixedTwo(discountAmount);

    trackFunnelActionProjectFunnel(`[PlaceOrderButton][createOrders] totals calculations`, {
      discountAmount,
      lineItemsSubtotalPriceFloat,
      totalTaxFloat,
      shippingCostFloat,
      totalPrice,
    });

    // log.info(`${typeof discountAmount} = ${typeof lineItemsSubtotalPriceFloat} + ${typeof totalTaxFloat} + ${typeof shippingCostFloat} - ${typeof totalPrice}`);
    // log.info(`${discountAmount} = ${lineItemsSubtotalPriceFloat} + ${totalTaxFloat} + ${shippingCostFloat} - ${totalPrice}`);

    const customAttributes = this.props.mainCartData?.cart?.customAttributes || [];
    let discountName = '-';

    trackFunnelActionProjectFunnel('[PlaceOrderButton] POB - 6');

    customAttributes.map(customAttribute => {
      try {
        trackFunnelActionProjectFunnel(`[PlaceOrderButton][createOrdrs] custom attributes`, {
          key: customAttribute.key,
          value: customAttribute.value,
        });
      } catch (err) {}
      if (customAttribute.key == 'discountName' && customAttribute.value != '') {
        discountName = customAttribute.value;
      }
    });
    try {
      trackFunnelActionProjectFunnel(`[PlaceOrderButton][charge] appliedDiscountCode `, {
        appliedDiscountCode: this.props.checkoutData.appliedDiscountCode,
        discountName,
      });
    } catch (err) {}

    // log.info(customAttributes);
    // log.info(discountName);

    trackFunnelActionProjectFunnel('[PlaceOrderButton] POB - 7');

    const discountCodes = [
      {
        code: discountName,
        amount: `${discountAmount.toFixed(2)}`,
        type: 'fixed_amount',
      },
    ];
    trackFunnelActionProjectFunnel('[PlaceOrderButton][6] discountCodes', { discountCodes });

    trackFunnelActionProjectFunnel('[PlaceOrderButton] POB - 8');

    // FIXME: everything above should have try and error tracking
    // OPTIMIZE:
    let email;
    try {
      email = this.props.userData.email;
      if (!email || email == '') email = `${this.props.userData.identityId}@manime.co`;

      if (lineItemsRemoveDefaultItems)
        trackFunnelActionProjectFunnel('[PlaceOrderButton] lineItemsRemoveDefaultItems successful');
      if (shippingAddress)
        trackFunnelActionProjectFunnel('[PlaceOrderButton] shippingAddress successful');
      if (shippingLine)
        trackFunnelActionProjectFunnel('[PlaceOrderButton] shippingLine successful');
      if (priceSourceOfTruth)
        trackFunnelActionProjectFunnel('[PlaceOrderButton] priceSourceOfTruth successful');
      if (totalTaxFloat)
        trackFunnelActionProjectFunnel('[PlaceOrderButton] totalTaxFloat successful');
      if (email) trackFunnelActionProjectFunnel('[PlaceOrderButton] email successful');
      if (firstName) trackFunnelActionProjectFunnel('[PlaceOrderButton] firstName successful');
      if (lastName) trackFunnelActionProjectFunnel('[PlaceOrderButton] lastName successful');
      if (discountCodes)
        trackFunnelActionProjectFunnel('[PlaceOrderButton] discountCodes successful');

      const noteAttributes = [
        {
          name: 'stripeChargeAmount',
          value: this.props.redeemed ? orderData.newTotal : orderData.totalPrice,
        },
        {
          name: 'credits',
          value: this.props.redeemed ? orderData?.creditsToRedeem : 0,
        },
      ];

      // lineItems, shippingAddress, shippingLine, totalPrice, totalTax, email, firstName, lastName, discountCodes, acceptsMarketing
      const chargeId = (stripeResponse || {}).id;
      const acceptsMarketing = (((this || {}).props || {}).userData || {}).acceptsMarketing
        ? true
        : false;
      const shopifyOrder = await pRetry(
        () =>
          addShopifyOrder(
            lineItemsRemoveDefaultItems,
            shippingAddress,
            shippingLine,
            priceSourceOfTruth,
            totalTaxFloat,
            email,
            firstName,
            lastName,
            discountCodes,
            acceptsMarketing,
            noteAttributes,
            idempotencyKey,
            chargeId,
            undefined,
            undefined,
            lineItemsSubtotalPriceFloat,
          ),
        {
          onFailedAttempt: error => {
            log.verbose(
              `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`
            );
          },
          retries: 10, // 5 calls
          factor: 2,
          minTimeout: 1 * 1000,
          maxTimeout: 5 * 1000,
          randomize: true,
        }
      );

      const gtm2 = {
        event: 'orderComplete',
        checkoutId: checkout.id,
        orderTotal: checkout.totalPrice,
        orderLineItems: lineItemsRemoveDefaultItems,
        discountCodes,
        orderData,
        totalOrders: this.props?.userData?.totalOrders || 0,
        shopifyOrderId: shopifyOrder?.id,
        shopifyOrderNumber: shopifyOrder?.order_number,
      };
      log.info('PlaceOrderButton BEFORE orderComplete gtm');
      log.info({
        shopifyOrder,
        lineItemsRemoveDefaultItems,
        gtm,
        checkout,
        discountCodes,
        orderData,
      });

      const products = lineItemsRemoveDefaultItems.edges.map(item => ({
        name: item.node?.title,
        id: item.node?.variant?.id,
        price: item.node?.variant?.price,
        brand: 'N/A',
        category: item.node?.variant?.product?.productType,
        variant: item.node?.variant?.title,
        quantity: item.node?.quantity,
      }));
      if (shopifyOrder?.total_discounts_set?.shop_money?.amount) {
        products.push({
          name: `Discount`,
          id: discountCodes,
          price: (parseFloat(shopifyOrder?.total_discounts_set?.shop_money?.amount) * -1).toFixed(
            2
          ),
          brand: 'N/A',
          category: 'Discounts',
          variant: 'N/A',
          quantity: 1,
        });
      }

      const gtmEE = {
        ecommerce: {
          purchase: {
            actionField: {
              id: shopifyOrder?.order_number,
              affiliation: 'Online Store',
              revenue: shopifyOrder?.total_price || checkout?.totalPrice,
              tax: shopifyOrder?.total_tax || checkout.totalTax,
              shipping:
                shopifyOrder?.total_shipping_price_set?.shop_money?.amount ||
                checkout?.shippingLine?.priceV2?.amount,
              coupon:
                (shopifyOrder?.discountCodes?.length > 0 && shopifyOrder.discountCodes[0].code) ||
                (discountCodes?.length > 0 ? discountCodes[0].code : '?'),
            },
            products: products,
          },
        },
      };
      try {
        if (window['dataLayer']) {
          window['dataLayer'].push(gtm2);
          window['dataLayer'].push(gtmEE);
        } else {
          log.info(
            'PlaceOrderButton BEFORE orderComplete NO DATALAYER',
            _.cloneDeep({ shopifyOrder, lineItemsRemoveDefaultItems })
          );
        }
      } catch (err) {
        log.error('Something happened in createOrders', err.message);
      }

      trackFunnelActionProjectFunnel('[PlaceOrderButton] POB - 9');
      const shopifyOrderParams = {
        lineItemsRemoveDefaultItems,
        shippingAddress,
        shippingLine,
        totalPriceFloat: priceSourceOfTruth,
        totalTaxFloat,
        email,
        firstName,
        lastName,
        discountCodes,
      };
      log.info('shopifyOrderParams', shopifyOrderParams);
      log.info('shopifyOrder', shopifyOrder);
      log.info('checkout', checkout);
      trackFunnelActionProjectFunnel('[PlaceOrderButton] addShopifyOrder params', {
        shopifyOrderParams,
      });
    } catch (err) {
      // const params = { lineItemsRemoveDefaultItems, shippingAddress, shippingLine, totalPriceFloat: priceSourceOfTruth, totalTaxFloat, email, firstName, lastName, discountCodes };

      log.error('[PlaceOrderButton][createOrders] line 460' + err, { err });

      const params = {
        lineItemsRemoveDefaultItems,
        shippingAddress,
        shippingLine,
        totalPriceFloat: priceSourceOfTruth,
        totalTaxFloat,
        email,
        firstName,
        lastName,
        discountCodes,
      };
      log.error(`[PlaceOrderButton] createOrders() params ${err}`, { err, params });
      this.sendSlackNotification();
    }

    Router.push(pageLinks.SetupConfirmation.url);
    // this.storeOrders();
    // NOTE: remove this try below when we have user data subscribed to state, totalOrders needs to be updated from back end otherwise they get multiple welcome cards
    try {
      this.props.dispatchSetKeyValue(
        'totalOrders',
        this.props.userData.totalOrders ? (this.props.userData.totalOrders += 1) : 1
      );
    } catch (err) {
      log.error('[ERROR][PlaceOrderButton] error setting total orders ' + err, {
        err,
        totalOrders: this.props?.userData?.totalOrders,
      });
    }
  };

  // Get customer default source and map through sources to get default source object
  getDefaultSourceObject = async () => {
    let default_source_object;
    try {
      const customer = await getCustomer(this.props.userData.stripeId);
      const { default_source, sources } = customer;
      sources.data.map(source => {
        if ((source.id = default_source)) default_source_object = source;
      });
      if (!default_source_object) throw new Error('default source object null!');
    } catch (err) {
      // FIXME: CRITICAL ERROR PAYMENT NOT FOUND
      this.enablePaymentButton();
      log.error(`[PlaceOrderButton] could not get customer or default source not found ${err}`, {
        err,
      });
    } finally {
    }
    return default_source_object;
  };

  referralPoints = async () => {
    const referralId = (((this || {}).props || {}).userData || {}).referralId;
    const userId = (((this || {}).props || {}).userData || {}).identityId || '';

    if (userId == '') {
      log.error('[PlaceOrderButton] referralPoints userId null');
      return;
    }

    if (!referralId) {
      trackFunnelActionProjectFunnel('[PlaceOrderButton] referralPoints referralId null');
      return;
    }

    try {
      const result = await ManimeApi('get', `/grouporders/cms/read?filter=userid eq ${userId}`);
      log.info('/grouporders/cms/read', result);
      if (result && Array.isArray(result) && result.length > 0) return;
    } catch (err) {
      log.error(`[PlaceOrderButton] grouporders read by userid ${err}`, { err });
    }

    try {
      const referral = await getReferralLink(referralId);
      const sourceId =
        Array.isArray(referral) && referral.length > 0 ? referral[0].sourceId : undefined;
      const promotionId =
        Array.isArray(referral) && referral.length > 0 ? referral[0].promotionId : undefined;

      trackFunnelActionProjectFunnel('[PlaceOrderButton] referralPoints params', {
        referral,
        userId,
        sourceId,
      });
      if (!sourceId) throw new Error('sourceId was invalid');
      const referrerUser = await retrieveUserData(sourceId);
      const referrerFirstName = referrerUser.firstName;
      const referrerEmail = referrerUser.email;

      addReferralToUser(referralId, sourceId, userId);
      // add 50 points to referring user
      if (promotionId !== 'defaultPromotion') return;
      addCredits(
        sourceId,
        constants.referral.NORMAL_REFERRER_CREDIT,
        `Referred ${this.props.userData.email}`,
        'Referral - Referrer',
        'Referral - Referrer'
      );

      sendKlaviyoEmail({
        templateId: config.klaviyoTemplate.referrer,
        subject: `You’ve got ManiMoney!`,
        user: { email: referrerEmail, name: referrerFirstName },
        context: {
          name: referrerFirstName,
          friend_name: this.props.userData.name.firstName,
        },
      });
    } catch (err) {
      log.error(`[PlaceOrderButton] referralPoints try ${err}`, { err });
    }
  };

  redeemPoints = orderData => {
    try {
      const { newCredits, creditsToRedeem } = orderData;
      // NOTE: we are now redeeming via shopify hook
      // redeemCredits(this.props.userData.identityId, creditsToRedeem);
      this.props.dispatchSetKeyValue('credits', newCredits);
    } catch (err) {
      log.error('[PlaceOrderButton] redeemPoints', { err });
    }
  };

  onCloseDialog = () => {
    this.setState({
      isFailedDialogOpen: false,
      dialogMessage: '',
    });
  };

  render() {
    const { disabled } = this.props;
    return (
      <Box width={1} display="flex" justifyContent="center">
        <PaymentLoadingButton
          disabled={disabled}
          fontFamily="Avenir"
          onClick={this.charge}
          enableByToggle={this.state.enableByToggle}
          border="1px solid #fa6a00"
          fontSize={['12px', '14px']}
          height="40px"
          width="100%"
          px={['4px', '20px']}
        >
          PLACE ORDER
        </PaymentLoadingButton>
        {this.state.isFailedDialogOpen && (
          <DialogWrapper onClose={this.onCloseDialog}>
            <Box zIndex={200} background={'#fff'} p={'20px'} width={['300px', '360px']}>
              <Box mb={3} fontSize="18px" fontFamily="avenirHeavy" textAlign="center">
                Oops. Your payment <br /> was not processed.
              </Box>
              <Box
                mb={3}
                textAlign="center"
                maxWidth={['230px', '260px']}
                mx="auto"
                fontSize={['14px', '16px']}
              >
                {this.state.dialogMessage ||
                  'Check your card’s expiration date or use a different payment method. '}
              </Box>
              <Box mb={'20px'} textAlign="center" color="forecolor.1" fontSize={['13px', '14px']}>
                For any questions reach out to care@manime.co
              </Box>
              <DarkButton onClick={this.onCloseDialog} style={{ width: '100%' }}>
                OK
              </DarkButton>
            </Box>
          </DialogWrapper>
        )}
      </Box>
    );
  }
}

const mapStateToProps = state => ({
  userData: state.userData,
  maniProfile: state.profileData.profiles.find(profile => profile.profileType === 'Manis') || {},
  pediProfile: state.profileData.profiles.find(profile => profile.profileType === 'Pedis') || {},
});

export default connect(mapStateToProps)(ShopifyHOC(PlaceOrderButton));
