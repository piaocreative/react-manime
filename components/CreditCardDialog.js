
import React, { Component } from 'react';
import styled from 'styled-components';
import { API } from '@aws-amplify/api';
import { Elements, CardElement, injectStripe } from 'react-stripe-elements';
import log from 'utils/logging'
import StandardButton, { LoadingButton } from './styled/StandardButton';
import Box from './styled/Box';
import {
  updateUserColumn
} from 'api/user';

import {addCardtoUser} from 'api/payment';
import {PaymentApi} from 'api/connections/paymentApi';


import { connect } from 'react-redux';
import { SET_STRIPE_ID } from '../actions';

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
  background: ${props => props.disabled ? '#aaa': '#2C4349'};

  &:hover {
    transition: ease-out 0.3s;
    background: ${props => props.disabled ? '#aaa': '#35535b'};
  }
`;

const TitleLabel = styled(Box)`
  font-size: 16px;
  margin-bottom: 12px;
  width: 100%;
`;

const ErrorMessage = styled(Box)`
  font-style: italic;
`;

class CreditCardDialog extends Component {

  state = {
      // brand: 'Visa',
      // expMonth: 1,
      // expYear: 2020,
      // last4: 7777,
      refunded: false,
      paid: true,
      // addressLine1: 'Test',
      // addressLine2: 'TEST',
      // addressCity: 'TEST',
      // addressZip: 0,
      // addressState: 'CA',
      // addressCountry: 'US',
      // addressLatitude: 0,
      // addressLongitude: 0,
      paymentData: {},
      errorData: {},
      error: '',
      isLoading: false
  };

  componentDidMount () {
    this._mounted = true;
    const { dialogData } = this.props;
    if (dialogData) {
      this.setState({paymentData: dialogData});
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.stripe){
      // track('creditcarddialog does not have stripe in props');
    } else if (prevProps.stripe != this.props.stripe) {
      // track('creditcarddialog has stripe in props');
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  updateState = (key, value) => {
    const { paymentData } = this.state;
    const newPaymentData = {...paymentData}
    newPaymentData[key] = value;
    this.setState({
      paymentData: newPaymentData
    });
  };

  updateErrorState = (key, value) => {
    const { errorData } = this.state;
    let newErrorData = {...errorData};
    newErrorData = {[key]: value};
    this.setState({errorData: newErrorData});
  }

  onOkClickHandler = () => {
    // track('CreditCardDialog onOkClickHandler');
    this.validateData();
  }

  closeHandler = () => {
    const { onClose } = this.props;
    this.setState({error: ''});
    onClose();
    this.clearElements();
  }

  clearElements = () => {
    if (this._elDialog && this._elDialog.clear)
      this._elDialog.clear();
    if (this._elNoDialog && this._elNoDialog.clear)
      this._elNoDialog.clear();
  }

  // TODO: validation check later
  validateData = async () => {
    const stripeId = this.props.userData.stripeId;
    const stripe = this.props.stripe;

    const stripePromise = new Promise(function(resolve, reject) {
      stripe.createSource({ type: 'card' })
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        reject(err);
      });
    });

    try {
      this.setState({isLoading: true});
      const result = await stripePromise;
      if (!result || (result && result.error)) {

        const stripeError = ((result || {}).error || {}).message || '';
        this.setState({ error: stripeError + ' ' + ERROR });
        if(result?.error?.type==='validation_error'){
          log.error('[CreditCardDialog] validation error with stripePromise', { result } );
        }else{
          log.error('[CreditCardDialog] error with stripePromise', { result } );
        }
        
      } else {

        this.setState({ error: '' });
        if (stripeId) await this.addPaymentMethod(result.source);
        else await this.createNewCustomer(result);
      }
    } catch (err) {


      this.setState({ error: ERROR });
      log.error(`[CreditCardDialog] validateData try block ${err}`, { err, stripeId } );
    }
    this.setState({isLoading: false});
  };

  addPaymentMethod = async (source) => {
    // trackFlowMixpanel('14A', 'Add payment method');

    const stripeId = this.props.userData.stripeId;

    try {

      const {success, error} = await addCardtoUser(source, stripeId)

      if(success){
        await this.props.onAddEdit(success);
        this.clearElements();
      }else{
        this.setState({ error: error + ' ' + ERROR });
      }
      
    } catch (err) {

      const stripeError = (((err || {}).response || {}).data || {}).err || '';
      log.error(`[CreditCardDialog] createnewpayment ${err}`, {stripeId, err} );
    }
  };

  createNewCustomer = async (result) => {

    const email = this.props.userData.email;
    const identityId = this.props.userData.identityId;

    let userData = {
      email: email ? email : '',
      source: result.source.id,
    };


    try {

      const response = await PaymentApi('post', '/subscription/customer', userData);
      const stripeId = response && response.customer && response.customer.id ? response.customer.id : null;
      if (!stripeId) throw new Error('Invalid response from /subscription/customer');


      updateUserColumn(identityId, 'stripeId', stripeId);
      this.props.dispatchSetStripeId(stripeId);
      //log.error("System error: should be calling dispatchSetStripeId but this dispatcher was never initalized")
      await this.props.onAddEdit({
        expMonth: result.source.card.exp_month,
        expYear: result.source.card.exp_year,
        last4: result.source.card.last4,
        brand: result.source.card.brand
      });
      
      this.clearElements();
    } catch (err) {
      const stripeError = (((err || {}).response || {}).data || {}).err || '';
      this.setState({ error: stripeError + ' ' + ERROR });
      log.error(`[CreditCardDialog] createnewcustomer ${err}`, { err });
    }

  };

  render () {
    const { noDialog } = this.props;
    const { isLoading } = this.state;

    if (noDialog) {
      return (
        <React.Fragment>
          <Box display='flex' flexDirection={['column', 'row']} justifyContent='space-between' alignItems='center'>
            <CardElement
              onReady={el => this._elNoDialog = el}
              className='StripeElement' />
            <ActionButton
              disabled={isLoading}
              mt={['16px', 0]}
              ml={[0, 4]}
              width={[1, 'unset']}
              onClick={this.onOkClickHandler}>
              {isLoading ? 'PROCESSING...' : 'ADD CARD'}
            </ActionButton>
          </Box>

          <ErrorMessage color='forecolor.2' fontSize='14px' mt={1}>
            {this.state.error}
          </ErrorMessage>
        </React.Fragment>
      );
    }

    return (
      <Container>
        <Box position='relative' width={['100%', '500px']} background='white' p={4}>
          <Box position='absolute' right='20px' top='8px' fontSize='36px' style={{cursor: 'pointer'}} onClick={this.closeHandler}>
            ×
          </Box>
          <TitleLabel>Credit Card</TitleLabel>
          <CardElement
            onReady={el => this._elDialog = el}
            className='StripeElement'
          />

          <ErrorMessage color='forecolor.2' fontSize='14px' mt={1}>
            {this.state.error}
          </ErrorMessage>

          <form onSubmit={this.onSubmit}>
            <Box width={1} display='flex' justifyContent='center' mt={3} >
              <ActionButton
                disabled={isLoading}
                mr={2}
                onClick={this.onOkClickHandler}>
                {isLoading ? 'PROCESSING...' : 'ADD CARD'}
              </ActionButton>
            </Box>
          </form>
        </Box>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
   userData: state.userData,
   mainCartData: state.mainCartData
 });

 const mapDispatchToProps = dispatch => ({
   dispatchSetStripeId: stripeId => dispatch(SET_STRIPE_ID(stripeId))
 });

 const _CreditCardDialog = connect(
   mapStateToProps,
   mapDispatchToProps
 )(CreditCardDialog);

export default injectStripe(_CreditCardDialog);
