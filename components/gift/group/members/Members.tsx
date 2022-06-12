import React, {useState, useRef, useEffect} from 'react'
import { useSelector } from 'react-redux';
import { scrollToTop } from 'utils/scroll';
import Control from './Control'

import Modal from './Modal'
import Recipient from './Recipient'
import OrderTotals from 'components/gift/group/payment/Totals'
import { validateEmail } from 'utils/validation'
import styles from '@styles/gift/group/members.module.css'
import {GroupGiftTotals, calculateGroupGiftTotals} from 'api/order'
import { AvailableCarts } from 'actions/cart';

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
  selfRecipient: RecipientInput,
  recipients: RecipientInput[],
  orderTotals: GroupGiftTotals & {DISCOUNT_RATES: DiscountRates[]},
  setRecipients: Function,
  setOrderTotals: Function,
  track: Function
}
export default function GroupGiftMembers({
  recipients,
  setRecipients,
  setOrderTotals,
  selfRecipient,
  orderTotals = { 
    perUnitDiscount: 0,
    perUnitSubtotal: 0,
    perUnitShipping: undefined,
    kitTotal: 0,
    kitTaxes: 0,
    DISCOUNT_RATES: []
  },
  track
} : Props){
  const [active, setActive] = useState(0);
  const [isAdding, setIsAdding] = useState(false)
  const [editRowIndex, setEditRowIndex] = useState(-1);
  const cartData = useSelector((state : any) => state[AvailableCarts.GroupGiftCart]);
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [errorMessage, setErrorMessage] = useState("");
  
  function add(){
    setIsAdding(true)
    
  }

  function _track(message, data?){
    track(`[Members]${message}`, data);
  }


  function validInput(): boolean {

    let toReturn = true
    if (!(fullName.trim()) || fullName.trim()?.split(' ').length < 2) {
      setErrorMessage('Invalid full name.');
      toReturn = false;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Invalid email address.');
      toReturn = false;
    }

    return toReturn;
  }

  async function resetForm(newRecipients){
    setIsAdding(false);
    setFullName("")
    setEmail("")
    setEditRowIndex(-1)
    setErrorMessage("");
    if(newRecipients){
      setRecipients(newRecipients);
      const temp = await calculateGroupGiftTotals(cartData.cart, newRecipients.length)
      setOrderTotals(temp);
    }

  }
  async function inputCallback(){

    if(!validInput()){
      // resetForm();
      return;
    }
    
    if(editRowIndex !== -1){
      recipients[editRowIndex].fullName = fullName;
      recipients[editRowIndex].email = email;
    }else{
      _track("Adding Recipient")
      recipients.push({fullName, email})
    }

    scrollToTop();
    resetForm([...recipients]);


  }
  useEffect(()=>{
    _track('mounting')
  },[])

  useEffect(()=>{
    if(recipients?.length >=8){
      setActive(2)
    }else if(recipients?.length >=4){
      setActive(1)
    }else{
      setActive(0)
    }
  }, [recipients])

  function removeRow(index){
    if(index <= recipients.length){
      _track("Removing Recipient")
      const newArray = [...recipients]

      newArray.splice(index, 1);

      resetForm(newArray);
    }
  }

  function editRow(index){
    setEditRowIndex(index)
    setFullName(recipients[index].fullName);
    setEmail(recipients[index].email)
    setIsAdding(true)
  }
  const promoComponents = [];
  const labelComponents = []
  const quantities = []
  const _orderTotals = {...orderTotals};
  _orderTotals.perUnitShipping = undefined;
  for (const discount of orderTotals.DISCOUNT_RATES){
    promoComponents.push(
      <div key={discount.rate} className={`${styles.item} ${(orderTotals.perUnitDiscount === discount.rate) && styles.active}`}>
        {discount.rate * 100}% off
      </div>
    )
    quantities.push(discount.quantity);
    if(quantities.length == 2){
      labelComponents.push(
        <div key={`label-${labelComponents.length}`} className={`${styles.item} `}>{quantities[0]}-{quantities[1] - 1} Recipients</div>
      )
      quantities.shift();
    }
  }
  labelComponents.push(
    <div key={`label-${labelComponents.length}`} className={`${styles.item} `}>{quantities[0]} or more Recipients</div>
  )

  return(
    <div style={{justifyContent: 'center', alignItems: 'center'}}>
      <div className={styles.header}>
        <div className={styles.title}>Select your recipients</div>
        <div>Who are the recipients of this ManiBox</div>
        <div>Each one will recieve the manibox you created</div>
      </div>
      <div className={styles.guestPage}>
        <OrderTotals quantity={recipients.length || 0}
          orderTotals={_orderTotals} />
        <div>
          <div className={styles.promoSection}>
            {promoComponents}
          </div>
          <div className={`${styles.promoSection} ${styles.promoOverride} `}>
            { labelComponents }
          </div>
          <Control add={add} count={recipients.length} selfRecipient={selfRecipient} recipients={recipients} setRecipients={setRecipients}/>
          <div className={styles.recipients}>
            { recipients.map((input, index)=> input.isSelf ? null: <Recipient key={`recipient-${index}`} fullName={input.fullName} email={input.email} isSelf={input.isSelf} editRow={editRow} index={index}/>)}
            <div className={styles.spaceLine}/>
          </div>
        </div>
      </div>
        <Modal submit={inputCallback} isOpen={isAdding} cancel={resetForm} remove={removeRow} editRowIndex={editRowIndex} email={email} fullName={fullName} setEmail={setEmail} setFullName={setFullName} errorMessage={errorMessage}/>
    </div>
  )
}