
import React from 'react';
import { useRouter } from 'next/router';
import Recipient from '../members/Recipient';
import styles from '@styles/gift/group/confirmation.module.css'

type Props = {
  recipients: Recipient[],
  message?: string,
}

type Recipient = {
  fullName: string,
  email: string,
  isSelf?: boolean,
}

export default function RecipientList ({ recipients, message }: Props) {

  const router = useRouter();

  function onBackHandler() {
    // TODO: change later
    router.push('/gift/group/guests');
  }

  return (
    <div className={styles.recipientListContainer}>
      <div className={styles.recipientTitle}>
        Recipients Summary
      </div>
      <div className={styles.recipientCounts}>
        <span className={styles.label}>{recipients?.length} Recipients</span>
        <div className={styles.editRecipients} onClick={onBackHandler}>Edit</div>
      </div>
      { recipients.map((input, index)=>
        <Recipient
          key={index}
          fullName={input.fullName}
          email={input.email}
          isSelf={input.isSelf}
          index={index} />)
      }
      <div className={styles.messagePanel}>
        <span className={styles.label}>Message:</span> {message}
      </div>
    </div>
  );
};