import React from 'react'
import { useSelector } from 'react-redux';
import styles from '@styles/gift/group/message.module.css'
import OrderTotals from 'components/gift/group/payment/Totals'
import { GroupGiftTotals } from 'api/order'
import { AvailableCarts } from 'actions/cart'

type RecipientInput = {
  fullName: string,
  email: string,
  isSelf?: boolean
}
type DiscountRates = {
  rate: number,
  quantity: number
}

type Props = {
  recipients: RecipientInput[],
  message: string,
  setMessage: Function,
  orderTotals: GroupGiftTotals & {DISCOUNT_RATES: DiscountRates[]},
}

export default function GroupGiftMessage({message, setMessage, recipients, orderTotals}: Props){

  const groupGiftCartData = useSelector((state : any) => state[AvailableCarts.GroupGiftCart]);


  const placeholder = 
`Write a gift message. Need help getting started?
Maybe something like:
    
Hey, I know how much you love getting your nails done so I thought you'd enjoy this high-tech manicure.`
  const _orderTotals = {...orderTotals};
  _orderTotals.perUnitShipping = undefined;
  return(
    <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Customize your Gift</div>
        </div>

        <div className={styles.messagePage}>
          <OrderTotals quantity={ recipients.length || 0}
            orderTotals={_orderTotals} />
          <div className={styles.outerTextArea}>
            <div className={styles.containerBow}>
              <img src='/static/icons/bow.svg'/>
            </div>
            Gift Message - we will send this in email
            <textarea
              className={styles.innerTextArea}
              rows={130}
              placeholder={placeholder}
              value={message}
              onChange={ev=>setMessage(ev.target.value)}
            />
          </div>
        </div>
    </div>
  )
}