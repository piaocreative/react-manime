
import React, { Component, useState } from 'react';
import styled from 'styled-components';
import {NextRouter, withRouter} from 'next/router';
import { Elements, CardElement, injectStripe, StripeProvider } from 'react-stripe-elements';


import StandardButton from '../../styled/StandardButton';

import Box from '../../styled/Box';

import { track, } from '../../../utils/track';

import { connect } from 'react-redux';

import config from '../../../config';

import { CreditCard } from '../../../types'
import log from '../../../utils/logging'
import { any } from 'prop-types';


const ERROR = `We're sorry, your payment didn't go through! Please review your credit card info and reach out to care@manime.co if additional help is needed!`;

const Container = styled(Box)`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 200;
  padding: 20px;
`;

const ActionButton = styled(StandardButton)`
  min-width: 120px;
  background: ${props => props.disabled ? '#aaa' : '#2C4349'};
  margin-top: 50px;
  &:hover {
    transition: ease-out 0.3s;
    background: ${props => props.disabled ? '#aaa' : '#35535b'};
  }
`;



const SectionLabel = styled(Box)` 
  font-family: AvenirBook;
  font-size: 14px;
  color: #2c4349;
  margin-bottom: 10px;
  margin-top: 20px;
  text-align: left;
  align-self: flex-start;
`
const ErrorMessage = styled(Box)`
  font-style: italic;
`;

type CreditCardProps = {
  onDataChange: Function,

  ownerName: string,
  ownerEmail: string,
  isProcessingCallback: Function,
  router: NextRouter,
  isReady: boolean,

}

type CreditCardState = {

  refunded: boolean,
  paid: boolean,
  paymentData: any,
  isLoading: boolean,
  stripe?: any,
  stripeInitAttempts: number,
  stripeElement: any,
  mounted: boolean,
  loadError: any
} & CreditCard


class CreditCardForm extends React.Component<CreditCardProps, CreditCardState> {
  state: CreditCardState = {
    refunded: false,
    paid: true,
    paymentData: {},
    isLoading: false,
    stripe: null,
    stripeInitAttempts: 30,
    stripeElement: undefined,
    mounted: false,
    loadError: undefined,
  };

  componentDidMount() {
    this.setState({ mounted: true });
    this.checkStripe();
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  onOkClickHandler = async () => {
    // track('CreditCardDialog onOkClickHandler');

    try {
      this.props.isProcessingCallback(true);
      const source = await this.createStripeSource();
      this.props.onDataChange(source);
    } catch (err) {
      try {
        this.props.isProcessingCallback(false);
      } catch (e) {
        log.error(
          'Gifting CreditCardForm.onOkClickHandler: System error, could not set processing to false'
        );
      }
      this.props.onDataChange({ error: err });
    }
  };

  checkStripe = (count = 0) => {
    const isSecure = process.browser && !!location.href.match(/https:/);
    const isLocalhost = process.browser && !!location.href.match(/localhost/);

    if (isLocalhost || isSecure) {
      if (this.state.stripe) return;

      log.info('checking stripe');
      // NOTE: stripe already loaded
      if (window && window['Stripe'] && !this.state.stripe) {
        this.setState({
          stripe: window['Stripe'](config.stripePublicKey),
        });
        return;
      }
    }
  };

  // TODO: validation check later
  createStripeSource = async () => {
    const stripe = this.state.stripe;

    const setIsProcessing = this.props.isProcessingCallback;
    const name = this.props.ownerName;
    const email = this.props.ownerEmail;
    const stripeElement = this.state.stripeElement;

    const stripePromise = new Promise<any>(function (resolve, reject) {
      stripe
        .createSource(stripeElement, {
          type: 'card',
          owner: {
            name,
            email,
          },
        })
        .then(resolve)
        .catch((err) => {
          setIsProcessing(false);
          reject(err);
        });
    });

    this.setState({ isLoading: true });
    setIsProcessing(true);
    const result = await stripePromise;

    if (!result || (result && result.error)) {
      const stripeError = ((result || {}).error || {}).message || '';
      log.error(stripeError);
      throw Error(stripeError);
    }
    return result.source;
  };

  setStripeElement(thing) {
    this.setState({ stripeElement: thing });
  }

  render() {
    const { isLoading } = this.state;

    return (
      <>
        <StripeProvider stripe={this.state.stripe}>
          <Elements>
            <_CreditCardForm
              isLoading={this.state.isLoading}
              clickHandler={this.onOkClickHandler.bind(this)}
              readyHandler={this.setStripeElement.bind(this)}
              externalIsReady={this.props.isReady}
            />
          </Elements>
        </StripeProvider>
      </>
    );
  }
}

const _CreditCardForm = injectStripe(({ isLoading, clickHandler, readyHandler, externalIsReady }: { isLoading: boolean, clickHandler: Function, readyHandler: Function, externalIsReady: boolean }) => {

  const [isReady, setIsReady] = useState(false)

  function readyListener(event) {
    if (event.complete) {
      setIsReady(true)
    }
  }
  function wrapper() {
    clickHandler()
  }

  function onReady(element){
    readyHandler(element)
  }

  return (

    <>

      <SectionLabel>Credit Card</SectionLabel>
      <CardElement  
        style={{base: {fontSize: '16px'}}}

        onChange={readyListener}
        onReady={onReady}
        className='StripeElement' />

      <ActionButton
        disabled={!isReady || !externalIsReady}
        my={'16px'}
        width={1}
        onClick={wrapper}>
        {'PLACE ORDER'}
      </ActionButton>

    </>



  )
});

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  shippingAddresses: state.uiData.shippingAddresses,
  userData: state.userData,
  mainCartData: state.mainCartData
});

const mapDispatchToProps = (dispatch, ownProps) => ({

});




export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(CreditCardForm));
