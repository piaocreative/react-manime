import React from 'react';
import { useSelector } from 'react-redux';
import log from '../utils/logging'
import { AvailableCarts } from 'actions/cart'
import { isHiddenTitle } from 'utils/cartUtils';
import useCartFunctions from 'hooks/useCartFunctions';
import useCommonDispatchers from 'hooks/useComonDispatchers';

// NOTE: default checkouts move to new file
const input = {
  allowPartialAddresses: true,
  lineItems: [
    {
      quantity: 1,
      variantId: 'Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zMDAxNTkzMTk0MDk3Mw=='
    }
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
  }
}


export default function ShopifyHOC(WrappedComponent) {
  return function HOC(props){
    const cartFunctions = useCartFunctions();
    const commonDispatchers = useCommonDispatchers();
    const reduxState = useSelector((state)=> ({
      userData: state['userData'],
      uiData: state['uiData'],
      mainCartData: state[AvailableCarts.MainCart],
      groupGiftCartData: state[AvailableCarts.GroupGiftCart],
      profileIds: (state['profileData'].profiles || []).map(profile => ({profileId: profile.profileId, profileType: profile.profileType}))
    }))
    return (
      <WrappedComponent
        addVariantToCart={cartFunctions.addVariantToCart}
        addVariantListToCart={cartFunctions.addVariantListToCart}
        appendGiftCard={cartFunctions.appendGiftCard}
        removeGiftCard={cartFunctions.removeGiftCard}
        updateLineItemInCart={cartFunctions.updateLineItemInCart}
        removeLineItemInCart={cartFunctions.removeLineItemInCart}
        createAccessToken={cartFunctions.createAccessToken}
        associateCartToCustomer={cartFunctions.associateCartToCustomer}
        applyDiscountCode={cartFunctions.applyDiscountCode}
        updateShippingAddress={cartFunctions.updateShippingAddress}
        isDefaultShippingAddress={cartFunctions.isDefaultShippingAddress}
        updateCheckoutAttributes={cartFunctions.updateCheckoutAttributes}
        removeDiscountCode={cartFunctions.removeDiscountCode}
        removeVariant={cartFunctions.removeVariant}
        isHiddenTitle={isHiddenTitle}
        emptyCart={cartFunctions.emptyCart}
        autoApplyShippingLine={cartFunctions.autoApplyShippingLine}
        {...props} {...commonDispatchers} {...reduxState}
      />
    );
  };
}
