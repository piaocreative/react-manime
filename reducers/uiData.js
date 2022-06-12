
import {CheckoutActions} from 'actions/cart'
const initialState = {
  isLoading: false,
  shippingAddresses: [],
  isCartOpen: false,
  isMenuOpen: false,
  isShippingAbroadOpen: false,
  isVideoDialogOpen: false,
  joinWaitList: {
    productId: '',
    open: false
  }
}

const uiData = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.isLoading };
    case CheckoutActions.SetShippingData:
      return { ...state, shippingAddresses: action.items };
    case 'SET_CART_SIDEBAR':
      return { ...state, isCartOpen: action.isOpen };
    case 'SET_MENU_SIDEBAR':
      return { ...state, isMenuOpen: action.isOpen };
    case 'SET_FLOW':
      return { ...state, flowName: action.flowName };
    case 'UI_SET_KEY_VALUE':
      return { ...state, [action.key]: action.value };
    case 'SET_SHIPPING_ABROAD':
      return { ...state, isShippingAbroadOpen: action.isOpen };
    default:
      return state;
  }
};

export default uiData;
