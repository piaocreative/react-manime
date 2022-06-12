import { AvailableCarts } from 'actions/cart';
import {
  addItem,
  addItemList as addItemListApi,
  appendGiftCard as appendGiftCardApi,
  applyDiscountCode as applyDiscountCodeApi,
  associateCartToCustomer as associateCartToCustomerApi,
  autoApplyShippingLine as autoApplyShippingLineApi,
  createAccessToken as createAccessTokenApi,
  getCheckout,
  removeDiscountCode as removeDiscountCodeApi,
  removeGiftCard as removeGiftCardApi,
  removeItem,
  updateAttributes as updateAttributes,
  updateItem,
  updateShippingAddress as updateShippingAddressApi,
} from 'api/cart';
import { getRedeemableItem } from 'api/util';
import constants, { giftsWithPurchase } from 'constants/index';
import useCommonDispatchers from 'hooks/useComonDispatchers';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import log from 'utils/logging';
import { getLiveProducts } from 'api/product';

export default function useCartFunctions() {
  const mainCartData = useSelector((state: any) => state.mainCartData);
  const groupGiftCartData = useSelector((state: any) => state.groupGiftCartData);
  const subscriptionCart = useSelector((state: any) => state.subscriptionCart);
  const cartMap = {
    [AvailableCarts.MainCart]: mainCartData,
    [AvailableCarts.GroupGiftCart]: groupGiftCartData,
    [AvailableCarts.SubscriptionCart]: subscriptionCart,
  };
  const commonDispatchers = useCommonDispatchers();

  const getCartIdByName = useCallback(
    cartName => {
      let checkoutId = cartMap[cartName]?.cart?.id;
      let keys = '';
      Object.entries(cartMap).forEach(([key, value]) => {
        keys += `${key}: ${value.cart.id} `;
      });
      log.info('getting cart by name ', { cartName, checkoutId, keys });
      return checkoutId;
    },
    [mainCartData, groupGiftCartData, subscriptionCart]
  );

  const duringEvent = (startDateString, endDateString) => {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    return () => {
      const now = new Date();
      return now >= startDate && now <= endDate;
    };
  };

  const cartValueIsEligibleForGift = (cart, gift) =>
    parseFloat(cart?.subtotalPrice || 0) >= gift.cartMinimum &&
    parseFloat(cart?.subtotalPrice || 0) <= (gift.cartMaximum || Number.MAX_SAFE_INTEGER);

  const addFreeItemAsNeeded = async (cartName, variantId, condition = () => true) => {
    const cartData = cartMap[cartName];
    const variantsInfo = await getLiveProducts([variantId]);
    const inStockVariantInfo = variantsInfo.find(
      row =>
        row.variantId === variantId &&
        parseInt(row.quantity) >= parseInt(process.env.OUT_OF_STOCK_THRESHOLD)
    );

    // if (!inStockVariantInfo) return;

    const variantIdEncoded = btoa(`gid://shopify/ProductVariant/${variantId}`);
    // get the lineItemId of the variantId to be added.
    const freeItemLineItemId = cartData?.cart?.lineItems?.edges.find(
      edge => edge?.node?.variant?.id === variantIdEncoded
    )?.node?.id;
    // if the rule for adding the item is met:
    if (condition()) {
      // if the item is not already in the cart, add it:
      if (!freeItemLineItemId) {
        await addVariantToCart(variantIdEncoded, 1, cartName, false);
      }
    } else {
      // if the rule is not met, and the item is in the cart, remove it:
      if (freeItemLineItemId) {
        await removeLineItemInCart(freeItemLineItemId, cartName, false);
      }
    }
    return condition();
  };

  const addFreeItemsAsNeeded = async (cartName, result) => {
    const giftPromises = giftsWithPurchase.map(gift => {
      // console.log({
      //   at: 'addFreeItemsAsNeeded',
      //   gift,
      //   duringEvent: duringEvent(gift.startDate, gift.endDate)(),
      //   cartValueIsEligibleForGift: cartValueIsEligibleForGift(result, gift),
      //   subtotal: parseFloat(result?.subtotalPrice || 0),
      // });
      return addFreeItemAsNeeded(cartName, gift.productVariant, () => {
        return (
          duringEvent(gift.startDate, gift.endDate)() && cartValueIsEligibleForGift(result, gift)
        );
      });
    });
    // console.log(giftPromises);
    const response = await Promise.all(giftPromises);
    // console.log(response);
    // await addFreeItemAsNeeded(cartName, constants.MAGIC_CUTICLE_PEN_ID, () => {
    //   return (
    //     duringFall2021Event() &&
    //     parseFloat(result?.subtotalPrice || 0) >= constants.giftCuticlePenMinimumCart
    //   );
    // });
    // await addFreeItemAsNeeded(cartName, constants.MIRELLACOAT_VARIANT_ID, () => {
    //   return (
    //     duringFall2021Event() &&
    //     parseFloat(result?.subtotalPrice || 0) >= constants.giftMirellaMinimumCart
    //   );
    // });
  };

  const addVariantToCart = async (
    variantId,
    quantity,
    cartName = AvailableCarts.MainCart,
    testForFreeItem = true
  ) => {
    const checkoutId = getCartIdByName(cartName);
    try {
      const result = await addItem(checkoutId, variantId, quantity, cartName);
      if (result.error) throw result;
      if (testForFreeItem) addFreeItemsAsNeeded(cartName, result);
    } catch (err) {
      log.error(`[ShopifyHOC][getActiveCheckoutId] ${err}`, { err });
    }
  };

  const updateLineItemInCart = async (lineItemId, quantity, cartName = AvailableCarts.MainCart) => {
    const checkoutId = getCartIdByName(cartName);
    try {
      const result = await updateItem(checkoutId, lineItemId, quantity, cartName);
      addFreeItemsAsNeeded(cartName, result);
    } catch (err) {
      log.error('[ShopifyHOC][updateLineItemInCart] ' + err, { err });
    }
  };

  const removeLineItemInCart = async (
    lineItemId,
    cartName = AvailableCarts.MainCart,
    testForFreeItem = true
  ) => {
    const checkoutId = getCartIdByName(cartName);
    try {
      const result = await removeItem(checkoutId, [lineItemId]);
      if (testForFreeItem) addFreeItemsAsNeeded(cartName, result);
    } catch (err) {
      log.error('[ShopifyHOC][removeLineItemInCart] ' + err, { err, lineItemId, checkoutId });
    }
  };

  const appendGiftCard = async (giftCardCodes, cartName = AvailableCarts.MainCart) => {
    try {
      const checkoutId = getCartIdByName(cartName);
      const result = await appendGiftCardApi(checkoutId, giftCardCodes);
      addFreeItemsAsNeeded(cartName, result);
      return result;
    } catch (error) {
      return { error };
    }
  };
  const removeGiftCard = async (giftCardCodes, cartName = AvailableCarts.MainCart) => {
    try {
      const checkoutId = getCartIdByName(cartName);
      const result = await removeGiftCardApi(checkoutId, giftCardCodes);
      addFreeItemsAsNeeded(cartName, result);
      return result;
    } catch (error) {
      return { error };
    }
  };

  const applyDiscountCode = async (discountCode, cartName = AvailableCarts.MainCart) => {
    try {
      const checkoutId = getCartIdByName(cartName);
      const checkout = mainCartData.cart;
      const result = await applyDiscountCodeApi(checkoutId, discountCode);
      await addFreeItemsAsNeeded(cartName, result);
      if (result.error) {
        if (result.error.applyErrorCode) {
          dispatchDiscountCodeResponse(result.error.applyErrorCode);
        }
      } else {
        const appliedDiscount = await updateAttributes(
          checkoutId,
          checkout.customAttributes,
          'discountName',
          discountCode
        );

        dispatchDiscountCodeResponse('SUCCESS');
      }
    } catch (error) {
      return { error };
    }
  };

  const removeDiscountCode = async (cartName = AvailableCarts.MainCart) => {
    try {
      const checkoutId = getCartIdByName(cartName);
      const checkout = mainCartData.cart;
      const result = await removeDiscountCodeApi(checkoutId);
      const appliedDiscount = await updateAttributes(
        checkoutId,
        checkout.customAttributes,
        'discountName',
        ''
      );
      addFreeItemsAsNeeded(cartName, result);
    } catch (err) {
      return { error: err };
    }
  };

  const emptyCart = async (cartName: AvailableCarts) => {
    const cartId = getCartIdByName(cartName);
    const cart = await getCheckout(cartId);
    const edges = cart?.lineItems?.edges || [];
    // console.log("calling empty cart in shopify hoc", {edges})
    const lineItemIds = edges
      .filter(edge => edge?.node?.title !== "DON'T DELETE - not visible")
      .map(edge => edge.node.id);

    await removeItem(cartId, lineItemIds, AvailableCarts.MainCart);
  };

  const isDefaultShippingAddress = () => {
    const defaultShippingAddress = {
      address1: '-',
      address2: '-',
      zip: '-',
    };

    const checkout = mainCartData.cart;
    const shippingAddress = (checkout || {}).shippingAddress || defaultShippingAddress;

    let isDefault = true;
    for (let attr in defaultShippingAddress) {
      if (defaultShippingAddress[attr] != shippingAddress[attr]) isDefault = false;
    }
    return isDefault;
  };

  const dispatchDiscountCodeResponse = code => {
    commonDispatchers.dispatchSetDiscountCodeResponse(code);
  };

  const retrieveRedeemableItems = async discountCode => {
    try {
      const item = await getRedeemableItem(discountCode.toLowerCase());
      const variantId = item?.text;
      if (!variantId) return;
      // NOTE: add checker for if this product already exists in checkout
      let edges = mainCartData.cart.lineItems.edges;

      const variantIdEncoded = btoa(`gid://shopify/ProductVariant/${variantId}`);
      let found = false;
      edges.map(edge => {
        if (edge?.node?.variant?.id == variantIdEncoded) found = true;
      });
      if (!found) {
        await addVariantToCart(variantIdEncoded, 1);
      } else {
      }
    } catch (err) {
      log.error('[ShopifyHOC] retrieveRedeemableItems', { err });
    }
  };

  const removeVariant = async variantId => {
    try {
      let edges = mainCartData.cart.lineItems.edges;
      const variantIdEncoded = btoa(`gid://shopify/ProductVariant/${variantId}`);
      let idToRemove = null;

      edges.map(edge => {
        if (edge?.node?.variant?.id == variantIdEncoded) idToRemove = edge.node.id;
      });
      if (idToRemove) removeLineItemInCart(idToRemove);
      // NOTE: hacky!!! removeLineItemInCart is not async
      // FIXME:
      return new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      log.error('[ShopifyHOC] remove variant', { err, variantId });
    }
  };

  const updateCheckoutAttributes = async (key, value) => {
    try {
      const checkoutId = getCartIdByName(AvailableCarts.MainCart);
      const checkout = mainCartData.cart;
      const result = await updateAttributes(checkoutId, checkout.customAttributes, key, value);
      if (result.error) {
        log.error(`[ShopifyHOC][updateCheckoutAttributes] caught error ${result.error}`, {
          err: result.error,
        });
      } else {
        commonDispatchers.dispatchSetCheckout(result);
      }
    } catch (error) {
      log.error(`[ShopifyHOC][updateCheckoutAttributes] caught error ${error}`, { err: error });
    }
  };

  const associateCartToCustomer = async (checkoutId, customerAccessToken) => {
    return associateCartToCustomerApi(checkoutId, customerAccessToken);
  };

  const addVariantListToCart = async list => {
    const checkoutId = getCartIdByName(AvailableCarts.MainCart);
    return addItemListApi(checkoutId, list);
  };

  const updateShippingAddress = async (shippingAddress, cartName = AvailableCarts.MainCart) => {
    log.info('useCartFunctions.udpateShippingAddress', { shippingAddress, cartName });
    const checkoutId = getCartIdByName(cartName);
    log.info('useCartFunctions.udpateShippingAddress', { checkoutId, cartName });
    const result = await updateShippingAddressApi(checkoutId, shippingAddress, cartName);
    return result;
  };

  const createAccessToken = async (email, password) => {
    return createAccessTokenApi(email, password);
  };

  const autoApplyShippingLine = async (cartName = AvailableCarts.MainCart, from?: string) => {
    const checkoutId = getCartIdByName(cartName);
    return autoApplyShippingLineApi(checkoutId, cartName, from);
  };
  const toReturn = {
    addVariantListToCart,
    addVariantToCart,
    updateCheckoutAttributes,
    updateLineItemInCart,
    updateShippingAddress,
    createAccessToken,
    associateCartToCustomer,
    removeVariant,
    removeLineItemInCart,
    removeDiscountCode,
    removeGiftCard,
    retrieveRedeemableItems,
    isDefaultShippingAddress,
    applyDiscountCode,
    appendGiftCard,
    autoApplyShippingLine,
    emptyCart,
  };

  return toReturn;
}
