import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';

import RedeemBox from 'components/RedeemBox';
import { SET_CART_SIDEBAR } from 'actions/index';
import { pageLinks } from 'utils/links';
import ShopifyHOC from 'components/ShopifyHOC';
import { decimalFormat } from 'utils/math';
import { calculateOrderData } from 'utils/calculateOrderData';
import { giftMaxTopCoatNo2 } from 'constants/index';
import { checkIsDiscountApplied, getAppliedDiscountCode } from 'utils/cartUtils';
import BagSummary from 'components/checkout/BagSummary';
import style from '@styles/checkout/order-summary.module.css';

type Props = {
  userData;
  dispatchSetCartSideBar;
  redeemed;
  setRedeemed;
  mainCartData;
  giftProduct;
  showPayment;
  isHiddenTitle;
  isPaymentPage;
  isGroupGift;
  removeDiscountCode;
};

type State = {
  creditsToRedeem;
  newCredits;
  newTotal;
};
class OrderSummary extends Component<Props, State> {
  constructor(props) {
    super(props);

    const newCredits = (((this || {}).props || {}).userData || {}).credits || 0;
    this.state = {
      creditsToRedeem: 0,
      newCredits,
      newTotal: 0,
    };
  }

  editBagHandler = () => {
    Router.push(pageLinks.SetupDesign.url);
    this.props.dispatchSetCartSideBar(true);
  };

  toggleRedeem = () => {
    const nextRedeemedState = !this.props.redeemed;

    this.props.setRedeemed(nextRedeemedState);
    // OPTIMIZE: single source of truth of credits redeemed in checkout or ui state of redeemed or not?
  };

  calculateOrderTotal() {
    const { mainCartData, userData } = this.props;
    const result = calculateOrderData(userData, mainCartData);
    this.setState({
      ...result,
    });
  }

  render() {
    const {
      mainCartData,
      userData,
      giftProduct,
      showPayment,
      isHiddenTitle,
      isPaymentPage,
      isGroupGift,
    } = this.props;
    const { newCredits, newTotal, creditsToRedeem } = calculateOrderData(userData, mainCartData);
    const isAuth = (this.props.userData || {}).isAuth || undefined;

    const cart = mainCartData.cart;

    let edges = cart?.lineItems?.edges || [];
    let checkout = cart;

    let discountCode = '';
    if (
      checkout &&
      Array.isArray(checkout.customAttributes) &&
      checkout.customAttributes.length > 0
    ) {
      checkout.customAttributes.map(customAttribute => {
        if (customAttribute.key == 'discountName') discountCode = customAttribute.value;
      });
    }

    const subtotalPrice = parseFloat(checkout ? checkout.subtotalPrice : '') || 0;
    const totalPrice = checkout ? checkout.totalPrice : '';
    const totalTax = checkout ? checkout.totalTax : '';
    const shippingCost =
      parseFloat(checkout && checkout.shippingLine ? checkout.shippingLine.priceV2.amount : 0) || 0;
    const lineItemsSubtotalPrice =
      parseFloat(((checkout || {}).lineItemsSubtotalPrice || {}).amount || 0) || 0;
    const credits = (((this || {}).props || {}).userData || {}).credits;
    const isDiscountApplied = checkIsDiscountApplied(mainCartData?.cart);
    const code = getAppliedDiscountCode(mainCartData?.cart);

    const creditsValid = !isNaN(credits) && typeof credits == 'number';

    return (
      <div className={style.container}>
        <div className={style.root}>
          <div className={style.titleLine}>
            <div>Order Summary</div>

            <div className={style.underline} onClick={this.editBagHandler}>
              Edit Bag
            </div>
          </div>
          {subtotalPrice > 0 && (
            <div className={style.oneLine}>
              <div>Bag Items:</div>
              <div>
                <span>$</span>
                <span>{decimalFormat(lineItemsSubtotalPrice)}</span>
              </div>
            </div>
          )}
          {lineItemsSubtotalPrice - subtotalPrice > 0 && (
            <div className={style.oneLine}>
              <div className={style.oneLine}>
                <div>Promo {discountCode && `${discountCode}`}</div>
                <div>
                  &nbsp;&nbsp;
                  <a
                    href="#"
                    style={{ textDecoration: 'underline' }}
                    onClick={this.props.removeDiscountCode}
                  >
                    remove
                  </a>
                </div>
              </div>
              <div style={{ flex: '1', textAlign: 'right' }}>
                – ${decimalFormat(lineItemsSubtotalPrice - subtotalPrice)}
              </div>
            </div>
          )}
          {shippingCost > 0 && (
            <div className={style.oneLine}>
              <div>Shipping (4-7 Business days)</div>
              <div>{shippingCost > 0 ? `$${decimalFormat(shippingCost)}` : 'FREE'}</div>
            </div>
          )}
          {totalTax && (
            <div className={style.oneLine}>
              <div>Taxes:</div>
              <div> ${decimalFormat(totalTax)}</div>
            </div>
          )}
          {totalPrice && <div className={style.line} />}
          {totalPrice && (
            <div className={style.oneLine}>
              <div>Bag Total:</div>
              <div>
                <span>$</span>
                <span>{decimalFormat(totalPrice)}</span>
              </div>
            </div>
          )}
          {this.props.redeemed && creditsToRedeem > 0 && (
            <div className={style.oneLine}>
              <div>ManiMoney: &nbsp;</div>
              <a
                href="#"
                style={{ textDecoration: 'underline', flexGrow: 1 }}
                onClick={this.toggleRedeem}
              >
                remove
              </a>
              <div>
                <span>{decimalFormat(creditsToRedeem)}</span>
              </div>
            </div>
          )}

          {totalPrice && (
            <>
              <div className={style.line} />
              <div className={style.oneLine}>
                <div className={style.bold}>Order Total: &nbsp;</div>
                <div className={style.bold}>
                  ${this.props.redeemed ? newTotal.toFixed(2) : totalPrice}
                </div>
              </div>
            </>
          )}
        </div>

        <div className={style.whiteBox}>
          <RedeemBox callback={this.calculateOrderTotal} />
        </div>
        <BagSummary
          subtotalPrice={subtotalPrice}
          edges={edges}
          giftProduct={code === 'IPSYGLAM' && isDiscountApplied ? giftMaxTopCoatNo2 : null}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userData: state.userData,
  uiData: state.uiData,
  mainCartData: state.mainCartData,
});

const mapDispatchToProps = dispatch => ({
  dispatchSetCartSideBar: isOpen => dispatch(SET_CART_SIDEBAR(isOpen)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShopifyHOC(OrderSummary));
