// User Data

export const UI_SET_KEY_VALUE = (key, value) => ({
  type: 'UI_SET_KEY_VALUE',
  key,
  value
});

export const SET_KEY_VALUE = (key, value) => ({
  type: 'SET_KEY_VALUE',
  key,
  value
});
export const SET_PROFILE_KEY_VALUE = (profileId, key, value) => ({
  type: 'SET_PROFILE_KEY_VALUE',
  profileId,
  key,
  value
});
export const SET_IS_COGNITO_AUTH = isCognitoAuth => {
  return {
    type: 'SET_IS_COGNITO_AUTH',
    isCognitoAuth
  }
};

export const SET_FIT_STATUS = fitStatus => ({
  type: 'SET_FIT_STATUS',
  fitStatus
});

export const SET_IDENTITY_ID = identityId => ({
  type: 'SET_IDENTITY_ID',
  identityId
});

export const SET_USER_AND_PROFILE = ({userData, profileData}) => {
  return (
    {
      type: 'SET_USER_AND_PROFILE',
      userData,
      profileData
    }
  )
};


export const SET_STRIPE_ID = stripeId => ({
  type: 'SET_STRIPE_ID',
  stripeId
});

// export const SET_REFERRAL_ID = referralId => ({
//   type: 'SET_REFERRAL_ID',
//   referralId
// });
// export const GET_REFERRAL_ID = () => ({
//   type: 'GET_REFERRAL_ID'
// });
export const SET_ORDER_RATING = (ratingType, ratingValue, orderId) => ({
  type: 'SET_ORDER_RATING',
  ratingType, ratingValue, orderId
});

export const SUBSTRACT_ITEM_QUANTITY = item => ({
  type: 'SUBSTRACT_ITEM_QUANTITY',
  item
});
export const ADD_ITEM_QUANTITY = item => ({
  type: 'ADD_ITEM_QUANTITY',
  item
});

export const REPLACE_CART_ITEMS = (checkoutId, checkout) => ({
  type: 'REPLACE_CART_ITEMS',
  checkoutId, checkout
});


export const SET_CART_SIDEBAR = isOpen => ({
  type: 'SET_CART_SIDEBAR',
  isOpen
});

export const SET_MENU_SIDEBAR = isOpen => ({
  type: 'SET_MENU_SIDEBAR',
  isOpen
});

export const SET_FLOW = flowName => ({
  type: 'SET_FLOW',
  flowName
});


export const SET_PRODUCTS_DATA = products => ({
  type: 'SET_PRODUCTS_DATA',
  products
});

export const SET_PRODUCTS_MAP = productsMap => ({
  type: 'SET_PRODUCTS_MAP',
  productsMap
});

export const UPDATE_PRODUCTS_MAP = productsMap => ({
  type: 'UPDATE_PRODUCT_MAP',
  productsMap
})


export const SET_SHIPPING_ABROAD = isOpen => ({
  type: 'SET_SHIPPING_ABROAD',
  isOpen
});
