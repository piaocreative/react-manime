import Link from 'next/link';
import React, { Fragment, useState } from 'react';
import { signIn } from 'utils/authUtils';
import { pageLinks } from 'utils/links';
import log from 'utils/logging';
import { trackFunnelActionProjectFunnel } from 'utils/track';
import Box from '../styled/Box';
import {
  StandardInputField as StandardInput,
  StyledStandardDarkButton,
} from '../styled/StyledComponents';
import { A, BackBox, HalfBox, ImgBox } from './styled';

type LoginProps = {
  email: string;
  providers: string[];
  identities?: string[];
  callback: Function;
  back: Function;
};

export default function LoginPage({ email, providers, identities, callback, back }: LoginProps) {
  const [password, setPassword] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>();

  function onFederatedButtonClick(provider, identity) {
    callback({ federate: provider, identity });
  }

  async function validateSignIn(ev) {
    ev.preventDefault();
    trackFunnelActionProjectFunnel('A. Start Sign In');

    let statusObj = {};
    if (!password) statusObj = 'Password required';
    setStatus(statusObj);

    if (!email || !password) return;

    setLoading(true);
    // Sign in, get credentials to get identityid, then retrieve data from database and dispatch to redux

    const result = await signIn(email, password);

    if (result.error) {
      log.verbose('error is', { signinError: result.error });
      setStatus(result.error.message ? result.error.message : 'Invalid email or password.');
      setLoading(false);
    } else {
      callback(result);
    }
  }

  const socialLogins = [];
  providers.forEach((provider, index) => {
    if (provider !== 'Cognito') {
      socialLogins.push(
        <Box textAlign="center" width={'100%'} my={3} fontSize={'14px'} color="gray">
          <strong>You'll need to setup a new password</strong>
          <br />
          We've recently removed the options to sign in using Google or Facebook.
          <br />
          An email has been sent to {email} so you can setup a new password.
          <br />
          Have questions or trouble setting up a new password? Click to chat with us or text us at
          (213) 340 - 0364
          <Link href={pageLinks.ForgotPassword.url}>
            <A style={{ color: 'gray', textDecoration: 'underline' }}>password reset page</A>
          </Link>
        </Box>
        // <StandardButton
        //   type="button"
        //   width="100%"
        //   height="40px"
        //   color="forecolor.0"
        //   fontSize="14px"
        //   letterSpacing="1px"
        //   backgroundColor="#fff"
        //   backgroundHoverColor="#fff"
        //   replace="false"
        //   my={'15px'}
        //   style={{ textTransform: 'uppercase', border: '1px solid black' }}
        //   onClick={() => onFederatedButtonClick(provider, identities[index])}
        // >
        //   <Img
        //     src={`/static/icons/${provider.toLocaleLowerCase()}-logo.svg`}
        //     mr={3}
        //   />{' '}
        //   {`Continue with ${provider}`}
        // </StandardButton>
      );
    }
  });

  if (socialLogins.length > 0) {
    socialLogins.unshift(
      <Box
        mt={4}
        px={2}
        fontFamily="avenirBook"
        fontSize={4}
        fontWeight="500"
        letterSpacing="2px"
        style={{ cursor: 'default' }}
      >
        Sign in to your account under the email <span style={{ fontStyle: 'italic' }}>{email}</span>{' '}
        using:
      </Box>
    );
  }

  return (
    <Fragment>
      <HalfBox m="0" p="0">
        <ImgBox height="200px" pb={['80px', 0]}>
          <Box
            position="relative"
            width="100%"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            height="100%"
            px={4}
          >
            <Box
              width={1}
              // flex='1 0 auto'
              my="auto"
              fontFamily="sansSerif"
              letterSpacing="2px"
              fontSize={['18px', '35px']}
              fontWeight="500"
              px={'20px'}
              style={{ cursor: 'default', textTransform: 'uppercase' }}
            >
              Good to see you back
            </Box>
          </Box>
        </ImgBox>
      </HalfBox>
      <HalfBox mt={['-100px', 0]} position="relative" decoration>
        <Box
          p={[3, 5]}
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'flex-start'}
          mx={['10px']}
          background="#F9F9F9"
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
            <div style={{ visibility: 'hidden' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua.
            </div>
            {socialLogins}
            {providers.includes('Cognito') && (
              <form>
                <StandardInput
                  underlined
                  type="email"
                  name="email"
                  error={false}
                  errorText={''}
                  readonly={true}
                  placeholder="Email Address"
                  value={email}
                  width="100%"
                />
                <StandardInput
                  underlined
                  placeholder="Password"
                  type="password"
                  name="password"
                  error={false}
                  errorText={''}
                  autoComplete="password"
                  value={password}
                  onChange={ev => setPassword(ev.target.value)}
                  width="100%"
                />
                <Box fontSize={3} color="forecolor.6" minHeight="24px">
                  {typeof status === 'string' && status}
                </Box>
                <StyledStandardDarkButton
                  width="100%"
                  height="40px"
                  onClick={validateSignIn}
                  style={{ textTransform: 'uppercase' }}
                >
                  Log In
                </StyledStandardDarkButton>
                <Link as={pageLinks.ForgotPassword.url} href={pageLinks.ForgotPassword.url}>
                  <Box
                    mt={3}
                    color="#616161"
                    fontSize={3}
                    fontWeight="400"
                    style={{
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                  >
                    Forgot Password?
                  </Box>
                </Link>
              </form>
            )}
          </Box>
        </Box>
      </HalfBox>
    </Fragment>
  );
}

/*{loading ? (
              <LoadingAnimation
                isLoading={true}
                background={'#F9F9F9'}
                size={checkMobile() ? 250 : 350}
              />
            ) : (
              <>

                <Box flex="1 0 auto" flexDirection="column" pt={'40px'}>
                  {socialLogins}

                  
                </Box>
              </>
            )}

            */
