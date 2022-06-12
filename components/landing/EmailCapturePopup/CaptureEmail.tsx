import React, { useState } from 'react';
import Link from 'next/link';
import { DarkButton } from 'components/basic/buttons';
import { pageLinks } from 'utils/links';
import { sendKlaviyoEmail, subscribeToKlaviyo } from 'api/util';
import style from './css/email-capture-popup.module.css';
import style1 from './css/capture-email.module.css';
import log from 'utils/logging'
const EmailCapturePopup = ({ setIsSubscribed, email, setEmail }) => {
  const [loading, setLoading] = useState(false);
  const changeInputHandler = ev => {
    ev.preventDefault();
    setEmail(ev.target.value);
  };

  const joinHanlder = async ev => {
    ev.preventDefault();
    try {
      setLoading(true);
      await subscribeToKlaviyo(email, 'R3Q8BA');
      sendKlaviyoEmail({
        templateId: 'Xa8QX8',
        subject: 'Welcome to the future of manicures!',
        fromName: 'ManiMe',
        user: {email, name: ''}
      });
      setIsSubscribed(true);
    } catch (err) {
      log.error('[CaptureEmail][joinHandler] ' + err, {err});
    }
    setLoading(false);
  };

  return (
    <>
      <img
        className={style1.imgMaxTopCoatStyle}
        src='https://cdn.shopify.com/s/files/1/0253/6561/0605/files/first-order.png?v=1602186690'
        alt='free-max-top-coat' />
      <form className={style.actionPanel} onSubmit={joinHanlder}>
        <div className={style.inputPanel}>
          <div className={style1.label}>UNLOCK</div>
          <div className={style1.bigLabel}>20% OFF</div>
          <div className={style1.label}>YOUR FIRST ORDER</div>
          {/* <div className={style.title}>FREE MAX TOP COAT ON US!</div>
          <div className={style.description}>
            Join and receive our Max Top Coat with your first order, plus exclusive product launches and insider nail tips!
          </div> */}
          <input
            type='email'
            required
            className={style.inputBox}
            placeholder='Email Address'
            value={email} onChange={changeInputHandler} />
          <DarkButton passedClass={style.joinButton} isSmall type='submit' disabled={loading}>
            JOIN MANIME
          </DarkButton>
        </div>
        <div className={style.greyLine}>
          By joining ManiMe, you agree to the <Link href={pageLinks.Privacy.url}><a className={style.linkStyle}>Privacy Policy</a></Link> and <Link href={pageLinks.Terms.url}><a className={style.linkStyle}>Terms of Use</a></Link>
        </div>
      </form>
    </>
  );
};

export default EmailCapturePopup;
