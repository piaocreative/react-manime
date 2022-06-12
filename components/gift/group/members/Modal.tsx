import React, { useEffect, useState } from 'react';
import UserCircle from 'static/icons/user-circle';
import { StandardInput } from 'components/styled/StyledComponents';
import { DarkButton, OutlinedButton } from 'components/basic/buttons';
import { removeClientSetsFromDocument } from '@apollo/client/utilities';
import styles from '@styles/gift/group/members.module.css';
import checkMobile from 'utils/checkMobile'

function Modal({ isOpen, cancel, submit, remove, setFullName, setEmail, fullName, email, editRowIndex, errorMessage }) {
  const isMobile = checkMobile();
  let desktop = !isMobile && styles.desktop;

  return (
    <>
      {isOpen && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
          className={`${styles.modalOverlay}`}
        >
          <div
            className={`${styles.modalContainer} ${desktop}`}
            onClick={(ev) => {
              ev.stopPropagation();
            }}
          >
            <img
              className={styles.closeModal}
              src="/static/icons/close-dark-icon.svg"
              alt='close'
              onClick={(event) => {
                event.stopPropagation();
                cancel();
              }} />
            <UserCircle
              stroke={'#f7bfa0'}

              strokeWidth={'.8'}
              height={"80"}
              width={"80"}
            />
            <div className={styles.modalTitle}>New Recipient</div>
            <div className={styles.subTitle}>The recipient will receive an email to redeem the ManiBox.</div>

            <StandardInput
              autoFocus
              className={styles.input}
              value={fullName}
              onChange={(ev) => setFullName(ev.target.value)}
              placeholder={'Full Name'}
            />

            <StandardInput
              value={email}
              className={styles.input}
              onChange={(ev) => setEmail(ev.target.value.replace(' ', ''))}
              placeholder="Email"
            />

            <div className={styles.error}>
              {errorMessage}
            </div>
            <div className={styles.buttonRow}>
            {editRowIndex !== -1 && (
                <>

                  <OutlinedButton
                    onClick={() => remove(editRowIndex)}
                    style={{ flex: 1, backgroundColor: 'white' }}
                  >
                    Remove
                  </OutlinedButton>
                  <div className={styles.betweenButtonPadding}></div>
                </>
              )}
              <DarkButton onClick={submit} style={{ flex: 1 }}>
                {editRowIndex !== -1 ?
                   'Update' : 'Add Recipient'
                }
              </DarkButton>

            </div>
          </div>
        </form>
      )}
    </>
  );
}

export default Modal;
