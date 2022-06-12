import { getProvidersByEmail } from 'api/user';
import CheckBox from 'components/basic/checkbox';
import LoadingAnimation from 'components/LoadingAnimation';
import Link from 'next/link';
import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { createDbUser, dispatchSignInEvent, signUp } from 'utils/authUtils';
import checkMobile from 'utils/checkMobile';
import { pageLinks } from 'utils/links';
import log from 'utils/logging';
import { trackCheckout, trackFunnelActionProjectFunnel } from 'utils/track';
import { checkValidEmail } from 'utils/validation';
import Box from '../styled/Box';
import {
  StandardInputField as StandardInput,
  StyledStandardDarkButton,
} from '../styled/StyledComponents';
import { A, BackBox, HalfBox, ImgBox, Line } from './styled';

const checkBoxLabel = (
  <Box>
    Text me exclusive offers<sup>1</sup>
  </Box>
);

const GraySup = styled.sup`
  color: #777;
`;

type SignupProps = {
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isLoading?: boolean;
  callback: Function;
  providerid?: string;
  provider?: string;
  back: Function;
  identityId?: string;
  identityError?: boolean;
};

export default function SignUp({
  email,
  callback,
  back,
  firstName,
  lastName,
  phoneNumber,
  isLoading = false,
  provider,
  providerid,
  identityId,
  identityError = false,
}: SignupProps) {
  const [password, setPassword] = useState<string>();
  const [_email, setEmail] = useState<string>();
  const [_loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>();
  const [_firstName, setFirstName] = useState<string>(firstName);
  const [_lastName, setLastName] = useState<string>(lastName);
  const [_phoneNumber, setPhoneNumber] = useState<string>(phoneNumber);
  const [acceptsSMS, setAcceptsSMS] = useState(false);
  const [dbUserCreated, setDbUserCreated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    setEmail(email);
  }, [email]);

  useEffect(() => {
    setFirstName(firstName);
  }, [firstName]);

  useEffect(() => {
    setLastName(lastName);
  }, [lastName]);

  useEffect(() => {
    setPhoneNumber(phoneNumber);
  }, [phoneNumber]);

  function unloading(e) {
    e.preventDefault();
    e.returnValue = provider && dbUserCreated;
  }
  function phoneNumberChangeHandler(ev) {
    let phoneNum = ev.target.value;
    if (_phoneNumber?.length > ev.target.value.length) {
      setPhoneNumber(ev.target.value);
    } else {
      phoneNum = ev.target.value.replace(/\D/g, '');
      phoneNum =
        '(' +
        phoneNum.substring(0, 3) +
        ') ' +
        phoneNum.substring(3, 6) +
        ' - ' +
        phoneNum.substring(6, 10);
      setPhoneNumber(phoneNum);
    }
  }

  function _trackCheckout(optionalData) {
    trackCheckout('[signup]', optionalData);
  }

  async function validateSignUp(ev) {
    ev.preventDefault();
    setIsValidating(true);
    trackFunnelActionProjectFunnel('[SignUp] Validating input', {
      firstName: _firstName,
      lastName: _lastName,
      email: _email,
      phoneNumber: _phoneNumber,
      acceptsSMS,
    });

    let tempStatus = {};

    if (!_firstName) {
      tempStatus = { firstName: 'First name required' };
    }
    if (!_lastName) {
      tempStatus = { ...tempStatus, lastName: 'Last name required' };
    }

    if (!_phoneNumber || _phoneNumber.length === 0) {
      tempStatus = { ...tempStatus, phoneNumber: 'Phone Number required' };
    } else if (_phoneNumber.replace(/\D/g, '').length !== 10) {
      tempStatus = { ...tempStatus, phoneNumber: 'Invalid phone number' };
    }

    if (!_email || _email.length === 0) {
      tempStatus = { ...tempStatus, email: 'Email required' };
    } else {
      const { validSyntaxRecord } = await checkValidEmail(_email);
      if (!validSyntaxRecord) {
        tempStatus = { ...tempStatus, email: 'Invalid email address' };
      } else {
        // need to check to make sure an account witht this email doesn't already exist
        const providers = await getProvidersByEmail(_email?.toLocaleLowerCase());

        if (providers && providers.length > 0) {
          tempStatus = {
            ...tempStatus,
            email: `This email is already used in another account. \n\nWant to create a new account? Use another email.\n\nAre you a returning customer? Sign In to your account.\n\nReach [care@manime.co](mailto://care@manime.co) for assistance.`,
          };
        }
      }
    }

    if (!providerid) {
      if (!password && !providerid) {
        tempStatus = { ...tempStatus, password: 'Password required' };
      } else if (password.length < 6)
        tempStatus = {
          ...tempStatus,
          password: 'Password has to be at least 6 characters long',
        };
    }

    if (Object.keys(tempStatus).length > 0) {
      setStatus(tempStatus);
      setIsValidating(false);
      return;
    } else {
      setStatus(undefined);
    }

    trackFunnelActionProjectFunnel('[SignUp] Input is valid', {
      firstName: _firstName,
      lastName: _lastName,
      email: _email,
      phoneNumber: _phoneNumber,
      acceptsSMS,
    });

    try {
      setLoading(true);

      // IF provider id then no sign up ncecessary, just createDbUser
      if (providerid) {
        const createResults = await createDbUser({
          identityId,
          email: _email,
          firstName: _firstName,
          lastName: _lastName,
          phoneNumber: _phoneNumber,
          acceptsSMS,
          providerName: provider,
        });

        if (createResults) {
          setDbUserCreated(true);
          log.verbose('federated account created', {
            identityId,
            email: _email,
            firstName: _firstName,
            lastName: _lastName,
            phoneNumber: _phoneNumber,
            acceptsSMS,
            providerName: provider,
          });
          callback({ success: true });
          _trackCheckout({ from: 'social' });
          dispatchSignInEvent(true);
        } else {
          callback({
            success: false,
            error: {
              message:
                'We could not complete the creation of your account due to technical errors. Our support team has been informed. Please contact care@manime.co for more information.',
            },
          });
        }
      } else {
        const signUpResults = await signUp(
          _email,
          password,
          _firstName,
          _lastName,
          _phoneNumber,
          acceptsSMS
        );
        if (signUpResults.success) {
          trackFunnelActionProjectFunnel('[SignUp] success', {
            firstName: _firstName,
            lastName: _lastName,
            email: _email,
            phoneNumber: _phoneNumber,
            acceptsSMS,
          });
          _trackCheckout({ from: 'cognito' });
          callback(signUpResults);

          // dont set loading to false, loading will go away when the new screen loads.
        } else {
          trackFunnelActionProjectFunnel('[SignUp] error', {
            firstName: _firstName,
            lastName: _lastName,
            email: _email,
            phoneNumber: _phoneNumber,
            acceptsSMS,
            signUpResults,
          });
          callback(signUpResults);
          setIsValidating(false);
          setLoading(false);
        }
      }
    } catch (error) {
      log.error('[SignUp] could not sign up', {
        error,
        firstName: _firstName,
        lastName: _lastName,
        email: _email,
        phoneNumber: _phoneNumber,
        acceptsSMS,
      });
      setDbUserCreated(true);
      callback({
        success: false,
        errror: { message: 'Problems creating account. Please try again.' },
      });
      setLoading(false);
    }
  }

  return (
    <Fragment>
      <HalfBox>
        <ImgBox height="200px" pb={['80px', 0]}>
          <Box
            width="100%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            height="100%"
            px={4}
          >
            <div>
              <Box
                width={1}
                flex="1 0 auto"
                my="auto"
                fontFamily="sansSerif"
                letterSpacing="1px"
                fontSize={['18px', '35px']}
                fontWeight="500"
                maxWidth="400px"
                style={{ cursor: 'default' }}
              >
                <span>EXCITED TO GET TO KNOW YOU</span>
              </Box>
              <Box
                display="none"
                width={1}
                flex="1 0 auto"
                mt="50px"
                fontFamily="sansSerif"
                fontSize={4}
                fontWeight="350"
                style={{ cursor: 'default' }}
              >
                You'll be able to access <br />
                all ManiMe products.
              </Box>
            </div>
          </Box>
        </ImgBox>
      </HalfBox>
      <HalfBox p={['0 12px', 0]} mt={['-100px', 0]} position="relative" decoration>
        {_loading || isLoading ? (
          <Box p={[3, 5]} background="#F9F9F9">
            <LoadingAnimation
              isLoading={true}
              background={'#F9F9F9'}
              size={process.browser && checkMobile() ? 250 : 350}
            />
          </Box>
        ) : (
          <Box
            p={[3, 5]}
            background="#F9F9F9"
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
          >
            <BackBox
              onClick={ev => {
                ev.preventDefault();
                back();
              }}
            >
              <img src="/static/icons/back.svg" alt="back" />
              BACK
            </BackBox>
            <Box maxWidth={['100%', '420px']}>
              <div>
                {identityError && (
                  <Box display="flex" mt={4} mb={3} lineHeight={1.5} alignItems="center">
                    Oops! We didn't find an existing account matching your login with{' '}
                    {provider[0].toUpperCase() + provider.substring(1)}. You can either create an
                    account below or try signing in here with a different account
                  </Box>
                )}
                <Box display="flex" mt={4} mb={3} alignItems="center">
                  <Line />
                  <Box
                    display="flex"
                    justifyContent="center"
                    px={2}
                    my="8px"
                    fontFamily="avenirBook"
                    fontSize={4}
                    fontWeight="500"
                    letterSpacing="2px"
                    style={{ cursor: 'default' }}
                  >
                    Confirm your new account information
                  </Box>
                  <Line />
                </Box>
                <form autoComplete="on">
                  <Box
                    display="flex"
                    flexDirection={[
                      'column',
                      'column',
                      'column',
                      'column',
                      'colunn',
                      'column',
                      'row',
                    ]}
                  >
                    <Box mr={1} flex={1}>
                      <StandardInput
                        error={status && status.firstName}
                        errorText={status && status.firstName}
                        underlined
                        type="text"
                        name="name"
                        autoComplete="given-name"
                        placeholder="First Name *"
                        value={_firstName}
                        onChange={ev => setFirstName(ev.target.value)}
                      />
                    </Box>
                    <Box ml={1} flex={1}>
                      <StandardInput
                        error={status && status.lastName}
                        errorText={status && status.lastName}
                        underlined
                        type="text"
                        name="lastname"
                        autoComplete="family-name"
                        placeholder="Last Name *"
                        value={_lastName}
                        onChange={ev => setLastName(ev.target.value)}
                      />
                    </Box>
                  </Box>

                  <StandardInput
                    error={status && status.email}
                    errorText={status && status.email}
                    underlined
                    type="email"
                    name="email"
                    placeholder="Email Address *"
                    value={_email}
                    onChange={ev => {
                      const email =
                        typeof ev.target.value === 'string' ? ev.target.value.toLowerCase() : '';
                      const emailNoSpace = email.trim();
                      setEmail(emailNoSpace);
                    }}
                  />
                  {!provider && (
                    <StandardInput
                      error={status && status.password}
                      errorText={status && status.password}
                      underlined
                      placeholder="Password (minimum 6 characters) *"
                      name="newPassword"
                      autoComplete="new-password"
                      type="password"
                      value={password}
                      onChange={ev => setPassword(ev.target.value)}
                    />
                  )}
                  <Box
                    display="flex"
                    flexDirection={[
                      'column',
                      'column',
                      'column',
                      'column',
                      'colunn',
                      'column',
                      'row',
                    ]}
                  >
                    <Box mr={1} flex={1}>
                      <StandardInput
                        error={status && status.phoneNumber}
                        errorText={status && status.phoneNumber}
                        underlined
                        placeholder={`Phone Number ${true ? '*' : ''}`}
                        name="tel"
                        type="tel"
                        // autoComplete='tel-country-code'
                        value={_phoneNumber}
                        onChange={phoneNumberChangeHandler}
                      />
                    </Box>
                    <Box mr={1} flex={1}>
                      <Box mr={1} width={['50%']}>
                        <CheckBox
                          checked={acceptsSMS}
                          clickEvent={() => setAcceptsSMS(!acceptsSMS)}
                          label={checkBoxLabel}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Box color="forecolor.1" opacity={0.5} fontSize="14px" mt={2} mb="12px">
                    * required field
                  </Box>

                  <Box
                    display="flex"
                    width="100%"
                    flexDirection="column"
                    alignItems="center"
                    mt={'28px'}
                  >
                    <StyledStandardDarkButton
                      type="submit"
                      width="100%"
                      height="32px"
                      disabled={isValidating}
                      onClick={validateSignUp}
                    >
                      JOIN
                    </StyledStandardDarkButton>

                    <Box width={1} color="gray" my={2}>
                      By joining, you agree to receive marketing messages. You can unsubscribe at
                      any moment. Check our
                      <Link href={pageLinks.Terms.url}>
                        <A>Terms of Service</A>
                      </Link>
                      for more details.
                    </Box>
                    <Box width={1} color="gray" my={2}>
                      <GraySup>1</GraySup> By checking this box, you agree to receive recurring
                      automated promotional and personalized marketing text messages (e.g. cart
                      reminders) from ManiMe at the cell number used when signing up. Consent is not
                      a condition of any purchase. Reply HELP for help and STOP to cancel. Msg
                      frequency varies. Msg &amp; data rates may apply. View{' '}
                      <a href="http://attn.tv/manime/terms.html">Terms</a> &amp;{' '}
                      <a href="https://www.manime.co/privacy">Privacy</a>.
                    </Box>
                  </Box>
                </form>
              </div>
            </Box>
          </Box>
        )}
      </HalfBox>
    </Fragment>
  );
}
