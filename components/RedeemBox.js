
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Box from './styled/Box';
import { StyledStandardDarkButton } from './styled/StyledComponents';
import ShopifyHOC from './ShopifyHOC';
import Link from 'next/link'
import log from '../utils/logging'

import { SET_KEY_VALUE, SET_FLOW,  } from '../actions';
import {SetDiscountCodeResponse, SetDiscountCode} from 'actions/cart'
import { trackFunnelActionProjectFunnel } from '../utils/track';
import { addCredits } from 'api/user';
import { redeemGiftCard, getGiftCard } from 'api/giftUp';
import { pageLinks } from '../utils/links';

const SHOPIFY_CODES = {
  SUPC_VIOLATION: 'CUSTOMER_ALREADY_USED_ONCE_PER_CUSTOMER_DISCOUNT_NOTICE',
  NO_QUALIFIER: 'NO_QUALIFIER'
}

const DiscountResponseBox = styled(Box)`
  font-style: italic;
  margin-top: 4px;
  font-size: 12px;
  white-space: nowrap;

  @media (min-width: 480px) {
    font-size: 14px;
  }
`;

const A = styled.a`
  color: #FF8181;
  :hover {
    color: #FF8181;
  }
`;

const Input = styled.input`
  border: ${props => props.isError ? `1px solid #FF8181`: `1px solid #2C4349`};
  border-radius: 0;
  height: 40px;
  background: #f3f4f5;
  font-size: 14px;
  &::placeholder {
    font-size: 14px;
  }
  :focus {
    outline: none;
  }
`;

const BEFORE_REDEEM_CLICK = -1;
const REDEEMEED = 0;
const ALREADY_REDEEMED = 1;
const INVALID_CODE = 2;
const NO_QUALIFIERS = 3
const SUPC_VIOLATION = 4;

const STEP_ONE = 0;
const STEP_TWO = 1;

const careLink = (
  <A target="_blank" href="mailto:care@manime.co">care@manime.co</A>
);
const INITIAL_STATE = {
  currentStep: STEP_ONE,
  discountCode: '',
  lastDiscountCode: '',
  redeemStatus: BEFORE_REDEEM_CLICK,
  remainingValue: 0,
  beforeRedeem: true
}
class RedeemBox extends Component {
  state = {...INITIAL_STATE}

  applyDiscountHandler = (callback) => {
    const { discountCode } = this.state;
    // track('[Redeem][RedeemBox]', {discountCode});
    trackFunnelActionProjectFunnel('[Redeem][RedeemBox][1] applyDiscountHandler start', {discountCode});
    this.setState({beforeRedeem: false});
    if (!discountCode) {
      return;
    }
    this.props.dispatchDiscountCodeResponse(undefined);
    this.props.applyDiscountCode(discountCode);
    this.setState({
      lastDiscountCode: discountCode,
      redeemStatus: BEFORE_REDEEM_CLICK
    });
   // callback();
  }

  async componentDidUpdate(prevProps) {
    const { discountResponse: oldResponse } = prevProps;
    const { discountResponse } = this.props;
    if (discountResponse !== undefined && discountResponse !== oldResponse) {
      let remainingValue = 0;
      if (discountResponse !== 'SUCCESS') {
        this.props.dispatchDiscountCode('');
        // track('[Redeem][RedeemBox] failed in applying discountCode', {discountResponse});
        const { isAuth } = ((this || {}).props || {}).userData;
        const { lastDiscountCode } = this.state;
        if (isAuth) {
          let isSuccess = false;
          try {
            const giftCardData = await getGiftCard(lastDiscountCode);

            remainingValue = ((giftCardData || {}).data || {}).remainingValue;
            const canBeRedeemed = ((giftCardData || {}).data || {}).canBeRedeemed;
            if (canBeRedeemed) {
              this.setState({redeemStatus: REDEEMEED, remainingValue});
              await redeemGiftCard(lastDiscountCode, remainingValue, `${this.props.userData.identityId} redeemed ${remainingValue} from gift card`);
              // track('[Redeem][RedeemBox] giftCode canBeRedeemed');
              isSuccess = true;
            } else {
              this.setState({redeemStatus: ALREADY_REDEEMED, remainingValue: 0});
              // track('[Redeem][RedeemBox] giftCode already redeemed');
            }
          } catch (err) {

            this.setState({redeemStatus: INVALID_CODE, remainingValue: 0});
            if(discountResponse===SHOPIFY_CODES.SUPC_VIOLATION){
              this.setState({ redeemStatus: SUPC_VIOLATION, remainingValue: 0 });	
            }
            else if(discountResponse===SHOPIFY_CODES.NO_QUALIFIER){	
              this.setState({ redeemStatus: NO_QUALIFIERS, remainingValue: 0 });	
            }	
            else{	
              this.setState({ redeemStatus: INVALID_CODE, remainingValue: 0 });	
            }	
            log.verbose('[invalid gift code]', err);
          }
          if (isSuccess) {
            try {
              const addCreditResult = await addCredits(this.props.userData.identityId, remainingValue, 'Redeemed GIFT card', 'Gift card');
              log.info(addCreditResult);
              const prevCredits = this.props.userData.credits;

              log.info(prevCredits);
              // track('[Redeem][RedeemBox] giftCode succeeded in applying', { prevCredits, addCreditResult});

              if (prevCredits !== addCreditResult.credits) {
                log.info('different');
                this.props.dispatchSetKeyValue('credits', addCreditResult.credits);
              }
            } catch (err) {
              log.error(`[RedeemBox] redeemGiftCard in RedeemBox ${err}`, { err })
            }
          }
        }
      } else {
        this.props.dispatchDiscountCode(this.state.lastDiscountCode);
      }
    }
  }

  render () {
    const { discountResponse, userData, mainCartData } = this.props;
    const { redeemStatus, lastDiscountCode, remainingValue, currentStep, beforeRedeem, discountCode }  = this.state;

    const invalidCodeCondition = this.state.lastDiscountCode && discountResponse !== undefined && discountResponse !== 'SUCCESS' && !this.props.userData.isAuth;

    if (currentStep === STEP_ONE) {
      return (
        <Box
          width={1} height='40px' background='#F9F9F9' pl={'16px'} pt='12px' style={{cursor: 'pointer', textDecoration: 'underline'}}
          onClick={() => {
            const temp = {...INITIAL_STATE}
            temp.currentStep = STEP_TWO
            this.setState(temp)
          }}>
          + Add promo or gift code
        </Box>
      );
    }

    const isErrorResponse = (redeemStatus !== 'SUCCESS') ||
      redeemStatus === ALREADY_REDEEMED;

    let checkout = mainCartData?.cart;


    const lineItemsSubtotalPrice = parseFloat(checkout?.lineItemsSubtotalPrice?.amount || 0) || 0;
    const subtotalPrice = parseFloat(checkout ? checkout.subtotalPrice : '') || 0;
    const isDiscountApplied = lineItemsSubtotalPrice - subtotalPrice > 0;
    const buttonLabel = isDiscountApplied ? 'Undo' : (this.props.text || 'Apply');

    return (
      <>
        <Box display='flex' width='100%' mb={0} border='2px solid #2c4349' background='#f3f4f5'>
          <Input
            // isError={isErrorResponse || (!beforeRedeem && !discountCode)}
            style={{flexGrow: 1, width: '60%', paddingLeft: 12, border: 'none'}}
            placeholder='Add promo or gift code'
            value={this.state.discountCode}
            onChange={ev => this.setState({ discountCode: ev.target.value }) }/>
          <StyledStandardDarkButton
            width='88px'
            height='28px'
            my='auto'
            mr='10px'
            style={{textTransform: 'uppercase'}}
            onClick={isDiscountApplied ? this.props.removeDiscountCode : () => this.applyDiscountHandler(this.props.callback)}>
            {buttonLabel}
          </StyledStandardDarkButton>
        </Box>
        {
          (this.state.lastDiscountCode && discountResponse !== undefined) &&
          <DiscountResponseBox color='forecolor.2' fontSize='14px'>
          {
            discountResponse === 'SUCCESS' &&
            `Yay! Your discount code "${lastDiscountCode}" has been applied.`
            // `Oops. Discount code "${lastDiscountCode}" is not valid.`
          }
          </DiscountResponseBox>
        }
        <DiscountResponseBox color={redeemStatus !== REDEEMEED ? 'forecolor.6': 'forecolor.2'} fontSize='14px'>
        {
          (redeemStatus === NO_QUALIFIERS && lastDiscountCode?.toLocaleLowerCase()?.indexOf('allure') > -1 ) ?	   
          <>	           
            Please add an <Link  href={`${pageLinks.ShopAllure.url}`}>Allure design</Link> to your cart to <br />
            qualify  for this promotion.
          </> 
        :

        (redeemStatus === NO_QUALIFIERS) ?	
          <>	           
          {`You do not qualify for this discount.`}	  
          </> 
        :

          (redeemStatus === INVALID_CODE || invalidCodeCondition)?
            <>
              {`The code “${lastDiscountCode}” you entered doesn’t exist.`} <br />
              {`Please try again or reach out to`} {careLink}
            </>:
          redeemStatus === ALREADY_REDEEMED ?
            <>
              {`This gift card has already been redeemed. If you `} <br />
              {`have any questions, please reach out to ${careLink} `}
            </>:
          redeemStatus === REDEEMEED ?
            `Yay! You just got $${remainingValue} worth of ManiMoney.`
          : 
          
          redeemStatus === SUPC_VIOLATION ?
            <>
              {`The code “${lastDiscountCode}” can only be used `} <br />
              {`one time per customer. `}
              </>
          :
          null
        }
        </DiscountResponseBox>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.userData,
  discountResponse: state.mainCartData.discountResponse
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  dispatchDiscountCodeResponse: code => dispatch(SetDiscountCodeResponse(code)),
  dispatchSetKeyValue: (key, value) => dispatch(SET_KEY_VALUE(key, value)),
  dispatchDiscountCode: discountCode => dispatch(SetDiscountCode(discountCode))
});

export default connect(mapStateToProps, mapDispatchToProps)(ShopifyHOC(RedeemBox));
