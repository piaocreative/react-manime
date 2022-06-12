export enum CheckoutActions {
  SetCart="SetCart", 
  SetShippingData="SetShippingData", 
  SetDiscountCode='SetDiscountCode', 
  SetDiscountCodeResponse='SetDiscountCodeResponse', 
  MergeCart='MergeCart', 
  UpdateCart='UpdateCart',
  SetCartReadyStatus='SetCartReadyStatus'
}

export enum AvailableCarts {
  MainCart='mainCartData',
  GroupGiftCart='groupGiftCartData',
  SubscriptionCart='subscriptionCart'
}
export const SetCart = (cart: any, cartName=AvailableCarts.MainCart) => ({
  type: CheckoutActions.SetCart,
  cartName,
  cart
});

export const SetShippingData = (items: any, cartName=AvailableCarts.MainCart) => ({
  type: CheckoutActions.SetShippingData,
  items,
  cartName
});

export const SetCartReadyStatus = (isReady : boolean, cartName=AvailableCarts.MainCart) => ({
  type: CheckoutActions.SetCartReadyStatus,
  isReady,
  cartName
})

export const SetDiscountCodeResponse = (code: string, cartName=AvailableCarts.MainCart) => ({
  type: CheckoutActions.SetDiscountCodeResponse,
  code,
  cartName
});
export const SetDiscountCode = (discountCode: string, cartName=AvailableCarts.MainCart) => ({
  type: CheckoutActions.SetDiscountCode,
  discountCode,
  cartName
});

export const MergeCart = (cart: any, cartName=AvailableCarts.MainCart) => ({
  type: CheckoutActions.MergeCart,
  cart,
  cartName
})

export const UpdateCart = (cart: any, from, meta=undefined, cartName=AvailableCarts.MainCart) => ({
  type: CheckoutActions.UpdateCart, 
  cartName,
  cart,
  from,
  meta
})

