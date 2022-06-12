import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Elements } from 'react-stripe-elements';
import { connect } from 'react-redux';

import { StandardOutlinedButton, StandardLabel } from '../styled/StyledComponents';
import Box from '../styled/Box';
import PlaceOrderButton from '../PlaceOrderButton';
import { getPayments, setDefaultCard, removePayment } from 'api/payment';
import ShopifyHOC from 'components/ShopifyHOC';
import toggleLoading from '../../utils/toggleLoading';
import CreditCardBar from '../CreditCardBar';
import CreditCardDialog from '../CreditCardDialog';
import { track, trackFunnelAction, trackFunnelActionProjectFunnel } from '../../utils/track';
import { StripeProvider } from 'react-stripe-elements';
import { scrollToTop } from '../../utils/scroll';
import { SET_STRIPE_ID } from '../../actions';
import config from '../../config';
import log from '../../utils/logging'

const TitleLabel = styled(StandardLabel)`
  font-size: 16px;
`;

const Line = styled(Box)`
  flex-grow: 1;
  height: 2px;
  margin-top: 10px;
  margin-left: 10px;
  background-color: #717171;
`;

const PaymentBarList = styled(Box)`
  height: 300px;
  overflow-y: scroll;
  margin-bottom: 8px;
`;

const RootContainer = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 12px;
`;

type Props  ={
  userData,
  profile,
  tabClickHandler,
  hideActions,
  mainCartData,
  dispatchSetStripeId,
  redeemed
}

type State = {
  stripe,
  isDialogOpened,
  paymentList,
  dialogData,
  selectedPaymentIndex,
}

class Payment extends React.Component<Props, State> {
  _mounted;
  constructor(props) {
    super(props);
    this.state = {
      stripe: null,
      isDialogOpened: false,
      paymentList: [],
      dialogData: null,
      selectedPaymentIndex: 0
    };
  }

  initialize = async () => {

    this.getPaymentList();
  }

  getPaymentList = async () => {
    const { stripeId } = this.props.userData;
    const result = await getPayments(stripeId);
    this.setState({
      paymentList: result
    });
  }

  componentDidMount() {
    this._mounted = true;
    this.checkStripe();

    const stripeId = (((this || {}).props || {}).userData || {}).stripeId || undefined;
    if (stripeId) {
      this.initialize();
    }
    // this.setState({
    //   stripe: window['Stripe'](config.stripePublicKey),
    // });
    toggleLoading(false);
    // trackFunnelActionProjectFunnel(`Checkout - Payment`);

    if (this.props.profile) trackFunnelActionProjectFunnel(`/profile/shipping-payment`);
    else trackFunnelActionProjectFunnel(`/checkout/payment`);

  }

  componentDidUpdate(prevProps) {
    // this.checkStripe();

    const stripeId = (((this || {}).props || {}).userData || {}).stripeId || undefined;
    const prevStripeId = ((prevProps || {}).userData || {}).stripeId || undefined;
    if (stripeId != prevStripeId)
      this.initialize();
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

  navToShippingHandler = () => {
    scrollToTop();
    this.props.tabClickHandler(0);
  }

  selectCard = (value) => {
    this.setState({selectedPaymentIndex: value});
    setDefaultCard(this.props.userData.stripeId, this.state.paymentList[value].id);
  };

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
      log.error(`[Payment_V2] removePayment ${err}`, { err })
    }
    this.getPaymentList();
  }

  render() {
    const { hideActions } = this.props;
    const { paymentList, dialogData, selectedPaymentIndex } = this.state;

    return (
      <StripeProvider stripe={this.state.stripe}>
        <RootContainer>
          <Box display='flex' width='100%'>
            <TitleLabel>Your credit and debit cards</TitleLabel>
            <Line />
          </Box>
          <PaymentBarList>
            {paymentList && Array.isArray(paymentList) && paymentList.map( (payment, index) =>
              <CreditCardBar
                key={payment.id}
                isSelected={index===selectedPaymentIndex}
                order={index}
                paymentData={payment}
                onOpenDialog={data => this.openDialogHandler(data)}
                onSelect={ev => this.selectCard(index)}
                onRemove={() => this.removePaymentHandler(payment.id)} />
            )}
          </PaymentBarList>

          <StandardOutlinedButton
            fontFamily='Avenir'
            onClick={this.openDialogHandler}
            border='1px solid #000'
            color='#000'
            mr='auto'
            ml='52px'
            fontSize={['12px', '14px']}
            height='32px'
            px={['4px', '20px']}
            >
            Add new credit card
          </StandardOutlinedButton>

          {/* NOTE: DO NOT use conditional rendering! Stripe Provider might be broken by frequent add/remove component */}
          <Box display={this.state.isDialogOpened ? 'block': 'none'}>
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

          {!hideActions &&
            <Fragment>
              <Box mt='3' display='flex' width='100%'>
                <TitleLabel>Other payment method</TitleLabel>
                <Line />
              </Box>

              <StandardOutlinedButton
                width='100%'
                height='32px'
                mt={[3,4]}
                fontSize={['12px', '14px']}
                onClick={this.navToShippingHandler}>
                BACK TO SHIPPING INFO
              </StandardOutlinedButton>
              <PlaceOrderButton redeemed={this.props.redeemed} />
            </Fragment>
          }
        </RootContainer>
      </StripeProvider>
    );
  }
}

// shippingaddressid | userid ||| addressline1 | addresscity | addresszip | addressstate | addresscountry | addresslatitude | addresslongitude | addressline2 | name

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

