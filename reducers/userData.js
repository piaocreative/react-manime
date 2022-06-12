const initialState = {
  isCognitoAuth: false,
  isAuth: undefined,
  identityId: '',
  email: '',
  designPref: ['', '', ''],
  checkoutId: undefined,
  profileId: '001',
  isReady: false
  // FIXME: move to cart
  // checkout: undefined,
};

const userData = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_KEY_VALUE':
      return { ...state, [action.key]: action.value };
    case 'SET_IS_COGNITO_AUTH':
      // setting to false because this represents the shift between auth to unauth, or reverse. 
      // it means that the Account script still needs to hydrate a user and send it's event, 
      // so the user is not ready until this happens. 
      return { ...state, isCognitoAuth: action.isCognitoAuth, isReady: false };
    case 'SET_FIT_STATUS':
      return { ...state, fitStatus: action.fitStatus };
    case 'SET_IDENTITY_ID':
      return { ...state, identityId: action.identityId };
    case 'SET_STRIPE_ID':
      return { ...state, stripeId: action.stripeId };
    case 'SET_USER_AND_PROFILE':
      if(action.userData.email){
        process.EMAIL = action.userData.email
      }
      return { ...action.userData, isReady: true };

    case 'RESET_USER_DATA':
      process.EMAIL = undefined;
      return initialState;
    default:
      return state;
  }
};

export default userData;
