import React, { useState, useEffect } from 'react';
import CaptureEmail from './CaptureEmail';
import CaptureSuccess from './CaptureSuccess';
import { getItemFromLocalStorage, setItemToLocalStorage } from '../../../utils/localStorageHelpers';
import style from './css/email-capture-popup.module.css';
import log from '../../../utils/logging'
const EmailCapturePopup = ({ isMobileView, isAuth }) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [opened, setOpen] = useState(true);
  const [displayed, setDisplay] = useState(false);
  const [email, setEmail] = useState('');
  
  const init = () => {
    const isFirstVisit = getItemFromLocalStorage('firstVisit', '');
    if (!isFirstVisit) {
      try {
        document.getElementById('email-capture').className += ` ${style.move}`;
        setDisplay(true);
      } catch (err) {
        log.error('[EmailCapturePopup][init] ' + err, {err});
      }
    } else {
      setOpen(false);
    }
    setItemToLocalStorage('firstVisit', 'true');
  };

  const closeHandler = () => {
    setOpen(false);
    setItemToLocalStorage('firstVisit', 'true');
  };

  useEffect(() => {
    if (!isAuth) {
      setTimeout(init, 3000);
    } else {
      setItemToLocalStorage('firstVisit', 'true');
    }
  }, [isAuth]);

  if (!opened) {
    return null;
  }

  return (
    <>
      {displayed && <div className={style.overlay} />}
      <div className={style.container} id='email-capture'>
        <img
          className={style.closeButton}
          src='/static/icons/close-dark-icon.svg'
          onClick={closeHandler}
          alt='close' />
        {isSubscribed?
          <CaptureSuccess onClose={closeHandler} isMobileView={isMobileView} email={email}/>:
          <CaptureEmail
            email={email}
            setEmail={setEmail}
            setIsSubscribed={setIsSubscribed} />
        }
      </div>
    </>
  );
};

export default EmailCapturePopup;
