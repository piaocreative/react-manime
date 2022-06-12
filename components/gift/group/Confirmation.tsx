
import React, { useState, useEffect } from 'react'
import Banner from './confirmation/Banner'
import NextStep from './confirmation/NextStep'
import RecipientList from './confirmation/RecipientList'
import OrderTotals from './payment/Totals'

import { calculateGroupGiftTotals, GroupGiftTotals } from 'api/order'

import styles from '@styles/gift/group/confirmation.module.css'

type Props = {
  message: string,
  recipients: Recipient[],
  userData: any,
  groupGiftCart: any
  track: Function,
  orderTotals: GroupGiftTotals
}

type Recipient = {
  fullName: string,
  email: string
}


export default function Confirmation({ message, recipients, userData, groupGiftCart, track, orderTotals}: Props){

  const {email, name: {lastName, firstName}} = userData;

  function _track(message, data?){    
    track(`[Confirmation]${message}`, data);
  }

  return(
    <div className={styles.container}>
      <Banner />
      <div className={styles.wrapper}>
        <NextStep />
        <OrderTotals
          quantity={ recipients.length || 0}
          orderTotals={orderTotals} />

        <RecipientList recipients={recipients} message={message} />
      </div>
    </div>
  )
}