import Router from 'next/router';
import constants from '../constants';
import { convertFloatFixedTwo } from './calculateOrderData';
import { pageLinks } from './links';
import log from './logging';
import { hasValidManiProfile, hasValidPediProfile } from './profileData';

export const getProductCounts = checkout => {
  let edges = checkout?.lineItems?.edges || [];

  let quantity = 0;
  edges.map(edge => {
    if (!isHiddenTitle(edge.node.title)) quantity += edge.node.quantity;
  });

  if (checkIsDiscountApplied(checkout) && getAppliedDiscountCode(checkout) === 'IPSYGLAM')
    quantity++;

  return quantity;
};

export const isHiddenTitle = title => {
  return (
    title === undefined ||
    [
      constants.EMPTY_PRODUCT_TITLE,
      // freeProduct.FREE_MAX_TOP_COAT,
      constants.WELCOME_CARD_TRIFOLD_TITLE,
      // freeProduct.FREE_MIRELLA_TOP_COAT,
    ].includes(title)
  );
};

export const checkManiBag = (cart, totalOrders = undefined) => {
  let edges = [];

  edges = cart?.lineItems?.edges || [];

  let hasManis = false;
  let hasPedis = false;
  let hasItems = false;
  let countOfProducts = 0;
  edges.map(edge => {
    const { variant, title, quantity } = (edge || {}).node || {};
    const productType = ((variant || {}).product || {}).productType;

    const isHidden = isHiddenTitle(title);
    if (isHidden) {
      return;
    }

    countOfProducts += quantity;
    hasItems = true;

    if (productType === 'Pedis') {
      hasPedis = true;
    } else if (productType === 'Manis') {
      hasManis = true;
    }
  });

  if (checkIsDiscountApplied(cart) && getAppliedDiscountCode(cart) === 'IPSYGLAM')
    countOfProducts++;

  return { hasPedis, hasManis, hasItems, countOfProducts };
};

export function checkFitStatus(cart, profiles, transitionTrigger, urlQuery) {
  const edges = cart.lineItems?.edges;
  const { hasManis, hasPedis } = checkManiBag(cart);
  const manisProfile = profiles.find(profile => profile.profileType === 'Manis') || {};
  const pedisProfile = profiles.find(profile => profile.profileType === 'Pedis') || {};

  // if there are no edges mani profile or pedi profile the system is still
  // settin gup
  if (!edges || !manisProfile || !pedisProfile) {
    return true;
  }

  if (hasManis) {
    const isManiReady = hasValidManiProfile(manisProfile);
    if (!isManiReady) {
      Router.replace({
        pathname: pageLinks.GuidedFitting.url,
        query: {
          transitionTrigger,
          ...urlQuery,
          hasManis,
        },
      });
      return false;
    }
  }
  if (hasPedis) {
    const isPediReady = hasValidPediProfile(pedisProfile);
    if (!isPediReady) {
      Router.replace({
        pathname: pageLinks.PediFitting.url,
        query: {
          transitionTrigger,
          ...urlQuery,
          hasPedis,
        },
      });
      return false;
    }
  }

  return true;
}

export function prepareBaseOrder({
  shopifyCheckout,
  firstName,
  lastName,
  email,
  idempotencyKey,
  fulfillType = undefined,
  credits = undefined,
  maniProfileId = undefined,
  pediProfileId = undefined,
}) {
  const {
    lineItems,
    shippingAddress,
    totalTax,
    lineItemsSubtotalPrice,
    shippingLine,
    totalPrice,
    note,
  } = shopifyCheckout;

  const priceSourceOfTruth = totalPrice;

  let lineItemsRemoveDefaultItems = { edges: [] };

  log.info('[TEST lineItemsRemoveDefaultItems] =>', lineItemsRemoveDefaultItems);

  if (!shippingLine || !lineItemsSubtotalPrice) {
    let params: any = {};
    if (shippingLine) params.shippingLine = shippingLine;
    if (lineItemsSubtotalPrice) params.lineItemsSubtotalPrice = lineItemsSubtotalPrice;

    log.error('prepareBaseOrder params INVALID!');
    throw { source: 'prepareBaseOrder checkout has no shipping line or subtotal, critical error' };
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
    log.error('prepareBaseOrder params are NaN!');
    throw { source: 'prepareBaseOrder checkout totals are NaN, critical error' };
  }

  // attach profile ids
  for (const lineItem of lineItems.edges) {
    const customAttributes = lineItem?.node?.customAttributes || [];
    const productType = lineItem?.node?.variant?.product?.productType || '';
    if (!customAttributes.find(attr => attr.key === 'profileId' && attr.value)) {
      const profileId =
        productType === 'Manis' ? maniProfileId : productType === 'Pedis' ? pediProfileId : '';
      customAttributes.push({ key: 'profileId', value: profileId, __typename: 'Attribute' });
      lineItem.node.customAttributes = customAttributes;
    }
  }

  let discountAmount = lineItemsSubtotalPriceFloat + totalTaxFloat + shippingCostFloat - totalPrice;
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
  lineItems.edges.forEach(lineItem => {
    if (lineItem.node.title === "DON'T DELETE - not visible") {
      return;
    }
    massagedLineItems.edges.push(lineItem);
  });

  const orderNotes = [
    {
      name: 'stripeKey',
      value: idempotencyKey,
    },
  ];
  credits &&
    orderNotes.push({
      name: 'credits',
      value: 0,
    });

  fulfillType &&
    orderNotes.push({
      name: 'fulfillType',
      value: fulfillType,
    });

  // lineItems, shippingAddress, shippingLine, totalPrice, totalTax, email, firstName, lastName, discountCodes, acceptsMarketing

  const baseOrder = {
    lineItems: massagedLineItems,
    shippingAddress,
    shippingLine,
    totalPriceFloat: priceSourceOfTruth,
    totalTaxFloat,
    email,
    firstName,
    lastName,
    discountCodes,
    orderNotes,
  };

  return baseOrder;
}

export function checkIsDiscountApplied(checkout: any) {
  const lineItemsSubtotalPrice = parseFloat(checkout?.lineItemsSubtotalPrice?.amount || 0) || 0;
  const subtotalPrice = parseFloat(checkout ? checkout.subtotalPrice : '') || 0;
  const isDiscountApplied = lineItemsSubtotalPrice - subtotalPrice > 0;
  return isDiscountApplied;
}

export function getAppliedDiscountCode(checkout: any) {
  const customAttributes = checkout?.customAttributes || [];
  return customAttributes.find(attr => attr.key === 'discountName')?.value;
}

export function countTypesInCart(cart) {
  const types = {};
  if (!cart?.lineItems?.edges) {
    return types;
  }
  cart?.lineItems?.edges?.forEach(edge => {
    if (
      edge.node.title === "DON'T DELETE - not visible" ||
      !edge?.node?.variant?.product?.productType ||
      edge.node.variant.product.productType === 'ManiBox'
    ) {
      return;
    } else {
      let productType = edge.node.variant.product.productType;
      if (productType === 'Manis' || productType === 'Pedis') {
        productType = 'Gels';
      }
      types[productType]
        ? (types[productType] += edge.node.quantity)
        : (types[productType] = edge.node.quantity);
    }
  });
  return types;
}
