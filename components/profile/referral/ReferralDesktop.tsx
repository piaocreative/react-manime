import React, { useState } from 'react';

import SocialShare from './SocialShare';
import { DarkButton } from '../../basic/buttons';
import { validateEmail, validatePhoneNumber } from 'utils/validation';
import { sendSMS, sendKlaviyoEmail } from 'api/util';
import log from 'utils/logging';
import { copyTextToClipboard } from 'utils/clipboard';
import config from 'config';
import constants from '../../../constants';
import CheckIcon from '../../icons/howto/CheckIcon';
import style from './css/referral-desktop.module.css';

const tabs = [
  'Email', 'Sms'
];

const INITIAL_MESSAGE = `I’ve been loving getting a custom mani at home with ManiMe and I think you will too. Get $${constants.referral.NORMAL_REFERREE_CREDIT} off your first order when you shop my link!`

const ReferralDesktop = ({ title, giveAndGetTitle, description, shareLink='', userData }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [emailTo, setEmailTo] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState(INITIAL_MESSAGE);
  const [errorStatus, setErrorStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);

  const tabChangeHandler = index => () => {
    setSelectedTab(index);
  };

  const inputHandler = ev => {
    if (ev.target.name === 'phoneNumber') {
      let phoneNum = ev.target.value;
      if (phoneNumber.length > ev.target.value.length) {
        setPhoneNumber(ev.target.value);
      } else {
        phoneNum = ev.target.value.replace(/\D/g,'');
        phoneNum = '(' + phoneNum.substring(0,3) + ') ' + phoneNum.substring(3,6) + ' - ' + phoneNum.substring(6,10);
        setPhoneNumber(phoneNum);
      }
    } else {
      if (ev.target.name === 'emailTo') {
        setEmailTo(ev.target.value);
      } else if (ev.target.name === 'message') {
        setMessage(ev.target.value);
      }
    }
  };

  const sendSMSHandler = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setErrorStatus('Invalid phone number');
      return;
    }
    setErrorStatus('');
    setIsLoading(true);
    setCopyStatus(false);

    log.info('[friends] send sms');
    const firstName = userData?.name?.firstName;
    const prependMessage = firstName ? `Hey this is ${firstName}, I think you'll like ManiMe! ` : `Hey, check out ManiMe! `
    try {
      await sendSMS(phoneNumber.replace(/\D/g,''), `${prependMessage} ${message} Please continue using ${shareLink}`);
    } catch (err) {
      log.error('[referral] error sending referral sms ' + err, { err } );
    }
    setIsLoading(false);
    setIsSuccess(true);
  }

  const sendEmailHandler = async () => {
    if (!validateEmail(emailTo)) {
      setErrorStatus('Invalid email address');
      return;
    }
    setErrorStatus('');
    setIsLoading(true);
    setCopyStatus(false);

    log.info('[referral] send email');
    try {
      await sendKlaviyoEmail({
        templateId: config.klaviyoTemplate.referred,
        subject: `My New Nail Obsession`,
        user: {email: emailTo, name: 'there'},
        context: {
          message: message,
          sender: userData?.name?.firstName || '',
          link: shareLink
        }
      });
    } catch (err) {
      log.error('[friends] error sending referral email ' + err, { err } );
    }
    setIsLoading(false);
    setIsSuccess(true);
  };

  const sendMessageHandler = () => {
    if (selectedTab === 0) {
      sendEmailHandler();
    } else if (selectedTab === 1) {
      sendSMSHandler();
    }
  };

  const copyClickHandler = () => {
    log.info(`copied referral url ${shareLink}`);
    copyTextToClipboard(shareLink);
    setCopyStatus(true);
  };

  const shareAgainHandler = () => {
    setIsSuccess(false);
    setEmailTo('');
    setPhoneNumber('');
    setMessage(INITIAL_MESSAGE);
  }

  return (
    <div className={style.container}>
      <img
        className={style.bannerStyle}
        src='https://cdn.shopify.com/s/files/1/0253/6561/0605/files/referral-desktop-banner.jpg?v=1609768841'
        alt='referral-banner' />
      <div className={style.inputPanel}>
        <div className={style.inviteTitle}>{title}</div>
        <div className={style.giveAndGetTitle}>{giveAndGetTitle}</div>
        {description}
        <div className={style.directShareLabel}>Share your unique referral link:</div>
        <SocialShare shareLink={shareLink} />
        <div className={style.shareLinkLine}>
          <div className={style.shareLinkStyle}>{shareLink}</div>
          <DarkButton
            passedClass={style.copyButton}
            disabled={!shareLink}
            onClick={copyClickHandler}>
            Copy Link
          </DarkButton>
        </div>
        <div className={style.copied}>
        {copyStatus?
          <><CheckIcon color='#59aa8e' /> &nbsp;Referral link copied</>:
          ''
        }
        </div>
        <div className={style.directShareLabel}>Or Share It Directly</div>
        <div className={style.tabLine}>
          {tabs.map((tab, index) => (
            <div
              key={tab}
              className={(selectedTab === index && style.selectedTab) || ''}
              onClick={tabChangeHandler(index)}>
              {tab}
            </div>
          ))}
        </div>
        {!isSuccess && <>
          <input
            name={selectedTab === 0 ? 'emailTo': 'phoneNumber'}
            className={style.inputBox}
            placeholder={selectedTab === 0 ? 'Enter your friend’s email': 'Enter your friend’s phone number'}
            value={selectedTab === 0 ? emailTo: phoneNumber}
            onChange={inputHandler} />
          <textarea
            className={style.messageStyle}
            name='message'
            placeholder='Text about the referal'
            value={message}
            onChange={inputHandler}
          />
          {errorStatus && <div className={style.errorStatusStyle}>{errorStatus}</div>}
          <DarkButton
            passedClass={style.sendButton}
            disabled={isLoading}
            onClick={sendMessageHandler}>
            Send
          </DarkButton>
        </>
        }
        {/* {selectedTab === 2 &&
          <SocialShare shareLink={shareLink} />
        } */}
        {isSuccess &&
        <div className={style.responseStyle}>
          Thank you so much for sharing! <br />
          Your friends will thank you. <br /> <br />
          {selectedTab === 0 ?
            <>
              An email invitation was sent to: <br />
              {emailTo}
            </>:
          selectedTab === 1 ?
            <>
              A text invitation was sent to: <br />
              {phoneNumber}
            </>:
            null
          }
          <DarkButton passedClass={style.shareAgainButton} onClick={shareAgainHandler}>
            Share Again
          </DarkButton>
        </div>
        }
      </div>
    </div>
  );
};

export default ReferralDesktop;