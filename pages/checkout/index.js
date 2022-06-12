import OrderSummary from 'components/checkout/OrderSummary';
import Payment from 'components/checkout/Payment';
import PaymentMethods from 'components/checkout/PaymentMethods';
import ShippingAddress from 'components/checkout/Shipping';
import FitWall from 'components/core/hoc/FitWall';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import Loading from 'components/LoadingAnimation';
import ShopifyHOC from 'components/ShopifyHOC';
import Box from 'components/styled/Box';
import constants from 'constants/index';
import Link from 'next/link';
import Router from 'next/router';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { pageLinks } from 'utils/links';
import log from 'utils/logging';
import { scrollToTop } from 'utils/scroll';
import { track } from 'utils/track';

const AddressContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  @media (min-width: 990px) {
    flex-direction: row;
  }
`;

const ShippingAddressContainer = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fcf9f7;
  padding: 16px;
  @media (min-width: 990px) {
    width: 60%;
    padding: 32px 16px 6px;
    flex-direction: column;
  }
`;

const OrderContainer = styled(Box)`
  display: flex;
  margin-top: 40px;
  @media (min-width: 990px) {
    width: 40%;
    margin-top: 0px;
    margin-left: 40px;
    flex-grow: 1;
  }
`;

const CustomTabBar = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  // padding-bottom: 12px;
  border-bottom: 1px solid #cfcfcf;
`;

const CustomTab = styled(Box)`
  width: 100%;
  flex-grow: 1;
  padding-bottom: 12px;
  border-bottom: ${props => (props.active ? '2px solid #2C4349' : 'none')};
  text-align: center;

  @media (max-width: 989px) {
    display: ${props => (!props.active ? 'none' : 'block')};
  }
`;

const MobileView = styled(Box)`
  display: block;
  @media (min-width: 990px) {
    display: none;
  }
`;

const tabLabel = [
  { label: '01 - SHIPPING INFO', shortLabel: 'SHIPPING' },
  { label: '02 - PAYMENT INFO', shortLabel: 'PAYMENT' },
];

const TAB_CUSTOMINFO = 2;
const TAB_SHIPPING = 0;
const TAB_PAYMENT = 1;

class Checkout extends Component {
  state = {
    currentTab: TAB_SHIPPING,
    redeemed: false,
    selectedAddress: {},
    isMounted: false,
    isCheckingFitStatus: false,
  };

  async mount() {
    const { isMounted } = this.state;

    if (!isMounted) {
      const { tab } = this.props;
      this.props.autoApplyShippingLine();
      this.removeGiftProducts();
      this.setState(prevState => ({
        ...prevState,
        currentTab: parseInt(tab),
        isMounted: true,
      }));
      track('[checkout][mount]', { tab });
      scrollToTop();
    }
  }

  async componentDidMount() {
    this.mount();
  }

  quantityWelcomeCard = () => {
    let quantityTriFold = 0;
    const edges = (this.props.mainCartData.cart.lineItems || {}).edges || [];
    edges.map(edge => {
      if (edge.node.title == constants.WELCOME_CARD_TRIFOLD) quantityTriFold += edge.node.quantity;
    });
    return { quantityTriFold };
  };

  removeGiftProducts = async () => {
    const { quantityTriFold } = this.quantityWelcomeCard();
    if (quantityTriFold) await this.props.removeVariant(constants.WELCOME_VARIANT_ID);
  };

  setRedeemed = nextRedeemedState => {
    this.setState({
      redeemed: nextRedeemedState,
    });
  };

  tabClickHandler = index => {
    const { currentTab } = this.state;
    if (index === currentTab) {
      return;
    }
    scrollToTop();
    Router.push(`/checkout?tab=${index}`);
    this.setState({ currentTab: index });
  };

  componentWillUnmount() {
    this._mounted = false;
  }

  render() {
    let { currentTab } = this.state;
    currentTab = parseInt(currentTab);

    return (
      <>
        {this.state.isMounted && !this.state.isCheckingFitStatus ? (
          <Fragment>
            <AddressContainer>
              <ShippingAddressContainer>
                <CustomTabBar>
                  {currentTab === TAB_SHIPPING && (
                    <Link href={pageLinks.SetupDesign.url}>
                      <MobileView position="absolute" left={['30px', '88px']} width="28px">
                        <img src={'/static/icons/arrow-left-nocircle.svg'} alt="left" />
                      </MobileView>
                    </Link>
                  )}
                  {tabLabel.map((item, index) => (
                    <CustomTab key={item.label} active={index === currentTab} onClick={() => {}}>
                      {item.label}
                    </CustomTab>
                  ))}
                </CustomTabBar>
                {currentTab === TAB_CUSTOMINFO && <Box>01 - CUSTOMER INFO</Box>}
                {currentTab === TAB_SHIPPING && (
                  <ShippingAddress
                    tabClickHandler={this.tabClickHandler}
                    onSelectAddress={address => this.setState({ selectedAddress: address })}
                  />
                )}
                {currentTab === TAB_PAYMENT && (
                  <Payment
                    tabClickHandler={this.tabClickHandler}
                    redeemed={this.state.redeemed}
                    setRedeemed={this.setRedeemed}
                  />
                )}
              </ShippingAddressContainer>
              <OrderContainer>
                <OrderSummary
                  redeemed={this.state.redeemed}
                  setRedeemed={this.setRedeemed}
                  showPayment={currentTab === TAB_PAYMENT}
                />
              </OrderContainer>
            </AddressContainer>
            <Box mt="48px" mb={['100px', 'unset']}>
              <PaymentMethods />
            </Box>
          </Fragment>
        ) : (
          <Loading
            isLoading={this.state.isCheckingFitStatus}
            height="calc(100% - 88px)"
            background="white"
          />
        )}
      </>
    );
  }
}

const mapStateToProps = state => ({
  profileData: state.profileData,
});

const ShopifyCheckout = ManimeStandardContainer(
  FitWall(ShopifyHOC(connect(mapStateToProps)(Checkout)))
);

const _Checkout = props => {
  return <ShopifyCheckout {...props} />;
};
export async function getStaticProps(context) {
  const response = await getGlobalProps({ propsToMerge: { tab: TAB_SHIPPING } });
  return response;
}
export default _Checkout;
