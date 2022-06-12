import React, {useEffect, useState} from 'react';

import { useSelector } from 'react-redux';
import { countTypesInCart } from 'utils/cartUtils';
import style from '@styles/gift/group/cart.module.css';
import useCartFunctions from 'hooks/useCartFunctions';
import { StyledStandardDarkButton } from 'components/styled/StyledComponents';
import HorizontalCart from 'components/core/cart/horizontal'
import { AvailableCarts } from 'actions/cart';
import { SubscriptionPlan } from 'types';

type Props ={
  onShopClickNext: Function,
  label: string,
  step: string,
  cartName: AvailableCarts,
  hidePrice: boolean,
  planTerms: SubscriptionPlan,
  error: string,
}
function BottomCart({hidePrice = false, ...props}:Props) {
  const cartFunctions = useCartFunctions();
  const { planTerms } = props;

  const cart = useSelector(
    (state) => state[props.cartName].cart
  );

  const updateLineItemInSpecificCart = (variantId, quantity) =>
    cartFunctions.updateLineItemInCart(variantId, quantity, props.cartName);



  function typeCountToString(counts){
    let strReturn = ''
    for (const [key, value] of Object.entries(counts)) {
      strReturn += `${value} ${key} `;
    }
    return strReturn === '' ? 'None Selected' : strReturn;
  }
    
  return (
    <div className={style.bottomCart}>
      <div className={style.bow} style={{height: '30px', color: 'red'}}>

      </div>
      <HorizontalCart label={
          typeCountToString(countTypesInCart(cart))
        } isCollapsable={false} step={props.step} 
        showCartCount={false}
        updateLineItem={updateLineItemInSpecificCart} 
        cart={cart} hidePrice={hidePrice} error={props.error}/>
      <div className={style.buttonSection} >
        <StyledStandardDarkButton
            style={{width: '100%'}}
            fontSize="14px"
            height='100%'
            onClick={props.onShopClickNext}
          >
            {props.label}
          </StyledStandardDarkButton>
      </div>
    </div>
  );
}


export default BottomCart
