import React, { useEffect, useState } from 'react';
import { decimalFormat } from 'utils/math';
import { calculateOrderData } from 'utils/calculateOrderData';
import checkoutStyle from '@styles/checkout/order-summary.module.css';
import style from '@styles/subscription/redeem.module.css'
import cartStyles from '@styles/gift/group/cart.module.css';
import CollapseableCart from 'components/core/cart/horizontal'
import { AvailableCarts } from 'actions/cart';
import { useSelector } from 'react-redux';


export default function OrderSummary() {


  const cart = useSelector(
    (state : any) => state[AvailableCarts.SubscriptionCart]
  );

  return (
    <div className={`${checkoutStyle.root} ${style.orderSummary}`}>


      <div className={`${cartStyles.orderSummaryCart} ${style.orderSummaryCart}`}>
        <CollapseableCart label={'Subscription'} hidePrice={true} cart={cart.cart} openOnCartChange={false} isCollapsable={false} openHeight='130px'/>
      </div>
    </div>
  );
}
