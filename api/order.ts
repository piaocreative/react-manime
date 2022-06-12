import pRetry from 'p-retry';
import log from 'utils/logging';
import uuid from 'uuid';
import { IntegrationProxy } from './connections/integrationProxy';
import { ManimeApi } from './connections/manimeApi';

// FIXME: UPDATE AFTER FILTERBY
export const getGroupOrders = async identityId => {
  const userInit = {
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    const result = await ManimeApi(
      'get',
      `/grouporders/cms/read?filter=userid eq ${identityId}&sort=datecreated desc`
    );

    return result;
  } catch (err) {
    log.error(`[api/order][getGroupOrders] ${err}`, { err });
    throw err;
  }
};

// FIXME: UPDATE AFTER FILTERBY
export const getOrders = async groupOrderId => {
  const userInit = {
    headers: { 'Content-Type': 'application/json' },
  };
  const response = await ManimeApi('get', `/orders/read/${groupOrderId}`, userInit);
  return response;
};

export const addShopifyOrder = async (
  lineItems,
  shippingAddress,
  shippingLine,
  totalPrice,
  totalTax,
  email,
  firstName,
  lastName,
  discountCodes,
  acceptsMarketing,
  noteAttributes,
  idempotencyKey,
  chargeId,
  note = undefined,
  groupGiftData = undefined,
  lineItemsSubtotalPriceFloat
) => {
  const _idem = idempotencyKey
    ? {
        'Idempotency-Key': idempotencyKey,
      }
    : {};

  const response = await ManimeApi(
    'post',
    '/shopify/order',
    {
      lineItems,
      shippingAddress,
      shippingLine,
      totalPrice,
      totalTax,
      email,
      firstName,
      lastName,
      discountCodes,
      acceptsMarketing,
      noteAttributes,
      chargeId,
      note,
      groupGiftData,
      lineItemsSubtotalPriceFloat,
    },
    _idem
  );

  const createdShopifyOrder = response?.order;
  return createdShopifyOrder;
};

export const getShopifyOrderByGroupOrderId = async groupOrderId => {
  return IntegrationProxy('get', `/shopify/orders/${groupOrderId}`);
};

export const getShopifyProducts = async () => {
  const response = await IntegrationProxy('get', '/shopify/products');
  return response;
};

// Orders
function postOrder(groupOrderId, nailProductArray, fitStatus) {
  nailProductArray.forEach(item => {
    if (!item) return;
    let orderId = uuid.v1();
    let data = {
      orderId: orderId,
      //userId: '',
      nailProductId: `${item}`,
      groupOrderId: groupOrderId,
      dateCreated: new Date(),
      deliveryDate: new Date(),
      nailShape: 'NOT SET',
      nailLength: 'NOT SET',
      comments: '',
      orderStatus: fitStatus,
      listedPrice: 0,
      discount: 0,
    };

    let path = '/orders/create';
    const apiName = undefined;
    const myInit = undefined;

    const APIPromise = retryManimePost(path, myInit, INIT_TIMEOUT, API_RETRIES);
    APIPromise.then(res => log.info(apiName + path + item + 'succeeded')).catch(err => {
      log.info(apiName + path + item + 'failed');
    });
  });
}

export const postGroupOrder = (
  groupOrderId,
  identityId,
  nailProductArray,
  redundantShippingAddressString,
  fitStatus
) => {
  let groupOrderData = {
    groupOrderId: groupOrderId,
    shippingAddress: redundantShippingAddressString,
    subtotal: -9999,
    insurance: 0,
    shipping: 0,
    taxes: 0,
    orderTotal: 0,
    groupOrderStatus: 'Order Received',
    userId: identityId,
  };

  let path = '/grouporders/create';

  const APIPromise = pRetry(() => ManimeApi('post', path, groupOrderData), {
    retries: API_RETRIES, // 5 calls
    factor: 2,
    minTimeout: 1 * INIT_TIMEOUT,
    randomize: true,
  });

  APIPromise.then(res => {
    postOrder(res.groupOrderId, nailProductArray, fitStatus);
  }).catch(err => {
    log.info(path + 'failed');
  });
};

// Retry
const API_RETRIES = 7;
const INIT_TIMEOUT = 2000;

function wait(waitTime) {
  return new Promise(resolve => setTimeout(resolve, waitTime));
}

function retryManimePost(path, myInit, waitTime, retry) {
  return ManimeApi('post ', path, myInit).catch(err => {
    log.error(`[order][retryPost] trying ${path} ${err}`, { attempt: retry });
    return wait(waitTime).then(() => retryManimePost(path, myInit, waitTime * 2, retry - 1));
  });
}
export type GroupGiftTotals = {
  perUnitSubtotal: number;
  perUnitDiscount: number;
  perUnitShipping: number | undefined;
  kitTaxes: number;
  kitTotal: number;
};

type GroupGiftMember = {
  groupGiftMemberId: string;
  groupGiftId: string;
  groupOrderId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
};
type GroupGiftLineItem = {
  groupGiftLineItemId: string;
  groupGiftId: string;
  variantId: string;
  quantity?: number;
};
type GroupGiftRedeption = {
  groupGiftMember: GroupGiftMember;
  groupGiftLineItems: GroupGiftLineItem[];
  buyerName: string;
};

export async function redeemGroupGift(groupGiftMemberId): Promise<GroupGiftRedeption> {
  const response = await ManimeApi('get', `/group-gift/redeem?mid=${groupGiftMemberId}`);
  return response;
}

export async function calculateGroupGiftTotals(shopifyCart, quantity): Promise<GroupGiftTotals> {
  if (!shopifyCart?.id) {
    log.info('calling for cart totals with no data');
    return;
  }

  const path = `/group-gift/cart-totals?checkoutId=${shopifyCart.id}&quantity=${quantity}`;

  const totals = await ManimeApi('get', path, undefined);

  log.info('order totals is ' + totals);
  return totals;
  /*
  const perUnitSubtotal =
    parseFloat(shopifyCart ? shopifyCart.subtotalPrice : '') || 0;

  const perUnitShipping =
    parseFloat(
      shopifyCart && shopifyCart.shippingLine
        ? shopifyCart.shippingLine.priceV2.amount
        : 0
    ) || 0;

  const perUnitDiscount = quantity < 5 ? 10 : quantity < 11 ? 20 : 30;

  const kitTaxes = 0;
  const kitTotal =
    (perUnitSubtotal - perUnitSubtotal / perUnitDiscount + perUnitShipping) *
      quantity +
    kitTaxes;
  return {
    perUnitSubtotal,
    perUnitDiscount,
    perUnitShipping,
    kitTaxes,
    kitTotal,
  };*/
}
