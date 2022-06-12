import React, { useEffect, useState } from 'react';
import { decimalFormat } from 'utils/math';
import { calculateOrderData } from 'utils/calculateOrderData';
import style from '@styles/checkout/order-summary.module.css';
import cartStyles from '@styles/gift/group/cart.module.css';
import CollapseableCart from 'components/core/cart/horizontal';
import { AvailableCarts } from 'actions/cart';
import { useSelector } from 'react-redux';
import useCartFunctions from 'hooks/useCartFunctions';

import { calculateGroupGiftTotals, GroupGiftTotals } from 'api/order';
type Props = {
  orderTotals: GroupGiftTotals;
  quantity;
};
export default function OrderTotals({ orderTotals, quantity }: Props) {
  const groupGiftCart = useSelector((state: any) => state[AvailableCarts.GroupGiftCart]);

  return (
    <div className={style.root}>
      <div className={style.titleLine}>
        <div>Order Summary</div>
      </div>

      <div className={cartStyles.orderSummaryCart}>
        <CollapseableCart
          label={'Friends Gift Kit'}
          cart={groupGiftCart.cart}
          openOnCartChange={false}
          isCollapsable={false}
        />
      </div>

      <div className={style.oneLine}>
        <div>
          Shipping{' '}
          {orderTotals.perUnitShipping ? '(4-7 business days)' : '(calculated in checkout)'}
        </div>
        <div>
          {orderTotals?.perUnitShipping > 0 ? (
            `$${decimalFormat(orderTotals?.perUnitShipping)}`
          ) : orderTotals?.perUnitShipping === 0 ? (
            'Free'
          ) : (
            <div dangerouslySetInnerHTML={{ __html: '&ndash;&ndash;&ndash;' }} />
          )}
        </div>
      </div>

      <div className={style.oneLine}>
        <div>Discount: ({orderTotals?.perUnitDiscount * 100}%)</div>
        <div>
          <span>
            -
            {orderTotals &&
              decimalFormat(orderTotals?.perUnitSubtotal * orderTotals?.perUnitDiscount)}
          </span>
        </div>
      </div>

      <div className={style.line} />
      <div className={style.oneLine}>
        <div>Subtotal per gift kit: </div>

        <div>
          {orderTotals &&
            decimalFormat(
              orderTotals?.perUnitSubtotal +
                (orderTotals?.perUnitShipping || 0) -
                orderTotals?.perUnitSubtotal * orderTotals?.perUnitDiscount
            )}
        </div>
      </div>
      <div className={style.oneLine}>
        <div>Number of Recipients:</div>
        <div>{orderTotals && quantity}</div>
      </div>
      <div className={style.line} />
      {orderTotals?.kitTaxes > 0 && (
        <div className={style.oneLine}>
          <div>Taxes: </div>
          <div>
            <span>{decimalFormat(orderTotals.kitTaxes)}</span>
          </div>
        </div>
      )}
      <div className={style.oneLine}>
        <div className={style.bold}>Order Total: &nbsp;</div>
        <div className={style.bold}>${orderTotals && decimalFormat(orderTotals?.kitTotal)}</div>
      </div>
    </div>
  );
}
