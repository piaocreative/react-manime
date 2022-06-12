import React, { Component } from 'react';
import styled from 'styled-components';
import Box from '../styled/Box';
import { Img } from '../styled/StyledComponents';
import style from '../../static/components/checkout/payment-methods.module.css';

const IconImg = styled(Img)`
  width: 48px;
  height: 32px;
  margin-right: 2px;
  @media (min-width: 480px) {
    max-width: 54px;
    height: 36px;
  }
`;

class PaymentMethods extends Component {
  render () {
    const iconList = [
      '/static/images/paypal.png',
      '/static/images/master-card.png',
      '/static/images/visa.png',
      '/static/images/american-express.png',
      '/static/images/apple-pay.png',
      '/static/images/amazon.png',
    ];

    return (
      <div className={style.root}>
        {/* <div className={style.center}> */}
        <img src='/static/icons/secure-logo.svg' alt='secure-logo' />
        <div className={style.description}>
          Secure Payment 
          Your credit card details are safe with us.
          All the information is protected using
          Secure Sockets Layer (SSL) technology.
        {/* </div> */}
        </div>
      </div>
    );

  }
}

export default PaymentMethods;
