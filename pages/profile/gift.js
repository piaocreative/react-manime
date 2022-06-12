import PageWrapper, { ManimeStandardContainer, getGlobalProps } from 'components/core/hoc/PageWrapper';
import React, { Component } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import { PrimaryButton } from '../../components/basic/buttons';
import Box from '../../components/styled/Box';
import { Img, StandardInputField as StandardInput } from '../../components/styled/StyledComponents';
import log from '../../utils/logging'
import TopHeader from '../../components/profile/TopHeader';
import AccountMenuPanel, { ProfileContainer } from '../../components/profile/AccountMenuPanel';
import { connect } from 'react-redux';
import { redeemGiftCard, getGiftCard } from 'api/giftUp';
import { addCredits } from 'api/user';
import { SET_KEY_VALUE } from '../../actions';
import { trackFunnelActionProjectFunnel,  } from '../../utils/track';
import {pageLinks} from '../../utils/links'
import AuthWallHOC from '../../components/AuthWallHOC'
const profileGiftImage = 'https://d1b527uqd0dzcu.cloudfront.net/web/profile-gift.jpg';

const GiftGiveContainer = styled(Box)`
  // background: red;
  display: flex;
  flex-direction: column;
  background: #F9F9F9;
  overflow: hidden;
  flex-grow: 1;
  position: relative;
  overflow: hidden;
  & > div {
    width: 100%;
  }
`;

const GiftGiveContent = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: 1024px) {
    & > div {
      width: 100%;
    }

    & > img {
      width: 400px;
    }
  }
`;

const Container = styled(Box)`
  display: flex;
  flex-direction:column;
  @media (min-width: 768px) {
    flex-direction: row;
    // height: calc(100vh - 140px);
  }
`;

const RightContainer = styled(Box)`
  flex-grow: 1;
`;

const ProfileLeaves = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  @media (min-width: 768px) {
    justify-content: center;
  }
  @media (min-width: 1440px) {
    justify-content: space-between;
  }

  & > div {
    flex-grow: 1;
  }
`;

const A = styled.a`
  color: #F7BFA0;

  :hover {
    color: #F7BFA0;
  }
`;

const RedeemContainerBox = styled(Box)`
  background-color: #F8F1ED;
  background-repeat: no-repeat;
  background-size: auto;
  background-position: 80% -50px;
  background-image: url('/static/icons/lightpink-bubble.svg');
`;


const GiftImage = styled(Img)`
  padding-bottom: 16px;
  height: auto;
  width: 100%;
  @media (min-width: 480px) {
    object-fit: contain;
    height: 280px;
  }
  @media (min-width: 768px) {
    width: 100%;
    height: auto;
    object-fit: contain;
  }
  @media (min-width: 1024px) {
    padding-bottom: 0;
    height: unset;
    object-fit: contain;
  }
`;

const RedeemBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GiftInputBox = styled(Box)`
  width: 100%;
  max-width: 280px;
  margin-top: 4px;
  & > button {
    width: 100%;
    max-width: 280px;
  }
  @media (min-width: 768px) {
    width: 100%;
    max-width: 280px;
  }
`;

const BEFORE_REDEEM_CLICK = -1;
const REDEEMEED = 0;
const ALREADY_REDEEMEED = 1;
const INVALID_CODE = 2;

class ProfileOrder extends Component {
  state = {
    code: '',
    beforeRedeem: true,
    redeemedError: false,
    redeemStatus: BEFORE_REDEEM_CLICK,
    remainingValue: 0,
  }

  componentDidMount () {
    this.setState({beforeRedeem: true});
  }

  navToGiftPage = () => {
    Router.push('/gift');
  }

  redeemGiftCardHandler = async () => {
    const { code } = this.state;
    let remainingValue = 0;
    let isSuccess = false;
    this.setState({beforeRedeem: false});
    if (!code) {
      return;
    }
    try {
      const giftCardData = await getGiftCard(code);
      log.info('giftCardData', giftCardData);

      remainingValue = ((giftCardData || {}).data || {}).remainingValue;
      const canBeRedeemed = ((giftCardData || {}).data || {}).canBeRedeemed;
      this.setState({remainingValue});
      if (canBeRedeemed) {
        this.setState({redeemStatus: REDEEMEED});
        await redeemGiftCard(code, remainingValue, `${this.props.userData.identityId} redeemed ${remainingValue} from gift card`);
        trackFunnelActionProjectFunnel('[Redeem][gift] giftCode canBeRedeemed');
        isSuccess = true;
      } else {
        this.setState({redeemStatus: ALREADY_REDEEMEED});
        trackFunnelActionProjectFunnel('[Redeem][gift] giftCode already redeemed');
      }
    } catch (err) {
      log.info('[redeemGiftCardHandler] err ====>', err);
      this.setState({redeemStatus: INVALID_CODE});
      log.error('[gift] redeemGiftCard 1', { err } )
    }

    if (isSuccess) {
      try {
        const addCreditResult = await addCredits(this.props.userData.identityId, remainingValue, 'Redeemed GIFT card', 'Gift card');
        log.info(addCreditResult);
        const prevCredits = this.props.userData.credits;

        log.info(prevCredits);
        trackFunnelActionProjectFunnel('[Redeem][gift] giftCode succeeded in applying', { prevCredits, addCreditResult});

        if (prevCredits !== addCreditResult.credits) {
          log.info('different');
          this.props.dispatchSetKeyValue('credits', addCreditResult.credits);
        }
      } catch (err) {
        log.error('[gift] redeemGiftCard 2', { err } )
      }
    }
  }

  render () {
    const { code, redeemStatus, remainingValue, beforeRedeem } = this.state;
    const { userData, isMobileView } = this.props || {};
    const credits = userData.credits || 0;

    const careEmail = (<A target="_blank" href="mailto:care@manime.co">care@manime.co</A>);
    return (
      
              <>
        <TopHeader />
        <ProfileContainer>
          <AccountMenuPanel userData={userData} showInfo showMenu={!isMobileView} />
          <RightContainer>
            <GiftGiveContainer px={[3, 3, 5]} py={4}>
              <Box width='100%' textAlign='center' fontSize='30px' letterSpacing='2px' mb={3}>
                GIVE
              </Box>
              <GiftGiveContent display='flex'>
                <GiftImage src={profileGiftImage} alt='profile-gift' objectFit='cover'/>
                <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                  <PrimaryButton style={{padding: '0 40px', marginTop: '24px'}} onClick={this.navToGiftPage}>
                    SEND A GIFT CARD
                  </PrimaryButton>
                </Box>
              </GiftGiveContent>
            </GiftGiveContainer>
            <ProfileLeaves>
              <RedeemContainerBox px={[4, 5]} py={[3, 4]} color='forecolor.0'>
                <Box fontSize='30px' letterSpacing='2px' textAlign='center' pb={3}>
                  REDEEM
                </Box>
                {/* <Box px={['10%', '20%', '25%']} pt={4} pb='20px' textAlign='center'>
                  Sed at elementum erat. Aenean quis porttitor diam, sed aliquet ligula.
                </Box> */}

                <RedeemBox mb={4}>
                  <GiftInputBox>
                    <StandardInput
                      error={!beforeRedeem && !code}
                      errorText={`Code required`}
                      placeholder='CODE'
                      value={code}
                      onChange={ev => this.setState({code: ev.target.value})} background='transparent' />
                  </GiftInputBox>
                  <GiftInputBox>
                    <PrimaryButton onClick={this.redeemGiftCardHandler}>GET YOUR GIFT</PrimaryButton>
                  </GiftInputBox>
                </RedeemBox>
                { redeemStatus === ALREADY_REDEEMEED && <Box mb={3} textAlign='center'>
                  This gift card has already been redeemed. <br />
                  If you have any questions, please reach out to {careEmail}
                </Box>}
                { redeemStatus === REDEEMEED && <Box mb={3} textAlign='center'>
                  Yay! You just got ${remainingValue} worth of ManiMoney.
                </Box>}
                { redeemStatus === INVALID_CODE && <Box mb={3} textAlign='center'>
                  Sorry, we could not find any GIFT card under that code. <br />
                  Please reach out to {careEmail} if you have any questions.
                </Box>}
                <Box textAlign='center'>
                  Your ManiMoney balance is: ${credits || 0}
                </Box>
              </RedeemContainerBox>
            </ProfileLeaves>
          </RightContainer>
          {isMobileView &&
            <AccountMenuPanel userData={userData} showInfo={false} showMenu />
          }
        </ProfileContainer>
      </>

    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  userData: state.userData
});

const mapDispatchToProps = dispatch => ({
  dispatchSetKeyValue: (key, value) => dispatch(SET_KEY_VALUE(key, value))
})

export default ManimeStandardContainer(AuthWallHOC(connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileOrder)));

export const getStaticProps = async () => await getGlobalProps();

