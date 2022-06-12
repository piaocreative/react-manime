import React from 'react'
import classNames from 'classnames';
import styles from '@styles/gift/group/members.module.css'
import UserCircle from 'static/icons/user-circle'
import CheckIcon from 'components/icons/CheckIcon'


type Props = {
  fullName: string,
  email: string,
  editRow?: Function,
  toggleSelf?: Function,
  isSelf?: boolean,
  isSelfIncluded?: boolean,
  index: number,
}

export default function Recipient({fullName, email, editRow, isSelf, index, isSelfIncluded, toggleSelf }: Props){

  function onClickHandler () {
    editRow && editRow(index);
  }

  function toggleSelfHandler () {
    toggleSelf && toggleSelf();
  }

  return (
    <div className={`${styles.recipient} ${styles.spaceLine}`} key={index} onClick={onClickHandler}>
      <UserCircle  height={30} width={30} />
      <div className={styles.recipeintDetails}>
        <div className={styles.name}>{fullName} {isSelf && '(you)'}</div>
        <div>{email}</div>
      </div>
      {(toggleSelf && isSelf) ?
        <div className={classNames(styles.pencilContainer, !isSelfIncluded && styles.grayContainer)} onClick={toggleSelfHandler}>
          {isSelfIncluded ?
            <CheckIcon />:
            '+'
          }
        </div>:
      editRow ? 
        <div className={styles.pencilContainer} >
          <img src='/static/icons/pencil.svg' style={{width: '55%'}}/>
        </div>
      :
        null
      }
    </div>
  )
}