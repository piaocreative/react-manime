import { SET_SHIPPING_ABROAD } from 'actions';
import { subscribeToKlaviyo } from 'api/util';
import axios from 'axios';
import classNames from 'classnames';
import config from 'config';
import Link from 'next/link';
import publicIp from 'public-ip';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import style from 'static/components/landing/international-shipping.module.css';
import { pageLinks } from 'utils/links';
import log from 'utils/logging';
import { OutlinedDarkButton } from '../basic/buttons';
import { StandardInputField as StandardInput } from '../styled/StyledComponents';

const InternationalShipping = ({ dispatchSetShippingAbroad, userData, uiData }) => {
  const [email, setEmail] = useState('');
  const [beforeSubmit, setBeforeSubmit] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const changeInputHandler = ev => {
    ev.preventDefault();
    setEmail(ev.target.value);
  };

  const init = async () => {
    if (uiData.isShippingAbroadOpen) {
      document.getElementById('intl').className += ` ${style.move}`;
    }
    if (uiData.isShippingAbroadOpen || userData.isAuth) {
      return;
    }
    const ipAddress = await publicIp.v4();
    if (ipAddress) {
      try {
        const response = await axios.get(
          `https://api.ipstack.com/${ipAddress}?access_key=${config.ipStackKey}&format=1`,
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (((response || {}).data || {}).country_code !== 'US') {
          dispatchSetShippingAbroad(true);
          document.getElementById('intl').className += ` ${style.move}`;
          // TODO: update later
        } else {
          dispatchSetShippingAbroad(false);
        }
      } catch (err) {
        log.error('[InternationalShipping][init] ' + err, { err });
      }
    }
  };

  const closeHandler = () => {
    dispatchSetShippingAbroad(false);
  };

  const sendHandler = async ev => {
    ev.preventDefault();
    setBeforeSubmit(false);
    try {
      await subscribeToKlaviyo(email, 'UduxQR');
      setIsSubscribed(true);
    } catch (err) {
      log.error('[InternationalShipping][sendHandler] ' + err, { err });
    }
  };

  useEffect(() => {
    init();
  }, []);

  if (uiData.isShippingAbroadOpen === false) {
    return null;
  }

  return (
    <div className={classNames(style.container)} id="intl">
      <img
        className={style.closeButton}
        src="/static/icons/close-dark-icon.svg"
        onClick={closeHandler}
        alt="close"
      />
      <div className={style.title}>Outside of the US?</div>
      <div className={style.question}>
        {/* Do you want to be the first to know when we start shipping internationally? */}
        We don’t ship to you yet, but we will do soon! <br /> Subscribe to be the first to know.
      </div>
      {isSubscribed ? (
        <div className={style.subscibedLabel}>Subscribed!</div>
      ) : (
        <form className={style.inputLine} onSubmit={sendHandler}>
          <StandardInput
            underlined
            type="email"
            error={!beforeSubmit && !email}
            fontSize="14px"
            placeholder="Enter your e-mail"
            height="32px"
            value={email}
            onChange={changeInputHandler}
          />
          <OutlinedDarkButton isSmall passedClass={style.actionButton} type="submit">
            SUBSCRIBE
          </OutlinedDarkButton>
        </form>
      )}
      <div className={style.description}>
        By joining, you agree to receive marketing messages. You can unsubscribe at any moment.
        Check our <Link href={pageLinks.Terms.url}>Terms of Service</Link> for more details.
      </div>
    </div>
  );
};

const mapStateToProps = state => ({
  userData: state.userData,
  uiData: state.uiData,
});

const mapDispatchToProps = dispatch => ({
  dispatchSetShippingAbroad: isOpen => dispatch(SET_SHIPPING_ABROAD(isOpen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InternationalShipping);
