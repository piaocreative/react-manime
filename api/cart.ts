import { AvailableCarts, UpdateCart } from 'actions/cart';
import client from 'lib/apollo/clients/shopify';
import * as queriesAndMutations from 'lib/apollo/clients/shopify/queriesAndMutations';
import { MutationKeys } from 'lib/apollo/clients/shopify/queriesAndMutations';
import { getStore } from 'lib/redux';
import pRetry from 'p-retry';
import { CreateCheckoutInput } from 'types';
import log from 'utils/logging';
import { trackFunnelActionProjectFunnel } from 'utils/track';
import { IntegrationProxy } from './connections/integrationProxy';
const uuid = require('uuid');
// NOTE: THESE FUNCTIONS MUST BE CALLED THROUGH SHOPIFYHOC

export const DEFAULT_CHECKOUT = {
  allowPartialAddresses: true,
  lineItems: [
    {
      quantity: 1,
      variantId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMDAxNTkzMTk0MDk3Mw==',
    },
  ],
  shippingAddress: {
    address1: '-',
    address2: '-',
    city: 'Los Angeles',
    company: '-',
    country: 'US',
    firstName: '-',
    lastName: '-',
    province: 'CA',
    zip: '-',
  },
};

export const GROUPGIFT_CART = {
  allowPartialAddresses: true,
  lineItems: [
    {
      quantity: 1,
      variantId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zOTI4ODY3NzEzODU0MQ==',
    },
  ],
  shippingAddress: {
    address1: '1625 Olympic Blvd',
    address2: '-',
    city: 'Santa Monica',
    company: '-',
    country: 'US',
    firstName: '-',
    lastName: '-',
    province: 'CA',
    zip: '90404',
  },
};
function sanitizeError(err) {
  if (err?.toString().match(/internal error/i)) {
    return 'Internal Shopify Error, payload';
  }
  return err;
}
async function mutate(mutationKey: string, variables: any, resolve = true) {
  if (!client) {
    throw new Error(
      '[cart][mutate]: Apollo Client not set up, likely this is running on the server where Apollo client is not set up. '
    );
  }
  const result = await client.mutate({
    mutation: queriesAndMutations[mutationKey],
    variables: variables,
  });
  if (resolve) {
    return result.data[mutationKey].checkout;
  } else {
    return result;
  }
}

export async function getCheckout(checkoutId, useCache = false) {
  const fetchPolicy = !useCache && { fetchPolicy: 'no-cache' };
  const result = await client.query({
    query: queriesAndMutations.checkoutQuery,
    variables: { checkoutId },
    ...fetchPolicy,
  });

  return result.data.node;
}

type Checkout = any;

export async function createCart({
  firstName,
  lastName,
  email,
  baseCart = DEFAULT_CHECKOUT,
}): Promise<Checkout> {
  const input: any = { ...baseCart };
  input.shippingAddress.firstName = firstName;
  input.shippingAddress.lastName = lastName;
  input.email = email;
  const result = await client.mutate({
    mutation: queriesAndMutations.createCheckout,
    variables: { input },
  });
  return result?.data?.checkoutCreate?.checkout;
}

export async function createCheckout(input: CreateCheckoutInput) {
  const result = await client.mutate({
    mutation: queriesAndMutations.createCheckout,
    variables: { input },
  });
  return result?.data?.checkoutCreate?.checkout;
}
export async function createDefaultCheckout() {
  return createCheckout(DEFAULT_CHECKOUT);
}

// FIXME:
// OPTIMIZE:
// NOTE: need to be explicit with checkoutId for all functions below?

export async function appendGiftCard(checkoutId, giftCardCodes) {
  // The param is an array/list
  try {
    const result = await mutate(MutationKeys.checkoutGiftCardsAppend, {
      checkoutId,
      giftCardCodes,
    });
    return result;
  } catch (err) {
    log.error('[cart][appendGiftCard] ' + sanitizeError(err), { checkoutId, giftCardCodes, err });
  }
}

export async function removeGiftCard(checkoutId, appliedGiftCardId) {
  log.info(typeof appliedGiftCardId, appliedGiftCardId);
  try {
    const result = await mutate(MutationKeys.checkoutGiftCardRemoveV2, {
      checkoutId,
      appliedGiftCardId,
    });
    return result;
  } catch (err) {
    log.error('[cart][removeGiftCard] ' + sanitizeError(err), {
      checkoutId,
      appliedGiftCardId,
      err,
    });
  }
}

export async function addItem(checkoutId, variantId, quantity, cartName = AvailableCarts.MainCart) {
  try {
    const txid = uuid.v1().substring(0, 6);
    log.verbose(`txid: ${txid} adding ${variantId} to ${checkoutId}`);
    const result = await mutate(MutationKeys.checkoutLineItemsAdd, {
      checkoutId,
      lineItems: [{ variantId, quantity: parseInt(quantity, 10) }],
    });

    getStore().dispatch(UpdateCart(result, `addItem txid: ${txid}`, { variantId }, cartName));

    return result;
  } catch (err) {
    log.error('[cart][addToCart] ' + sanitizeError(err), {
      err,
      variantId,
      quantity,
      checkoutId,
    });

    return { error: err };
  }
}

export async function addItemList(checkoutId, variants: { variantId; quantity }[]) {
  try {
    const result = await mutate(MutationKeys.checkoutLineItemsAdd, {
      checkoutId,
      lineItems: variants,
    });
    return result;
  } catch (err) {
    log.error('[cart][addItemlist] ' + sanitizeError(err), {
      err,
      variants,
      checkoutId,
    });

    return { error: err };
  }
}

export async function updateItem(
  checkoutId,
  lineItemId,
  quantity,
  cartName = AvailableCarts.MainCart
) {
  try {
    const result = await mutate(MutationKeys.checkoutLineItemsUpdate, {
      checkoutId,
      lineItems: [{ id: lineItemId, quantity: parseInt(quantity, 10) }],
    });

    getStore().dispatch(UpdateCart(result, 'updateItem', { lineItem: lineItemId }, cartName));

    return result;
  } catch (err) {
    log.error(`[cart][updateItem] ${sanitizeError(err)}`, {
      checkoutId,
      lineItemId,
      quantity,
      err,
    });

    return { error: err };
  }
}

export async function removeItem(
  checkoutId,
  lineItemIds: string[],
  cartName = AvailableCarts.MainCart
) {
  try {
    log.info('removing items from cart ', { checkoutId, lineItemIds });
    const result = await mutate(MutationKeys.checkoutLineItemsRemove, {
      checkoutId,
      lineItemIds: lineItemIds,
    });

    getStore().dispatch(UpdateCart(result, 'removeItem', { lineItems: lineItemIds }), cartName);

    return result;
  } catch (err) {
    log.error(`[cart][removeItem] ${sanitizeError(err)}`, {
      checkoutId,
      lineItemIds,
      err,
    });

    return { error: err };
  }
}

export async function replaceItem(checkoutId, lineItems, cartName = AvailableCarts.MainCart) {
  try {
    const result = await mutate(MutationKeys.checkoutLineItemsReplace, {
      checkoutId,
      lineItems: lineItems,
    });

    getStore().dispatch(UpdateCart(result, 'replaceItem', { lineItems }, cartName));

    return result;
  } catch (err) {
    log.error(`[cart][replaceItem] ${sanitizeError(err)}`, {
      checkoutId,
      lineItems,
      err,
    });

    return { error: err };
  }
}

export async function associateCartToCustomer(checkoutId, customerAccessToken) {
  try {
    const result = await mutate(MutationKeys.checkoutCustomerAssociate, {
      checkoutId,
      customerAccessToken: customerAccessToken,
    });
    return result;
  } catch (err) {
    log.error(`[cart][associateCartToCustomer] ${sanitizeError(err)}`, {
      checkoutId,
      customerAccessToken,
      err,
    });

    return { error: err };
  }
}

export async function createAccessToken(email, password) {
  try {
    const result = await mutate(
      MutationKeys.customerAccessTokenCreate,
      {
        input: {
          email,
          password,
        },
      },
      false
    );

    log.verbose('result is ', result);
    return result.data.customerAccessTokenCreate;
  } catch (err) {
    log.error(`[cart][createAccessToken] ${sanitizeError(err)}`, { email, err });
    return { error: err };
  }
}

export async function updateShippingLine(checkoutId, shippingRateHandle) {
  try {
    const result = await mutate(MutationKeys.checkoutShippingLineUpdate, {
      checkoutId,
      shippingRateHandle: shippingRateHandle,
    });
    return result;
  } catch (err) {
    log.error(`[cart][updateShippingLine] ${sanitizeError(err)}`, {
      checkoutId,
      shippingRateHandle,
      err,
    });

    return { error: err };
  }
}

export async function applyDiscountCode(
  checkoutId,
  discountCode,
  cartName = AvailableCarts.MainCart,
  overrideNoQualifier = false
) {
  try {
    const result = await mutate(
      MutationKeys.checkoutDiscountCodeApplyV2,
      {
        checkoutId,
        discountCode: discountCode,
      },
      false
    );
    const checkoutUserErrors: any =
      (((result || {}).data || {}).checkoutDiscountCodeApplyV2 || {}).checkoutUserErrors || [];
    const hasErrors = checkoutUserErrors.length > 0;
    trackFunnelActionProjectFunnel('[Redeem][shopify][3] applyDiscountCode', {
      discountCode,
      result,
    });
    if (hasErrors) {
      removeDiscountCode(checkoutId, cartName);
      return { error: { applyErrorCode: checkoutUserErrors[0].code } };
    } else {
      const checkout = result.data.checkoutDiscountCodeApplyV2.checkout;
      if (
        !overrideNoQualifier &&
        parseFloat(checkout.lineItemsSubtotalPrice.amount) - parseFloat(checkout.subtotalPrice) ===
          0
      ) {
        removeDiscountCode(checkoutId, cartName);
        return { error: { applyErrorCode: 'NO_QUALIFIER' } };
      } else {
        const appliedDiscount = await updateAttributes(
          checkoutId,
          checkout.customAttributes,
          'discountName',
          discountCode
        );
        autoApplyShippingLine(checkoutId, cartName, 'applyDiscountCode');
        return checkout;
      }
    }
  } catch (err) {
    log.error(`[cart][applyDiscountCode] ${sanitizeError(err)}`, { checkoutId, discountCode, err });

    return { error: err };
  }
}

export async function removeDiscountCode(checkoutId, cartName = AvailableCarts.MainCart) {
  try {
    const result = await mutate(MutationKeys.checkoutDiscountCodeRemove, {
      checkoutId,
    });
    autoApplyShippingLine(checkoutId, cartName, 'removeDiscountCode');
    return result;
  } catch (err) {
    log.error(`[cart][removeDiscountcode] ${sanitizeError(err)}`, { checkoutId, err });

    return { error: err };
  }
}

type ShopifyShippingAddress = {
  address1: string;
  address2?: string;
  city: string;
  country?: string;
  firstName: string;
  lastName: string;
  province: string;
  zip: string;
};
export async function updateShippingAddress(
  checkoutId,
  {
    address1,
    address2,
    city,
    country = 'US',
    firstName,
    lastName,
    province,
    zip,
  }: ShopifyShippingAddress,
  cartName = AvailableCarts.MainCart
) {
  log.info('update shiping address', { cartName, checkoutId });
  const shippingAddress = {
    address1,
    address2,
    city,
    country,
    firstName,
    lastName,
    province,
    zip,
  };

  try {
    const result = await mutate(
      MutationKeys.checkoutShippingAddressUpdateV2,
      {
        checkoutId,
        shippingAddress: shippingAddress,
      },
      false
    );

    if (!result?.data?.checkoutShippingAddressUpdateV2?.checkoutUserErrors?.length) {
      getStore().dispatch(
        UpdateCart(result.data.checkoutShippingAddressUpdateV2.checkout, 'updateShippingAddress'),
        shippingAddress,
        cartName
      );
      autoApplyShippingLine(checkoutId, cartName, 'updateShippingAddress');
    }

    return result;
  } catch (err) {
    log.error(`[cart][updateShippingAddress] ${sanitizeError(err)}`, {
      checkoutId,
      shippingAddress,
      err,
    });
    return { error: err };
  }
}

/**
 * TODO Need to refactor this to use the checkout extract
 * @param {} key
 * @param {*} value
 */
export async function updateAttributes(
  checkoutId,
  originalAttributes: any[],
  key,
  value,
  cartName = AvailableCarts.MainCart
) {
  const customAttributes = originalAttributes.map(customAttributeCopy => {
    return { key: customAttributeCopy.key, value: customAttributeCopy.value };
  });

  let attributeAlreadyExists = false;
  let attributeIndex = -1;
  customAttributes.map((customAttribute, index) => {
    if (customAttribute.key == key) {
      attributeAlreadyExists = true;
      attributeIndex = index;
    }
  });

  let newAttributes = [...customAttributes];

  if (attributeAlreadyExists) newAttributes[attributeIndex]['value'] = value;
  else newAttributes.push({ key, value });

  try {
    const result = await mutate(MutationKeys.checkoutAttributesUpdateV2, {
      checkoutId,
      input: {
        customAttributes: newAttributes,
      },
    });
    getStore().dispatch(UpdateCart(result, 'updateAttributes', newAttributes, cartName));
    return result;
  } catch (err) {
    log.error(`[cart][updateCheckoutAttributes] ${sanitizeError(err)}`, {
      checkoutId,
      originalAttributes,
      newAttribute: { key, value },
      err,
    });
  }
}

export async function autoApplyShippingLine(
  checkoutId,
  cartName = AvailableCarts.MainCart,
  from = 'blank'
) {
  const id = uuid.v1().substring(0, 6);
  log.info(`${id} ${from} starting autoApplyShippingLine`);
  const result = await pRetry(
    async () => {
      const tempCheckout = await getCheckout(checkoutId);
      if (!tempCheckout?.availableShippingRates?.shippingRates) {
        log.verbose(`${id} ${from}could not get shipping rates`);

        throw new Error(`${id} ${from} No shipping rate handle`);
      }
      return tempCheckout;
    },
    {
      onFailedAttempt: error => {
        log.verbose(
          `${id} ${from} Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`
        );
      },
      retries: 5, // 5 calls
      factor: 4,
      minTimeout: 1 * 1000,
      maxTimeout: 7 * 1000,
      randomize: true,
    }
  );

  log.verbose(`${id} ${from} post autoapply shipping rate discount, results are `, { result });

  const checkout = result;
  if (
    !(
      checkout &&
      checkout.availableShippingRates &&
      checkout.availableShippingRates.shippingRates &&
      Array.isArray(checkout.availableShippingRates.shippingRates) &&
      checkout.availableShippingRates.shippingRates.length > 0
    )
  ) {
    log.error('[cart][autoApplyShippingLine] failed to get shipping rates, so cannot apply', {
      checkoutId,
      uuid: id,
      from,
    });
    trackFunnelActionProjectFunnel(
      'could not get a chekcout with available shipping rates for checkout id ',
      { checkoutId }
    );
    return;
  }

  const defaultShippingTitle = `Default-(Don't delete or change name)`;
  let defaultShippingHandle = '';
  let shippingHandle = '';
  checkout.availableShippingRates.shippingRates.some(shippingRate => {
    if (shippingRate.title == defaultShippingTitle) {
      defaultShippingHandle = shippingRate.handle;
    } else {
      shippingHandle = shippingRate.handle;
      return checkout;
    }
  });

  if (shippingHandle == '') {
    shippingHandle = defaultShippingHandle;
  }
  try {
    const updatedCheckout = await updateShippingLine(checkoutId, shippingHandle);
    if (updatedCheckout.error) {
      log.error('[cart][autoApplyShippingLabel] could not update shpping line ', {
        checkoutId,
        uuid: id,
        from,
      });
    } else {
      getStore().dispatch(
        UpdateCart(updatedCheckout, 'autoApplyShippingLine', undefined, cartName)
      );
      return updatedCheckout;
    }
  } catch (err) {
    log.error(`[cart][autoApplyShippingLine] caught error ${sanitizeError(err)}`, {
      err,
      checkoutId,
      uuid: id,
      from,
    });
  }
}

export const checkDiscountCode = async discountCode => {
  try {
    const res = await IntegrationProxy('get', `/shopify/discounts/${discountCode}`);
    return res;
  } catch (error) {
    //IN ORDER TO ALWAYS GET PROPER UI WITHOUT ADDITIONAL VALIDATIONS (disabling button etc)
    return {};
  }
};
