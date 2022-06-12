import React, {useEffect, useState} from 'react';

import { useSelector } from 'react-redux';
import ShopifyHOC from 'components/ShopifyHOC';
import style from '@styles/gift/group/cart.module.css';
import useCartFunctions from 'hooks/useCartFunctions';
import { StyledStandardDarkButton } from 'components/styled/StyledComponents';
import CollapseableCart from 'components/core/cart/horizontal'
import FreeShippingBanner from './FreeShippingBanner'
import { AvailableCarts } from 'actions/cart';

type Props ={
  onShopClickNext: Function,
  label: string,
  step: string,
  cartName: AvailableCarts
}
function BottomCart(props:Props) {
  const cartFunctions = useCartFunctions();

  const cart = useSelector(
    (state) => state[props.cartName].cart
  );

  const updateLineItemInSpecificCart = (variantId, quantity) =>
    cartFunctions.updateLineItemInCart(variantId, quantity, props.cartName);
    
  return (
    <div className={style.bottomCart}>
      <div className={style.bow}>
        <img src='/static/icons/bow.svg'/>
      </div>
      <CollapseableCart step={props.step} updateLineItem={updateLineItemInSpecificCart} cart={cart}/>
      <FreeShippingBanner />
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
