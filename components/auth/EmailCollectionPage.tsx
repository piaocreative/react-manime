import React, { Fragment, useState } from 'react';
import Link from 'next/link';
import log from 'utils/logging';
import { validateEmail } from 'utils/validation';
import { getProvidersByEmail } from 'api/user';
import { track, trackFunnelActionProjectFunnel } from 'utils/track';
import checkMobile from 'utils/checkMobile';

// Utils
import { pageLinks } from 'utils/links';

// Components
import Box from '../styled/Box';
import {
  StandardInputField as StandardInput,
  Img,
  StyledStandardDarkButton,
} from '../styled/StyledComponents';
import StandardButton, { PaymentLoadingButton } from '../styled/StandardButton';
import { A, HalfBox, ImgBox, Line } from './styled';

type EmailCollectionProps = {
  callback: Function;
};
function EmailCollectionPage({ callback }: EmailCollectionProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<any>();

  async function handleFederatedSignIn(provider) {
    track('[Auth][EmailCollection] user action', { action: 'federated', provider });
    callback({ federated: true, providers: [provider] });
  }

  async function activateAuthFunnel(email) {
    // NOTE: first email collection form activation event, for new users only with 1 account per email
    if (checkMobile()) {
      return;
    }

    if (window['dataLayer']) {
      window['dataLayer'].push({ event: 'authFlow.activate' });
    }
  }

  async function onEmailSubmit(ev) {
    ev.preventDefault();

    if (!email) {
      setStatus({ email: 'Please enter your email' });
      return;
    } else if (!validateEmail(email)) {
      setStatus({ email: 'Invalid email' });
      return;
    }
    let providers = [];
    let identities = [];
    try {
      activateAuthFunnel(email);
      track('[Auth][EmailCollection] user action', { action: 'email', email });

      const results = await getProvidersByEmail(email);

      const providers = [];
      results?.forEach(provider => {
        log.verbose('looking up provider for email', { email, provider });
        if (provider === 'facebook') {
          providers.push('Facebook');
          identities.push('facebook');
        } else if (provider === 'google') {
          providers.push('Google');
          identities.push('google');
        } else if (provider === 'cognito') {
          providers.push('Cognito');
          identities.push('cognito');
        }
      });

      callback({ email, providers, identities });
    } catch (err) {
      log.error('issue logging in ' + err, err);
    }
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
              Let's get started
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
          <Img src="/static/icons/manime-logo.svg" mr={3} height={'40px'} mb={'20px'} />
          <Box maxWidth={['100%', '420px']}>
            <Box
              mt="12px"
              mb="16px"
              display="flex"
              flexDirection="row"
              width="100%"
              justifyContent="space-evenly"
              alignItems="center"
            >
              <Line />
              <Box
                fontWeight="500"
                textAlign="center"
                fontSize={4}
                fontFamily="avenirBook"
                letterSpacing="2px"
                style={{ cursor: 'default' }}
                mx={2}
              >
                <span>Start with your email</span>
              </Box>
              <Line />
            </Box>
            <Box flex="1 0 auto" flexDirection="column">
              <form>
                <StandardInput
                  error={status}
                  errorText={(status || {}).email}
                  underlined
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={email || ''}
                  onChange={ev => {
                    const email =
                      typeof ev.target.value == 'string' ? ev.target.value.toLowerCase() : '';
                    const emailNoSpace = email.trim();
                    setEmail(emailNoSpace);
                  }}
                />

                <StyledStandardDarkButton
                  width="100%"
                  height="40px"
                  onClick={onEmailSubmit}
                  style={{ textTransform: 'uppercase' }}
                >
                  Continue
                </StyledStandardDarkButton>
              </form>
            </Box>
            <Box textAlign="center" width={'100%'} my={3} fontSize={'12px'} color="gray">
              By joining ManiMe, you agree to the
              <Link href={pageLinks.Privacy.url}>
                <A style={{ color: 'gray', textDecoration: 'underline' }}>Privacy Policy</A>
              </Link>{' '}
              and
              <Link href={pageLinks.Terms.url}>
                <A style={{ color: 'gray', textDecoration: 'underline' }}>Terms of Use</A>
              </Link>
            </Box>

            {/* <Box
              display="flex"
              flexDirection="row"
              width="100%"
              justifyContent="center"
              alignItems="center"
              my={'25px'}
            >
              <Line />
              <Box
                fontWeight="500"
                fontSize={4}
                fontFamily="avenirBook"
                letterSpacing="2px"
                style={{ cursor: 'default' }}
                mx={2}
              >
                <span>or join with social</span>
              </Box>
              <Line />
            </Box>
            <Box textAlign="center" width={'100%'} my={3} fontSize={'12px'} color="gray">
              We are currently having issues with Facebook and Google login.
              <br />
              We apologize for the inconvenience.
              <br />
              <br />
              Please contact
              <Link href="mailto:care@manime.co">
                <A style={{ color: 'gray', textDecoration: 'underline' }}>the Care Team</A>
              </Link>
              <br />
              or use the help button below here on the site for assistance.
            </Box> */}
            {/* <StandardButton
              type="button"
              width="100%"
              height="40px"
              color="forecolor.0"
              fontSize="14px"
              letterSpacing="1px"
              backgroundColor="#fff"
              backgroundHoverColor="#fff"
              replace="false"
              my={'15px'}
              style={{ textTransform: 'uppercase', border: '1px solid black' }}
              onClick={() => handleFederatedSignIn('Google')}
            >
              <Img src="/static/icons/google-logo.svg" mr={3} /> Continue with
              Google
            </StandardButton>

            <StandardButton
              type="button"
              width="100%"
              height="40px"
              color="forecolor.0"
              fontSize="14px"
              backgroundColor="#fff"
              backgroundHoverColor="#fff"
              letterSpacing="1px"
              my={'15px'}
              replace="false"
              style={{ textTransform: 'uppercase', border: '1px solid black' }}
              onClick={() => handleFederatedSignIn('Facebook')}
            >
              <Img src="/static/icons/facebook-logo.svg" mr={3} /> Continue with
              Facebook
            </StandardButton> */}
          </Box>
        </Box>
      </HalfBox>
    </Fragment>
  );
}

export default EmailCollectionPage;
