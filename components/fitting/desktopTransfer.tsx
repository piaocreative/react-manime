import React, { Component } from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import QRCode from 'qrcode.react';
import { constructLoginLink } from '../../utils/authUtils';
import Box from '../styled/Box';
import {
  StandardInput,
  StyledStandardDarkButton,
  Img,
} from '../styled/StyledComponents';
import CheckIcon from '../icons/howto/CheckIcon';
import UncheckIcon from '../icons/howto/UncheckIcon';

import { connect } from 'react-redux';
import { trackFunnelActionProjectFunnel } from '../../utils/track';
import { sendKlaviyoEmail, sendSMS } from 'api/util'
import config from '../../config'
import log from '../../utils/logging';

const LeftBox = styled(Box)`
  width: 100%;
  position: relative;
  background-color: #eae9e7;
  padding-top: 48px;
  @media (min-width: 768px) {
    margin: 0;
    width: 40%;
    height: 100%;
    max-width: 480px;
  }
  @media (min-width: 1400px) {
    max-width: 520px;
    padding-top: 100px;
  }
`;

const RightBox = styled(Box)`
  width: 100%;
  @media (min-width: 768px) {
    min-width: 60%;
    height: 100%;
  }
`;

const GreetingBox = styled(Box)`
  font-size: 22px;
  text-transform: uppercase;
  @media (min-width: 1400px) {
    font-size: 28px;
  }
  @media (min-width: 1920px) {
    font-size: 30px;
  }
`;

const PageBox = styled(Box)`
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    width: 100%;
    flex-direction: row;
    min-height: calc(100vh - 140px);
  }
`;

const CustomInput = styled(StandardInput)`
  margin: 0;
  width: 100%;
  flex-grow: 1;
  // border: 1px solid #F7BFA0;
  background: transparent;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  auto-complete: 'tel';
`;

const CenterBox = styled(Box)`
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  align-items: center;
`;

const BoldLabel = styled.span`
  font-family: 'avenirBlack';
  color: #59aa8e;
`;

const UnderLine = styled.span`
  cursor: pointer;
  text-decoration: underline;
  color: #f7bfa0;
  &:hover {
    color: #f7bfa0;
  }
`;

const Line = styled(Box)`
  flex-grow: 1;
  height: 1.5px;
  background-color: #d8d8d8;
`;

class StartPage extends Component<
  {
    email: string;
    phoneNumber: string;
    profileType?: string;
    userData: any;
    targetUrl?: string;
  },
  any
> {
  constructor(props) {
    super(props);

    const phoneNumber =
      (((this || {}).props || {}).userData || {}).phoneNumber || '';
    const emailTo = ((this || {}).props || {}).email || '';
    

    this.state = {
      status: '',
      errorStatus: '',
      sentEmailOrText: false,
      phoneNumber,
      emailTo,
      secondaryStatus: '',
      isLoading: false,
      url: undefined,
    };
    
  }

  async componentDidMount(){
    let currentPage = Router?.router?.asPath;
    if(this.props.targetUrl){
      currentPage = this.props.targetUrl
    }
    trackFunnelActionProjectFunnel(`[desktopTransfer][mount] Viewing desktop transfer`);
    const url = await constructLoginLink(this.state.emailTo, currentPage);
    const newState ={  ...this.state, url}

    this.setState(newState);
  }



  sendMail = async () => {
    trackFunnelActionProjectFunnel(`[desktopTransfer][sendMail] start`);

    const { emailTo } = this.state;
    // NOTE: VALIDATE email
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // const regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
    if (!regex.test(emailTo)) {
      this.setState({
        errorStatus: 'Invalid email address',
        sentEmailOrText: false,
      });
      return;
    }

    const status = (
      <Box color="forecolor.7" textAlign='left'>
        <BoldLabel>An email with the link was sent to {emailTo}</BoldLabel> <br />
        Please check for the email on your mobile device (including the spam folder)
      </Box>
    );

    let email = '';

    try {
      await sendKlaviyoEmail({
        templateId: config.klaviyoTemplate.desktopTransfer,
        subject: `Start Your ManiMe Scan`,
        user: {email: emailTo, name: ''},
        context: {
          link: this.state.url + '&mode=email'
        }
      });
    } catch (err) {
      log.error('[fitting/desktopTransfer][sendEmail] error sending referral email', { err } );
    }

    log.info(`should be sending with this link: ${this.state.url + '&mode=email'}`)

    this.setState({
      errorStatus: '',
      status,
      sentEmailOrText: true,
    });
  };

  sendSMS = async () => {
    trackFunnelActionProjectFunnel(`[desktopTransfer][sendSMS] start`);

    const { phoneNumber, emailTo } = this.state;

    // NOTE: phone validation
    if (!phoneNumber || phoneNumber.replace(/\D/g, '').length != 10) {
      this.setState({
        errorStatus: 'Invalid phone number',
        sentEmailOrText: false,
      });
      return;
    }

    const status = (
      <Box color="forecolor.7" textAlign='left'>
        <BoldLabel>A text message with the link was sent to {phoneNumber} <br /></BoldLabel>
        Please check for the text message on your mobile device, then click on the link
      </Box>
    );

    // if (usePresignedFederated) setItemToLocalStorage('presignedFederatedLink', '');
    sendSMS(
      this.state.phoneNumber,
      `Let's 3D scan your nails in the following link: ${this.state.url+'&mode=sms'}`
    );

    this.setState({
      errorStatus: '',
      status,
      sentEmailOrText: true,
    });
  };

  updateNumber = (ev) => {
    const { phoneNumber } = this.state;
    let phoneNum = ev.target.value;
    if (phoneNumber.length > phoneNum.length) {
      this.setState({ phoneNumber: ev.target.value });
    } else {
      phoneNum = ev.target.value.replace(/\D/g, '');
      phoneNum =
        '(' +
        phoneNum.substring(0, 3) +
        ') ' +
        phoneNum.substring(3, 6) +
        ' - ' +
        phoneNum.substring(6, 10);
      this.setState({ phoneNumber: phoneNum });
    }
  };

  updateEmailTo = (ev) => {
    this.setState({ emailTo: ev.target.value });
  };

  render() {
    const firstName =
      ((((this || {}).props || {}).userData || {}).name || {}).firstName || '';
    const {
      sentEmailOrText,
      phoneNumber,
      emailTo,
      status,
      errorStatus,
      isLoading,
    } = this.state;
    const { profileType } = this.props;

    return (
      <PageBox>
        <LeftBox>
          <Box textAlign="center" position="relative" zIndex={1}>
            <GreetingBox letterSpacing="2px" px={'10%'}>
              {firstName}
              {firstName ? ',' : ''} It's time <br />
              to scan your {profileType || 'nails'}!
            </GreetingBox>
            <Box pt={3} px={[3, '40px']}>
              ManiMe sizes the stick-on gels <br /> to your unique nailbeds.
            </Box>
          </Box>

          <Img
            position="absolute"
            left='0'
            bottom="0"
            width={1}
            src="https://d1b527uqd0dzcu.cloudfront.net/desktop/transition-banner.jpg"
            alt="manime-hands"
          />
        </LeftBox>
        <RightBox
          background="#FCF9F7"
          display="flex"
          position="relative"
          flexDirection="column"
          justifyContent="flex-start"
          p={'48px 0'}
        >
          <CenterBox>
            <Img
              src='https://d1b527uqd0dzcu.cloudfront.net/desktop/transition-logo.svg'
              width='116px'
              height='138px'
              alt='transition-logo' />
            <Box textAlign="center" mt={2}>
              <Box fontSize="24px" fontFamily="avenirHeavy" letterSpacing="2px" style={{textTransform: 'uppercase'}}>
                Continue with your mobile
              </Box>
              <Box fontSize='17px' mt={3}>Complete your nail scan on your smartphone.</Box>
            </Box>

            <Box display="flex" width="100%" justifyContent="center">
              <Box width="100%" px="60px" display="flex" flexDirection="column">
                <Box display="inline-flex" width={1} style={{gap: '40px'}}>
                  <Box my={3} flex={1}>
                    <Box display="flex" alignItems="center" pb={4}>
                      <Line />
                      <Box px={3}>Scan with your phone</Box>
                      <Line />
                    </Box>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                      {this.state.url && <QRCode value={this.state.url + '&mode=qrcode'} size={220} includeMargin /> }
                    </div>
                  </Box>

                  <Box flex={1}>
                    {/* EMAIL BLOCK START */}
                    <Box my={3}>
                      <Box display="flex" alignItems="center" pb={3}>
                        <Line />
                        <Box px={3}>Enter your email</Box>
                        <Line />
                      </Box>
                      <CustomInput
                        underlined
                        style={{ autoComplete: 'email' }}
                        name="email"
                        type="email"
                        onChange={this.updateEmailTo}
                        value={emailTo}
                        readOnly={this.state.activeVariant == 'authFlowB'}
                      />
                      <StyledStandardDarkButton
                        disabled={isLoading}
                        mt={3}
                        width={1}
                        height="40px"
                        onClick={this.sendMail}
                      >
                        Send Email
                      </StyledStandardDarkButton>
                    </Box>
                    {/* EMAIL BLOCK END */}

                    {/* PHONE BLOCK START */}
                    <Box my={4}>
                      <Box display="flex" alignItems="center" my={3}>
                        <Line />
                        <Box px={3}>or your phone number</Box>
                        <Line />
                      </Box>
                      <CustomInput
                        underlined
                        name="phone"
                        type="tel"
                        placeholder="(123) 456 - 7890"
                        onChange={this.updateNumber}
                        value={phoneNumber}
                      />
                      <StyledStandardDarkButton
                        disabled={isLoading}
                        mt={3}
                        width={1}
                        height="40px"
                        onClick={this.sendSMS}
                      >
                        Send Text
                      </StyledStandardDarkButton>
                    </Box>
                    {/* PHONE BLOCK END */}
                    <Box minHeight="82px" maxWidth="500px" m="0 auto">
                      {status && (
                        <Box mt={2} color="forecolor.3" textAlign="center" display='inline-flex' style={{gap: '8px'}}>
                          <CheckIcon color='#59aa8e' size='18px' />
                          {status}
                        </Box>
                      )}
                      {errorStatus && (
                        <Box mt={4} color="#ec7552" textAlign="center" display='inline-flex' style={{gap: '8px'}}>
                          <UncheckIcon color='#ec7552' size='18px' />
                          {errorStatus}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>

              </Box>
            </Box>

          </CenterBox>
        </RightBox>
      </PageBox>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.userData,
  mainCartData: state.mainCartData,
});

const _TransferComponent = connect(mapStateToProps, null)(StartPage);

class TransferComponent extends Component<{
  email: string;
  phoneNumber: string;
  profileType?: string;
  targetUrl?: string
}> {
  render() {

    return (
      <_TransferComponent
        email={this.props.email}
        phoneNumber={this.props.phoneNumber}
        profileType={this.props.profileType}
        targetUrl={this.props.targetUrl}
      />
    );
  }
}

export default TransferComponent;
