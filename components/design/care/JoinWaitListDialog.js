import React, { useState } from 'react';
import { connect } from 'react-redux';
import { DarkButton } from '../../basic/buttons';
import { subscribeToKlaviyo } from 'api/util';
import {  } from '../../../utils/track';
import style from './css/join-wait-list-dialog.module.css';
import log from '../../../utils/logging'

const keyMap = {
  '4705982972013': 'T2Mwum', // Hang Nguyen - Golden Aura
  '4705982283885': 'WNf3U9', // Cassandre Marie - Electric Prism
  '4705981726829': 'WLehH7', // Amy Le - Black is the Strongest Color
  '4705983299693': 'R9xC9R', // Jessica Washick - Enigma
  '4705984184429': 'Vp5FSx', // Natalie Pavloski - Stand Out
  '4705983660141': 'SBNJfa', // Madeline Poole - Knit to Fit
  '4705982578797': 'X8LvgX', // Eda Levenson - Ebb + Flow
  '4716834193517': 'R88BU9', // Kia Stewart (Lux K)
  '4716835143789': 'UdjAQd', // Mimi D - Pastel Lightning
  '4705981202541': 'X9Rj7R', // Alicia Torello - Clear Day
  '4716832391277': 'SjFsTt', // Spifster Sutton - {Design Name}
  '4298550345837': 'T6Hteh' // Cuticle Pen

// 6/16: Hang Nguyen - Golden Aura https://www.klaviyo.com/list/T2Mwum/hang-nguyen-waitlist
// 6/17: Cassandre Marie - Electric Prism https://www.klaviyo.com/list/WNf3U9/cassandre-marie-waitlist
// 6/18: Amy Le - Black is the Strongest Color https://www.klaviyo.com/list/WLehH7/amy-le-waitlist
// 6/19: Jessica Washick - Enigma https://www.klaviyo.com/list/R9xC9R/jessica-washick-waitlist
// 6/22: Natalie Pavloski - Stand Out https://www.klaviyo.com/list/Vp5FSx/natalie-pavloski-waitlist
// 6/23: Madeline Poole - Knit to Fit https://www.klaviyo.com/list/SBNJfa/madeline-poole-waitlist
// 6/24: Eda Levenson - Ebb + Flow https://www.klaviyo.com/list/X8LvgX/eda-levenson-waitlist
// 6/25: Kia Stewart (Lux K) - https://www.klaviyo.com/list/R88BU9/kia-waitlist
// 6/26: Mimi D - Pastel Lightning https://www.klaviyo.com/list/UdjAQd/mimi-d-waitlist
// 6/29: Alicia Torello - Clear Day https://www.klaviyo.com/list/X9Rj7R/alicia-t-waitlist
// 6/30: Spifster Sutton - {Design Name} https://www.klaviyo.com/list/SjFsTt/spifster-waitlist
};

const JoinWaitListDialog = ({ open, productId, onClose, userData }) => {
  if (!open) return null;

  const [email, setEmail] = useState(userData?.email || '');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const sendEmailHandler = async ev => {
    ev.preventDefault();
    try {
      const key = keyMap[productId] || ''
      await subscribeToKlaviyo(email, key);
      setIsSubscribed(true);
    } catch (err) {
      log.error('[JoinWaitListDialog][sendEmailError] could not subscribe ' + err, { err } )
    }
  };

  const inputHandler = ev => {
    setEmail(ev.target.value);
  }

  return (
    <>
    <form className={style.container} onSubmit={sendEmailHandler}>
      <img
        className={style.closeButton}
        src='/static/icons/close-dark-icon.svg'
        onClick={onClose} />
      <div className={style.title}>
        Be in the know
      </div>
      <div className={style.instruction}>
        Enter your email and be the first to <br /> know when this item is back in stock!
      </div>
      {!isSubscribed &&
        <div className={style.inputLine}>
          <input
            autoFocus
            type='email'
            required
            placeholder='Email address*'
            className={style.inputField}
            value={email}
            onChange={inputHandler} />
          <DarkButton isSmall passedClass={style.actionButton} type='submit'>
            SUBMIT
          </DarkButton>
        </div>
      }
      {isSubscribed && <div className={style.subscribed}>Awesome! You'll hear from us soon...</div>}
    </form>
    <div className={style.overlay} />
    </>
  );
};

const mapStateToProps = state => ({
  userData: state.userData,
});


export default connect(mapStateToProps)(JoinWaitListDialog);
