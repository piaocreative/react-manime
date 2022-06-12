import React, { useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { PrimaryButton, DarkButton } from 'components/basic/buttons';
import ManimeDropIcon from 'components/icons/ManimeDropIcon';
import { StandardInputField } from 'components/styled/StyledComponents';
import { subscribeToKlaviyo } from 'api/util';
import {  } from 'utils/track';
import log from 'utils/logging'
import style from './css/landing-subscription.module.css';
import config from 'config'

const Input = styled(StandardInputField)`
  border: 1px solid #fff;
  border-top: none;
  height: 46px;
`;

const LandingSubscriptionSection = props => {
  const [email, setEmail]= useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const inputChangeHandler = ev => {
    setEmail(ev.target.value);
  };

  const subscribeHandler = async ev => {
    ev.preventDefault();
    try {
      await subscribeToKlaviyo(email, config.klaviyoTemplate.landing);
      setIsSubscribed(true);
    } catch (err) {
      log.info(err.message);
      log.error('[LandingSubscriptionSection][sendEmailError] could not subscribe ' + err, { err } )
    }
  }

  // if (props.userData.isAuth) {
  //   return null;
  // }

  return (
    <div className={style.container}>
      <ManimeDropIcon className={style.dropBubble}/>
      <div className={style.title}>
        JOIN THE CLUB
      </div>
      <div className={style.description}>
        Join our email list for new product releases, <br />
        endless inspiration and exclusive discounts.
      </div>
      {!isSubscribed ?
      <form className={style.inputLine} onSubmit={subscribeHandler}>
        <Input
          type='email'
          placeholder='Enter your e-mail'
          required
          value={email}
          onChange={inputChangeHandler} />
        <PrimaryButton passedClass={style.actionButton} type='submit'>
          SUBMIT
        </PrimaryButton>
      </form>:
      <div className={style.subscribed}>Thanks for subscribing</div>
      }
    </div>
  );
};

const mapStateToProps = state => ({
  userData: state.userData,
});

export default connect(mapStateToProps)(LandingSubscriptionSection);
