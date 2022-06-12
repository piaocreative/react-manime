
import {CheckoutActions, AvailableCarts} from 'actions/cart'
import log from 'utils/logging'
const initialState = {
  cart: {
    id: undefined
  },
  discountResponse: undefined,
  appliedDiscountCode: '',
  isReady: false
};

const cartData = (cartName=AvailableCarts.MainCart) => (state = initialState, action) => {
  if(action.type === 'RESET_USER_DATA'){
    return initialState;
  } 
  // setting to false because this represents the shift between auth to unauth, or reverse. 
  // it means that the Account script still needs to hydrate a user and send its event, 
  // so the user is not ready until this happens. 
  if (action.type === 'SET_IS_COGNITO_AUTH') {
    return { ...state, isReady: false };
  }
  if (action.cartName === cartName) {
    switch (action.type) {
      case CheckoutActions.SetCartReadyStatus:
        return { ...state, isReady: action.isReady}
  
      case CheckoutActions.SetCart:
        return { ...state, cart: action.cart, isReady: true };
  
      case CheckoutActions.SetDiscountCodeResponse:
        return { ...state, discountResponse: action.code };
        
      case CheckoutActions.SetDiscountCode:
        return { ...state, appliedDiscountCode: action.discountCode };
        
      case CheckoutActions.UpdateCart:
       /* log.info(`updating cart `, {
          from: action.from,
          cart: action.cart
        }) */
        if(action.cart?.id ===  state.cart?.id){
          return {...state, cart: action.cart}
        }
        log.error("Trying to UpdateCart but cart id does not match this cart, no op" ,
          {
            stateCartId: state.cart?.id, 
            actionCartId: action.cart?.id,
            from: action.from,
            meta: action.meta,
            isReady: state.isReady
          });
        return state;
  
      default:
        return state;
    }  
  }
  return state
};

export default cartData;
