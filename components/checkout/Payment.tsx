import React, { Component } from 'react';
import styled from 'styled-components';
import { Elements, StripeProvider } from 'react-stripe-elements';
import { connect } from 'react-redux';

import Box from 'components/styled/Box';
import PlaceOrderButton from 'components/PlaceOrderButton';
import { getPayments, setDefaultCard, removePayment } from 'api/payment';
import ShopifyHOC from 'components/ShopifyHOC';
import CreditCardBox from 'components/CreditCardBox';
import CreditCardDialog from 'components/CreditCardDialog';
import RedeemManiMoney  from 'components/cart/RedeemManiMoney_V2';
import { calculateOrderData } from 'utils/calculateOrderData';
import { trackFunnelActionProjectFunnel, track } from 'utils/track';
import { scrollToTop } from 'utils/scroll';
import { checkManiBag } from 'utils/cartUtils';
import toggleLoading from 'utils/toggleLoading';
import { SET_STRIPE_ID } from 'actions';
import log from 'utils/logging';
import config from 'config';

const ERROR = `We're sorry, your payment didn't go through! Please review your credit card info and reach out to care@manime.co if additional help is needed!`;

const PaymentBarList = styled(Box)`
  height: unset;
  overflow-y: auto;
  margin-bottom: 8px;
  @media (min-width: 480px) {
    height: 300px;
  }
`;

const RootContainer = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 12px;
  @media(min-width: 480px) {
    padding: 0 16px;
  }
`;

const ErrorMessage = styled(Box)`
  font-style: italic;
`;

type Props ={
  userData,
  profile,
  tabClickHandler,
  setRedeemed,
  redeemed,
  hideActions,
  mainCartData,
  dispatchSetStripeId
}

type State = {
  stripe,
  isDialogOpened,
  paymentList,
  dialogData,
  selectedPaymentIndex,
  loading,
  error,
}
class Payment extends Component <Props, State>{
  _mounted;
  state = {
    stripe: null,
    isDialogOpened: false,
    paymentList: null,
    dialogData: null,
    selectedPaymentIndex: 0,
    loading: true,
    error: ''
  };

  initialize = async () => {
    this.getPaymentList();
  }

  getPaymentList = async () => {
    const { stripeId } = this.props.userData;
    try {
      this.setState({ loading: true });
      const result = await getPayments(stripeId);
      this.setState({
        paymentList: result
      });
    } catch (err) {
      log.error('[Payment_V2] getPaymentList ' + err, { err });
      this.setState({ paymentList: [] });
    }
    this.setState({ loading: false });
  }

  componentDidMount() {
    this._mounted = true;
    this.checkStripe();

    const stripeId = (((this || {}).props || {}).userData || {}).stripeId || undefined;
    if (stripeId) {
      this.initialize();
    } else {
      this.setState({ loading: false, paymentList: [] });
    }

    toggleLoading(false);
    // trackFunnelAction(`Checkout - Payment`);

    if (this.props.profile) {
      trackFunnelActionProjectFunnel(`/profile/shipping-payment`);
      track('[profile][payment] mount')
    }
    else {
      trackFunnelActionProjectFunnel(`/checkout/payment`);
      track('[checkout][payment] mount')
    }

  }

  componentDidUpdate(prevProps) {
    // this.checkStripe();

    const stripeId = (((this || {}).props || {}).userData || {}).stripeId || undefined;
    const prevStripeId = ((prevProps || {}).userData || {}).stripeId || undefined;
    if (stripeId != prevStripeId)
      this.initialize();
    else if (this.state.loading)
      this.setState({ loading: false });
  }

  componentWillUnmount() {
    this._mounted = false;
  }
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


  selectCard = (value) => {
    this.setState({selectedPaymentIndex: value});
    setDefaultCard(this.props.userData.stripeId, this.state.paymentList[value].id);
  };

  navToShippingHandler = () => {
    scrollToTop();
    this.props.tabClickHandler(0);
  }

  openDialogHandler = data => {
    this.setState({
      isDialogOpened: true,
      dialogData: data
    });
  }

  dialogCloseHandler = () => {
    this.setState({isDialogOpened: false});
  }

  addEditHandler = async data => {
    await this.getPaymentList();
    this.dialogCloseHandler();
  }

  removePaymentHandler = async cardId => {
    try {
      await removePayment(this.props.userData.stripeId, cardId);
    } catch (err) {
      log.error('[Payment_V2] removePayment ' + err, { err })
    }
    this.getPaymentList();
  }

  setErrorMessage = (status, err) => {
    if (err && err.response) log.error('D. STRIPE PLACE ORDER', err.response);
    const stripeError = (((err || {}).response || {}).data || {}).message || '';

    this.setState({ error: status ? stripeError + ' ' + ERROR : '' });
  }

  toggleRedeem = () => {
    const nextRedeemedState = !this.props.redeemed;
    this.props.setRedeemed(nextRedeemedState);
  }

  render() {
    const { hideActions, userData, mainCartData } = this.props;
    const { paymentList, dialogData, selectedPaymentIndex, loading } = this.state;
    const {newCredits, creditsToRedeem} = calculateOrderData(userData, mainCartData);
    // TODO: tweak;
    // const loading = false;
    let disabled = false;

    const { hasItems } = checkManiBag(this?.props?.mainCartData?.cart);

    const redeemManiMoneyJsx = (
      <RedeemManiMoney
        isAuth
        redeemed={this.props.redeemed}
        credits={this.props.redeemed ? newCredits : (userData.credits || 0)}
        creditsToRedeem={creditsToRedeem}
        text={this.props.redeemed ? 'Undo': 'Redeem'}
        hideButton={false}
        toggleRedeem={this.toggleRedeem}
      />
    );

    if (!hasItems) {
      disabled = true;
    } else {
      try {
        if (paymentList && paymentList.length === 0) {
          let orderTotal = 0;
          if (!this.props.redeemed) {
            const checkout = this.props.mainCartData?.cart
            orderTotal = checkout ? checkout.totalPrice : 0;
          } else {
            const { mainCartData, userData } = this.props;
            const result = calculateOrderData(userData, mainCartData);
            orderTotal = result.newTotal || 0;
          }
          orderTotal = orderTotal;
          if (orderTotal < 0.60) {
            disabled = false;
          } else {
            disabled = true;
          }
        }
      } catch (err) {
        log.error('[Payment_V2][render] checking payment list in render ' + err, { err });
      }
    }

    return (
      <StripeProvider stripe={this.state.stripe}>
        <RootContainer>

          {/* {loading &&
            <LoadingAnimation isLoading={loading} height='50vh' background='transparent' />
          } */}

          <Box display={(!loading && paymentList !== null && paymentList.length === 0) ? 'block' : 'none'}>
            <Box height={['unset', 'calc(100vh - 400px)']}>
              <Box fontSize={['14px', '16px']} mb={2}>Add a Payment method</Box>
              <Elements>
                <CreditCardDialog
                  userData={this.props.userData}
                  mainCartData={this.props.mainCartData}
                  dispatchSetStripeId={this.props.dispatchSetStripeId}
                  noDialog
                  dialogData={dialogData}
                  onAddEdit={data => this.addEditHandler(data)} />
              </Elements>
              {redeemManiMoneyJsx}
            </Box>
          </Box>

          {(Array.isArray(paymentList) && paymentList.length > 0) &&
            <>
              <Box my={2} fontSize={['14px', '16px']}>Select a Payment method</Box>
              <PaymentBarList>
                {paymentList && Array.isArray(paymentList) && paymentList.map((payment, index) =>
                  <CreditCardBox
                    key={payment.id}
                    isSelected={index === selectedPaymentIndex}
                    order={index}
                    paymentData={payment}
                    onOpenDialog={data => this.openDialogHandler(data)}
                    onSelect={ev => this.selectCard(index)}
                    onRemove={() => this.removePaymentHandler(payment.id)} />
                )}
              </PaymentBarList>
              <Box fontSize='14px' fontFamily='avenirBlack' style={{ cursor: 'pointer' }} onClick={this.openDialogHandler}>
                + Add new card
              </Box>
              {redeemManiMoneyJsx}
            </>
          }

          {!hideActions &&
            <React.Fragment>
              <Box display='flex' justifyContent='space-between' alignItems='center' mt={2} flexWrap='wrap'>
                <Box fontSize='14px' style={{ cursor: 'pointer' }} onClick={this.navToShippingHandler} my={3}>
                  {`< Return to shipping info`}
                </Box>
                <Box width={[1, '50%']}>
                  <PlaceOrderButton
                    redeemed={this.props.redeemed}
                    disabled={disabled}
                    setErrorMessage={this.setErrorMessage} />
                </Box>
              </Box>
              <ErrorMessage color='forecolor.2' fontSize='14px' mt={1}>
                {this.state.error}
              </ErrorMessage>
            </React.Fragment>
          }
          {/* NOTE: DO NOT use conditional rendering! Stripe Provider might be broken by frequent add/remove component */}
          <Box display={this.state.isDialogOpened ? 'block' : 'none'}>
            <Elements>
              <CreditCardDialog
                userData={this.props.userData}
                mainCartData={this.props.mainCartData}
                dispatchSetStripeId={this.props.dispatchSetStripeId}
                dialogData={dialogData}
                onAddEdit={data => this.addEditHandler(data)}
                onClose={this.dialogCloseHandler} />
            </Elements>
          </Box>
        </RootContainer>
      </StripeProvider>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  shippingAddresses: state.uiData.shippingAddresses,
  userData: state.userData,
  mainCartData: state.mainCartData
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchSetStripeId: stripeId => dispatch(SET_STRIPE_ID(stripeId))
});

const _Payment = connect(
  mapStateToProps,
  mapDispatchToProps
)(Payment);

export default ShopifyHOC(_Payment);
