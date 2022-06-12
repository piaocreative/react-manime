import { AvailableCarts } from 'actions/cart';
import { autoApplyShippingLine } from 'api/cart';
import { PaymentApi } from 'api/connections/paymentApi';
import { addShopifyOrder } from 'api/order';
import pRetry from 'p-retry';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Address, Product } from 'types';
import { convertFloatFixedTwo } from 'utils/calculateOrderData';
import log from 'utils/logging';
import { track } from 'utils/track';
import Box from '../../styled/Box';
import CreditCardForm from './CreditCardForm';
import { GiftMessageForm } from './GiftMessage';

const ErrorMessage = styled(Box)`
  font-style: italic;
`;

type PlaceOrderProps = {
  address?: Address;
  product: Product;
  giftMessage?: GiftMessageForm;
  checkoutId: string;
  onDataChange: any;
};

const TitleLabel = styled(Box)`
  font-size: 16px;
  margin-bottom: 12px;
  width: 100%;
  color: #2c4349;
  font-family: AvenirHeavy;
  font-size: 14px;
  text-transform: uppercase;
`;
type PlaceOrderState = any;
const PlaceOrderButton = (props: PlaceOrderProps) => {
  const { address, ...rest } = props;
  const profileData = useSelector((state: any) => state.profileData);
  const userData = useSelector((state: any) => state.userData);
  const [isProcessing, setIsProcessing] = useState(false);

  const [timeoutKey, setTimeoutKey] = useState();

  const [error, setError] = useState('');

  function wrappedIsProcessing(state) {
    if (state) {
      setError('');
      if (timeoutKey) clearTimeout(timeoutKey);

      const timeout = setTimeout(() => {
        if (isProcessing)
          log.fatal('Gifting PlaceOrder timed out, unknown error', {
            address,
            giftMessage: props.giftMessage,
          });
      }, 7000);
    } else {
      setTimeoutKey(undefined);
      clearTimeout(timeoutKey);
    }
    setIsProcessing(state);
  }

  async function handleCreditCard(source: any) {
    let checkoutResult,
      chargeId,
      createOrderResult = undefined;
    try {
      log.verbose('handling credit card', source);
      if (source.error) {
        throw source.error;
      }

      if (source?.id === undefined)
        throw {
          source: 'SYSTEM',
          reason: 'Stripe Source not created, could not complete checkout.',
        };

      //checkoutResult = await getCheckout(props.checkoutId);
      checkoutResult = await autoApplyShippingLine(
        props.checkoutId,
        AvailableCarts.MainCart,
        'PlaceOrderButton'
      );
      log.verbose('query after result ', checkoutResult);

      /// create idempotency key
      const idempotencyKey = `sourceId_${source.id}`;
      const description = `Gift for ${props.giftMessage.toName}`;
      chargeId = await charge(checkoutResult, description, source, idempotencyKey);
      log.verbose('result of charge is ', chargeId);

      if (chargeId) {
        createOrderResult = await createOrders(
          checkoutResult,
          props.giftMessage,
          chargeId,
          idempotencyKey
        );

        props.onDataChange(chargeId);
      } else {
        throw {
          source: 'SYSTEM',
          reason: 'Stripe Charge not created. Could not complete checkout. ',
        };
      }
    } catch (err) {
      const myError = err;

      //      log.error("Caught an error in Gifting Place Order")
      //    log.error("Gifting PlaceOrderButton.handleCreditCard could not create", err)

      let displayMessage = JSON.stringify(err);
      let logMessage = '[Gifting][PlaceOrderButton][handleCreditCard]: Error placing order ';
      let path = undefined;
      let fatal = false;
      if (chargeId && !createOrderResult) {
        fatal = true;
        displayMessage =
          'Your order needs assistance from our care team, who will complete your order soon. Your payment was successfully processed. Please write to care@manime.co with any questions.';
        logMessage = '[Gifting][PlaceOrderButton][handleCreditCard]: Charge made, no order placed ';
        err.nestedMessage =
          'Charged customer but unable to create a shopify order. Please revert the charge ASAP.';
      } else if (err.isAxiosError) {
        // these are from
        try {
          displayMessage = `${err.response.data.prefix} ${err.response.data.message} ${err.response.data.suffix}`;
          path = myError.config.url;
        } catch (innerErr) {
          displayMessage =
            'Check your card information and try again, or use a different payment method.';
        }
      } else if (err.message) {
        displayMessage = err.message;
      } else if (err.source === 'SYSTEM') {
        displayMessage =
          'Oops, we had system errors placing your order. Please refresh and try again. If the problem persists please contact us at care@manime.co';
        fatal = err.fatal ? true : false;
      }

      setError(displayMessage);
      if (fatal)
        log.fatal(logMessage, {
          err,
          source,
          checkoutResult,
          chargeResult: chargeId,
          path,
          giftMessage: props.giftMessage,
        });
      else
        log.error(logMessage, {
          err,
          source,
          checkoutResult,
          chargeResult: chargeId,
          path,
          giftMessage: props.giftMessage,
        });
    } finally {
      setIsProcessing(false);
    }
  }

  async function charge(
    checkout,
    description,
    source: any,
    idempotencyKey: string
  ): Promise<{ chargeId?: string; error?: { message: any } }> {
    // save checkout data to ddb.
    /* const internalSavePromise = axios.post(
      config.endpoints.saveCheckout,
      { "id": `${checkout.id}`, "mainCartData": JSON.stringify(checkout) },
      { headers: { 'Content-Type': 'application/json' } }
    ) */

    const shippingLine = checkout.shippingLine;
    if (!shippingLine) {
      const error = new Error('[PlaceOrderButton][charge] no shipping line');
      error['source'] = 'Gifting PlaceOrderButton.charge - no STRIPE no SHOPIFY';
      throw error;
    }

    const stripeId = (userData.stripeId || '').trim();

    let apiBody = {
      total: checkout.totalPrice,
      idempotencyKey,
      description,
      source,
    };
    if (stripeId !== '') {
      apiBody['customerId'] = stripeId;
    }

    let paymentSuccess = null;

    const response = await PaymentApi('post', '/payment/charge/source', apiBody);
    log.verbose('response is ', response);
    if (!response.id) {
      const error = new Error('Gifting Create Charge could not find charge id');
      error['source'] = 'SYSTEM';
      error['reason'] = 'Gifting CreateCharge could not find charge id';
      error['response'] = response;
      throw error;
    }

    // this.props.setErrorMessage(false, null);
    log.verbose('response from creating charge: ', response);

    return response.id;
  }

  async function createOrders(
    checkout: any,
    giftMessage: any,
    chargeId: string,
    idempotencyKey: string
  ) {
    const {
      lineItems,
      shippingAddress,
      totalTax,
      lineItemsSubtotalPrice,
      shippingLine,
      totalPrice,
      note,
    } = checkout;

    const firstName = giftMessage.toName.split(' ')[0];
    const lastName = giftMessage.toName.split(' ')[1];

    const priceSourceOfTruth = totalPrice;

    let lineItemsRemoveDefaultItems = { edges: [] };

    log.info('[TEST lineItemsRemoveDefaultItems] =>', lineItemsRemoveDefaultItems);

    if (!shippingLine || !lineItemsSubtotalPrice) {
      let params: any = {};
      if (shippingLine) params.shippingLine = shippingLine;
      if (lineItemsSubtotalPrice) params.lineItemsSubtotalPrice = lineItemsSubtotalPrice;

      log.error('createOrders addShopifyOrder params INVALID!');
      throw {
        source:
          'PlaceOrderButton.createOrder checkout has no shipping line or subtotal, critical error',
      };
      return;
    }

    const lineItemsSubtotalPriceFloat = convertFloatFixedTwo(lineItemsSubtotalPrice.amount);
    const shippingCostFloat = convertFloatFixedTwo(shippingLine.priceV2.amount);
    const totalTaxFloat = convertFloatFixedTwo(totalTax);

    if (
      isNaN(lineItemsSubtotalPriceFloat) ||
      isNaN(shippingCostFloat) ||
      isNaN(totalTaxFloat) ||
      isNaN(priceSourceOfTruth) ||
      isNaN(totalPrice)
    ) {
      log.error('createOrders params are NaN!');
      throw {
        source: 'Gifting PlaceOrderButton.createOrders checkout totals are NAN, critical error',
      };
      return;
    }

    let discountAmount =
      lineItemsSubtotalPriceFloat + totalTaxFloat + shippingCostFloat - totalPrice;
    discountAmount = convertFloatFixedTwo(discountAmount);

    const customAttributes = [];
    let discountName = '-';

    customAttributes.map(customAttribute => {
      if (customAttribute.key == 'discountName' && customAttribute.value != '') {
        discountName = customAttribute.value;
      }
    });

    const discountCodes = [
      {
        code: discountName,
        amount: `${discountAmount.toFixed(2)}`,
        type: 'fixed_amount',
      },
    ];

    let massagedLineItems = { edges: [] };
    lineItems.edges.map(lineItem => {
      massagedLineItems.edges.push(lineItem);
    });

    // OPTIMIZE:
    let email;

    email = props.giftMessage.fromEmail;

    const noteAttributes = [
      {
        name: 'stripeChargeAmount',
        value: totalPrice,
      },
      {
        name: 'credits',
        value: 0,
      },
      {
        name: 'fulfillType',
        value: 'gift',
      },
      {
        name: 'giftMessage',
        value: giftMessage.message,
      },
      {
        name: 'from',
        value: giftMessage.fromName,
      },
      {
        name: 'stripeKey',
        value: idempotencyKey,
      },
    ];

    // lineItems, shippingAddress, shippingLine, totalPrice, totalTax, email, firstName, lastName, discountCodes, acceptsMarketing

    const acceptsMarketing = userData?.acceptsMarketing ? true : false;
    const shopifyOrder = await pRetry(
      async () =>
        await addShopifyOrder(
          massagedLineItems,
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
          lineItemsSubtotalPriceFloat
        ),
      {
        onFailedAttempt: error => {
          log.verbose(
            `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`
          );
        },
        retries: 3,
        factor: 2,
        minTimeout: 500,
        maxTimeout: 2000,
        randomize: true,
      }
    );

    track('completed order ', shopifyOrder);

    try {
      const gtm2 = {
        event: 'orderComplete',
        checkoutId: checkout?.id,
        orderTotal: checkout?.totalPrice,
        orderLineItems: lineItemsRemoveDefaultItems,
        discountCodes,
        shopifyOrderId: shopifyOrder?.id,
        shopifyOrderNumber: shopifyOrder?.order_number,
      };

      if (window['dataLayer']) {
        window['dataLayer'].push(gtm2);
      }
    } catch (err) {
      log.error('Cannot add GTM dataLayer', err.message);
    }

    const shopifyOrderParams = {
      massagedLineItems,
      shippingAddress,
      shippingLine,
      totalPriceFloat: priceSourceOfTruth,
      totalTaxFloat,
      email,
      firstName,
      lastName,
      discountCodes,
    };
  }

  return (
    <>
      <TitleLabel>Payment Info</TitleLabel>
      <CreditCardForm
        onDataChange={handleCreditCard}
        isReady={props.checkoutId !== undefined && !isProcessing}
        isProcessingCallback={wrappedIsProcessing}
        ownerName={props.giftMessage?.fromName}
        ownerEmail={props.giftMessage?.fromEmail}
      />
      <ErrorMessage color="forecolor.2" fontSize="14px" my={0}>
        {error}
      </ErrorMessage>
    </>
  );
};

export default PlaceOrderButton;
