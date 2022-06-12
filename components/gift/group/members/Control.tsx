import React from 'react';
import Recipient from './Recipient';
import style from '@styles/gift/group/members.module.css';
import UserCircle from 'static/icons/user-circle';

type RecipientInput = {
  fullName: string,
  email: string,
  isSelf?: boolean
}

type Props = {
  selfRecipient: RecipientInput,
  recipients: RecipientInput[],
  count: number,
  add: Function,
  setRecipients: Function,
}
export default function Control(props: Props) {

  const { recipients, setRecipients, selfRecipient } = props;
  const myself = selfRecipient;
  const isSelfIncluded = recipients?.[0]?.isSelf;

  function onTogleSelf () {
    let newRecipients = [...recipients];
    if (isSelfIncluded) {
      newRecipients = newRecipients.filter(recipient => !(recipient.isSelf));
    } else {
      newRecipients = [selfRecipient, ...newRecipients];
    }
    setRecipients(newRecipients);
  }

  return (
      <div className={style.control}>
        <link href="https://use.fontawesome.com/releases/v5.8.1/css/all.css" rel="stylesheet"></link>
        <div >
          Recipients
        </div>
        <div className={style.count} >
          {props.count}
        </div>
        {myself &&
          <div className={style.myselfWrapper}>
            <Recipient  
              fullName={myself.fullName}
              email={myself.email}
              isSelf={myself.isSelf}
              isSelfIncluded={isSelfIncluded}
              index={0}
              toggleSelf={onTogleSelf} />
          </div>
        }
        <div className={style.button} onClick={()=>props.add()}>
          <UserCircle  stroke={'#F7BFA0'} fill={"white"} height={30} width={30}  />
          <div className={style.buttonLabel}>
            Add Another Recipient
          </div>
          <div className={style.plus} >+</div>
        </div>
      </div>
  )
}