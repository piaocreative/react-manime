import React from 'react'
import { decimalFormat } from 'utils/math'
import styles from '@styles/gift/group/message.module.css'

export default function Overview({ orderTotals, recipients }) {
  return (
    <div className={styles.overviewContainer}>
      <img className={styles.bow} src='/static/icons/bow.svg' alt='bow' />
      <div className={styles.orderTotalContainer}>
        <div className={styles.line}>
          <span>
            Subtotal per gift kit (inc discount and shipping)
          </span>
          <span>
            ${orderTotals && decimalFormat(
            orderTotals.perUnitSubtotal +
              orderTotals.perUnitShipping -
              orderTotals.perUnitSubtotal * orderTotals.perUnitDiscount
            )}
          </span>
        </div>
        <div className={styles.line}>
          <span>
            Number of recipients
          </span>
          <span>{recipients.length || 0}</span>
        </div>
        <div className={styles.line}>
          <span>
            Taxes
          </span>
          <span>${decimalFormat( orderTotals.kitTaxes )}</span>
        </div>
        <div className={styles.orderTotalLine}>
          <span>Order Total</span>
          <span>${orderTotals && decimalFormat(orderTotals.kitTotal)}</span>
        </div>
      </div>
    </div>
  );
}