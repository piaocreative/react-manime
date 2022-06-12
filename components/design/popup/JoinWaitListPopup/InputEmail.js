import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { DarkButton } from 'components/basic/buttons';
import { subscribeToKlaviyo } from 'api/util';
import style from './css/input-email.module.css';
import log from 'utils/logging';


const CaptureEmail = ({ userData, 
  header="BREAK UP WITH 2020", 
  copy="Jackpot and Sugar Rush are the perfect way to glow up in the new year. Join the waitlist and be the first to know when these limited edition looks drop! ", 
  setIsSubscribed, 
  emailTemplate = "THqTt4", 
  primaryColor, secondaryColor }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const joinHandler = async ev => {
    ev.preventDefault();
    setLoading(true);
    try {
      const templateId = emailTemplate;
      await subscribeToKlaviyo(email, templateId);
      setIsSubscribed(true);
    } catch (err) {
      log.error('[InputEmail][joinHandler] caught error ' + err, {err, emailTemplate, header, copy});
    }
    setLoading(false);
  };

  const inputChangeHandler = ev => {
    setEmail(ev.target.value);
  };

  useEffect(() => {
    if (userData.email) {
      setEmail(userData.email);
    }
  }, [userData?.email]);

  return (
    <form className={style.container} onSubmit={joinHandler}>
      <div className={style.title}>{header}</div>
      <div className={style.description}>
        {copy}
      </div>
      <input
        autoFocus
        className={style.inputBox}
        type='email'
        placeholder='Enter your email address'
        required
        value={email}
        onChange={inputChangeHandler} />
      <DarkButton passedClass={style.joinButton} disabled={loading} type='submit'>
        JOIN WAITLIST
      </DarkButton>
    </form>
  );
};

const mapStateToProps = (state) => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(CaptureEmail);