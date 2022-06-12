import styles from '@styles/gift/group/message.module.css';
import { SET_STRIPE_ID } from 'actions';
import { AvailableCarts } from 'actions/cart';
import { PaymentApi } from 'api/connections/paymentApi';
import { addShopifyOrder, GroupGiftTotals } from 'api/order';
import { createStripeCharge } from 'api/payment';
import { getNailProductsByType } from 'api/product';
import { updateUserColumn } from 'api/user';
import CreditCardForm from 'components/checkout/noCart/CreditCardForm';
import RecipientList from 'components/gift/group/confirmation/RecipientList';
import useCartFunctions from 'hooks/useCartFunctions';
import pRetry from 'p-retry';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { prepareBaseOrder } from 'utils/cartUtils';
import log from 'utils/logging';
import OrderOverview from './Overview';
import OrderTotals from './Totals';

type Props = {
  message: string;
  recipients: Recipient[];
  placeOrderCallback: Function;
  refreshOrderTotal: Function;
  userData: any;
  groupGiftCart: any;
  orderTotals: GroupGiftTotals;
  track: Function;
};

type Recipient = {
  fullName: string;
  email: string;
};

export default function Payment({
  message,
  placeOrderCallback,
  recipients,
  userData,
  groupGiftCart,
  orderTotals,
  track,
  refreshOrderTotal,
}: Props) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [timeoutKey, setTimeoutKey] = useState(undefined);
  const dispatch = useDispatch();

  const {
    email,
    name: { lastName, firstName },
  } = userData;

  const [placeHolder, setPlaceholder] = useState<any>();

  function _track(message, data?) {
    track(`[Payment]${message}`, data);
  }

  const cartFunctions = useCartFunctions();

  useEffect(() => {
    cartFunctions.autoApplyShippingLine(AvailableCarts.GroupGiftCart, 'Friends Gift Totals');
  }, [groupGiftCart.subtotalPrice]);

  useEffect(() => {
    refreshOrderTotal();
  }, [groupGiftCart.totalPrice]);

  async function mount() {
    _track('mounting');
    let products = await getNailProductsByType('ManiBox');

    // there should only be one of these
    if (products?.length >= 1) {
      setPlaceholder(products[0]);
    }
  }
  useEffect(() => {
    mount();
  }, []);

  async function createNewStripeId(
    email,
    identityId,
    sourceId
  ): Promise<{ stripeId?: string; error?: any }> {
    let userData = {
      email,
      source: sourceId,
    };

    try {
      // trackFlowMixpanel('15B', 'Create New Customer start try block');
      const response = await PaymentApi('post', '/subscription/customer', userData);
      // log.verbose(response);
      // trackFlowMixpanel('16B', 'after /subscription/customer call', { customer: response });
      const stripeId =
        response && response.customer && response.customer.id ? response.customer.id : null;
      if (!stripeId) {
        return { error: 'could not create stripe id' };
      }
      // trackFlowMixpanel('17B', 'stripeId valid');

      updateUserColumn(identityId, 'stripeId', stripeId);
      dispatch(SET_STRIPE_ID(stripeId));

      return { stripeId };
    } catch (err) {
      log.verbose('B. STRIPE CREATE CUSTOMER', err.response);
      return { error: err };
    }
  }

  async function handleCreditCard(source) {
    if (source.error) {
      _track('[handleCreditCard][error]', { error: source.error });
      throw source.error;
    }

    if (source?.id === undefined) {
      log.error("'no source id");
      setError('Could not process your credit card. Please go back and try again.');
      _track('[handleCreditCard][error]', {
        userData,
        groupGiftCart,
        error: ' there is no source id which is needed to create a charge ',
      });
    } else {
    }
    const idempotencyKey = `sourceId_${source.id}`;

    const baseOrder = prepareBaseOrder({
      shopifyCheckout: groupGiftCart,
      firstName,
      lastName,
      email,
      idempotencyKey,
      fulfillType: 'ManiBox',
    });

    baseOrder.totalPriceFloat = orderTotals.kitTotal.toFixed(2);
    baseOrder.totalTaxFloat = orderTotals.kitTaxes.toFixed(2);

    let compositeEdges = [...baseOrder.lineItems.edges];
    baseOrder.lineItems = { edges: [] };
    const index = compositeEdges.findIndex(
      entry => entry.node.variant.product.productType === 'ManiBox'
    );
    compositeEdges[index].node.quantity = recipients.length;
    compositeEdges[index].node.variant.price = orderTotals.perUnitSubtotal.toFixed(2);

    baseOrder.lineItems.edges = [...compositeEdges.splice(index, 1)];
    const variantId = btoa(`gid://shopify/ProductVariant/${placeHolder?.variantId}`);

    if (!userData.stripeId) {
      const { stripeId, error } = await createNewStripeId(
        userData.email,
        userData.identityId,
        source.id
      );
      if (error) {
        setError(
          'Problem creating charge, please try again. If you continue having issues please reach out to care@manime.co'
        );
        _track('[handleCreditCard][error]', {
          error: 'user had no stripe id and one could not be created',
          userData,
          groupGiftCart,
        });
        throw new Error('could not create stripe id for customer');
      } else {
        log.verbose('setting stripe id to custoemr', userData);
      }
      userData.stripeId = stripeId;
    }
    const { chargeId, error } = await createStripeCharge(
      userData.stripeId,
      baseOrder.totalPriceFloat,
      'Friends Gift Kit for ' + baseOrder.email,
      source,
      idempotencyKey
    );

    if (error) {
      setError('Your payment failed. Please check your card details and try again.');
      _track('[handleCreditCard][error]', {
        error: { message: 'paymentFailed', wrappedError: chargeId },
      });
      stopProcessingCountdown();
      return;
    }

    let shopifyOrder;
    const acceptsMarketing = !!userData?.acceptsMarketing;

    const noteAttributes = [
      {
        name: 'stripeChargeAmount',
        value: baseOrder.totalPriceFloat,
      },
      {
        name: 'giftMessage',
        value: message,
      },
      {
        name: 'from',
        value: baseOrder.firstName,
      },
      ...baseOrder.orderNotes,
    ];

    const lineItemsSubtotalPriceFloat = baseOrder.totalPriceFloat;

    const groupGiftData = {
      recipients,
      checkoutId: groupGiftCart.id,
      compositeEdges,
      orderTotals,
      userId: userData.identityId,
      host: process.env.APP_URL,
    };
    try {
      shopifyOrder = await pRetry(
        async () =>
          await addShopifyOrder(
            baseOrder.lineItems,
            baseOrder.shippingAddress,
            baseOrder.shippingLine,
            baseOrder.totalPriceFloat,
            baseOrder.totalTaxFloat,
            baseOrder.email,
            baseOrder.firstName,
            baseOrder.lastName,
            undefined /*discountCodes */,
            acceptsMarketing /*acceptsMarketing*/,
            noteAttributes,
            idempotencyKey,
            chargeId,
            null,
            groupGiftData,
            lineItemsSubtotalPriceFloat
          ),
        {
          onFailedAttempt: (error: any) => {
            log.verbose(
              `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`
            );
            if (error?.response?.status < 500 && error?.response?.status >= 400) {
              throw error;
            }
          },
          retries: 3, // 5 calls
          factor: 2,
          minTimeout: 500,
          maxTimeout: 2000,
          randomize: true,
        }
      );

      _track('[handleCreditCard][success]');
      placeOrderCallback();
    } catch (err) {
      const myError = err;

      //      log.error("Caught an error in Gifting Place Order")
      //    log.error("Gifting PlaceOrderButton.handleCreditCard could not create", err)

      let message = JSON.stringify(err);
      let path = undefined;
      let fatal = false;
      if (chargeId && !shopifyOrder) {
        fatal = true;
        message =
          'Your order needs assistance from our care team, who will complete your order soon. Your payment was successfully processed. Please write to care@manime.co with any questions.';
        err.nestedMessage = err.message;
        err.message =
          'Charged customer but unable to create a shopify order. Please revert the charge ASAP.';
      } else if (err.isAxiosError) {
        // these are from
        try {
          message = `${err.response.data.prefix} ${err.response.data.message} ${err.response.data.suffix}`;
          path = myError.config.url;
        } catch (innerErr) {
          message = 'Check your card information and try again, or use a different payment method.';
        }
      } else if (err.message) {
        message = err.message;
      } else if (err.source === 'SYSTEM') {
        message =
          'Oops, we had system errors placing your order. Please refresh and try again. If the problem persists please contact us at care@manime.co';
        fatal = err.fatal ? true : false;
      }
      _track('[handleCreditCard][error]', { error: message });
      setError(message);
    } finally {
      stopProcessingCountdown();
    }
  }

  function startProcessingCountdown() {
    setIsProcessing(true);
    const timeout = setTimeout(() => {
      log.fatal('Gifting PlaceOrder timed out, unknown error');
      setIsProcessing(false);
      setError(
        'Order placement took too long and timed out. Please check with customer service to determine if the order was placed.'
      );
    }, 60000);
    setTimeoutKey(timeout);
  }
  function stopProcessingCountdown() {
    clearTimeout(timeoutKey);
    setTimeoutKey(undefined);
    setIsProcessing(false);
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Payment</div>
        </div>
        <div className={styles.messagePage}>
          <OrderTotals quantity={recipients.length || 0} orderTotals={orderTotals} />
          <div>
            <OrderOverview recipients={recipients} orderTotals={orderTotals} />
            <div style={{ padding: '10px', width: '100%' }}>
              <CreditCardForm
                onDataChange={handleCreditCard}
                isReady={!isProcessing}
                isProcessingCallback={startProcessingCountdown}
                ownerName={`${firstName} ${lastName}`}
                ownerEmail={email}
              />
            </div>
            <div className={styles.error}>{error}</div>
          </div>
          <RecipientList recipients={recipients} message={message} />
        </div>
      </div>
    </>
  );
}
