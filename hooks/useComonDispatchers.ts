
import { SET_KEY_VALUE, SET_CART_SIDEBAR, 
  UI_SET_KEY_VALUE, } from 'actions';

import {SetCart, AvailableCarts, SetDiscountCodeResponse } from 'actions/cart'
import { useDispatch } from 'react-redux';
 
export default function useCommonDispatchers(){
  const dispatch = useDispatch();
  const dispachers = {

    dispatchSetKeyValue: (key, value) => dispatch(SET_KEY_VALUE(key, value)),
    dispatchSetCartSideBar: isOpen => dispatch(SET_CART_SIDEBAR(isOpen)),
    dispatchSetCheckout: checkout => dispatch(SetCart(checkout)),

    dispatchSetGroupGiftCart: checkout => dispatch(SetCart(checkout, AvailableCarts.GroupGiftCart)),
    dispatchSetDiscountCodeResponse: code => dispatch(SetDiscountCodeResponse(code)),
    dispatchSetUIKeyValue: (key, value) => dispatch(UI_SET_KEY_VALUE(key, value)),

  };
  return dispachers;
}
 