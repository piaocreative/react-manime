import EmailCollectionPage from 'components/auth/EmailCollectionPage';
import Error from 'components/auth/Error';
import Federated from 'components/auth/Federated';
import ForgotPassword from 'components/auth/ForgotPasswordFlow';
import Login from 'components/auth/LogIn';
import LoginByLink from 'components/auth/LoginByLink';
import SignOut from 'components/auth/SignOut';
import SignUp from 'components/auth/SignUp';
import { Container, PageBox } from 'components/auth/styled';
import { getGlobalProps, ManimeStandardContainer } from 'components/core/hoc/PageWrapper';
import Box from 'components/styled/Box';
import { Case, Switch } from 'components/switch';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { startFederatedSignIn } from 'utils/authUtils';
import { pageLinks } from 'utils/links';
import log from 'utils/logging';
import { scrollToTop } from 'utils/scroll';
import { track } from 'utils/track';

const Steps = {
  BLANK: 'blank',
  EMAIL: 'email',
  LOGIN: 'login',
  SIGNUP: 'signup',
  SIGNOUT: 'sign_out',
  CONFIRMATION: 'confirmation',
  OAUTH_REDIRECT: 'oauth_redirect',
  OAUTH: 'oauth',
  ERROR: 'error',
  FORGOT: 'forgot',
  LINK: 'link',
};

type AuthpageState = {
  providers: string[];
  identities?: string[];
  email?: string;
  step?: string;
  error?: string;
};
function AuthPage(props) {
  const userData = useSelector((state: any) => state.userData);
  const [hasMounted, setHasMounted] = useState(false);
  const [state, setState] = useState<AuthpageState>({ providers: [] });
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(
    (process.browser && (router.query.currentPage as string)) || '/'
  );
  const match = process.browser ? router.asPath.match(/step=(?<paramStep>\w+)&?/) : undefined;
  const paramStep = match?.groups?.paramStep;

  function forgotEmailCallback(input) {
    if (input.success) {
      _track(`[forogtEmailCallback] forgot email flow successful, forwarding to EMAIL for sign in`);
      setState({ ...state, step: Steps.EMAIL });
    } else {
      _track(`[forogtEmailCallback] Problems resetting password`, input);
      const error =
        input?.error?.message ||
        'Problems resetting password, please reach out to care@manime.co to complete your request';
      setState({ ...state, error });
    }
  }
  function emailCallback({ email, providers, federated, identities }) {
    log.verbose('input is', { email, providers });

    if (federated) {
      if (providers && providers.length > 0) {
        _track(`[emailCallback] response from email capture, user chose to federate`, {
          email,
          providers,
          federated,
          identities,
        });
        startFederatedSignIn(providers[0], currentPage);
      }
    } else if (providers?.length === 0) {
      _track(`[emailCallback] response from email capture, email not found so sign up`, {
        email,
        providers,
        federated,
        identities,
      });
      setState({
        email,
        providers,
        step: Steps.SIGNUP,
      });
    } else if (providers) {
      _track(`[emailCallback] response from email capture, email found so log in`, {
        email,
        providers,
        federated,
        identities,
      });
      setState({
        email,
        providers,
        identities,
        step: Steps.LOGIN,
      });
    }
  }

  function signOutCallback(input) {
    if (input.success) {
      _track(`[signoutCallback] successful signout`);
      setState({ ...state, step: Steps.EMAIL });
    } else {
      _track(`[signoutCallback] failed sign out `, input);
    }
  }

  function linkLoginCallback(input) {
    log.verbose('obsered linkLogin callback', input);
    if (input.error) {
      _track(`[complete] error`, { method: 'link', state, error: input.error });
      setState({
        ...state,
        error: input.error?.message || 'Problems signing up, please try again.',
        step: Steps.ERROR,
      });
    } else if (input.signOut) {
      _track('[linkLiginCallback] link followed to transfer session required sign out', input);
      setState({ ...state, step: Steps.SIGNOUT });
    } else {
      _track(`[complete] success`, { method: 'link', goingTo: input });
    }
  }

  function signupCallback(input) {
    if (input.error) {
      _track(`[complete] error`, { method: 'signUp', state, error: input.error });
      log.error('problems signing up in ', { state, error: input.error });
      setState({
        ...state,
        error: input.error?.message || 'Problems signing up, please try again.',
        step: Steps.ERROR,
      });
    } else if (currentPage) {
      if (
        currentPage.includes('checkout') ||
        currentPage.includes('redeem') ||
        currentPage.includes('gift/group') ||
        currentPage.includes('subscription')
      ) {
        _track(`[complete] success`, { method: 'signUp', goingTo: currentPage });
        router.replace(currentPage);
      } else {
        _track(`[complete] success`, {
          method: 'signUp',
          goingTo: `${pageLinks.GuidedFitting.url}?returnUrl=${currentPage}`,
        });
        router.replace(`${pageLinks.GuidedFitting.url}?returnUrl=${currentPage}`);
      }
    } else {
      _track(`[complete] success`, { method: 'signUp', goingTo: pageLinks.GuidedFitting.url });
      router.replace(`${pageLinks.GuidedFitting.url}`);
    }
  }

  function federatedCallback(input) {
    if (input.error) {
      log.error('problems signing up in ', { state, error: input.error });
      setState({
        ...state,
        error: input.error?.message || 'Problems with federated sign in please try again.',
        step: Steps.ERROR,
      });
      _track(`[complete] error`, { method: 'federated', state, error: input.error });
    } else {
      if (input.type === 'signup') {
        if (input.currentPage) {
          _track(`[complete] success`, { method: 'federated', goingTo: input.currentPage });
          router.replace(`${pageLinks.GuidedFitting.url}?returnUrl=${input.currentPage}`);
        } else {
          _track(`[complete] success`, {
            method: 'federated',
            goingTo: pageLinks.GuidedFitting.url,
            input,
          });
          router.replace(`${pageLinks.GuidedFitting.url}`);
        }
      } else {
        if (input.currentPage) {
          router.replace(input.currentPage);
        } else if (currentPage) {
          router.replace(currentPage);
        } else {
          router.replace('/');
        }
      }
    }
  }

  function loginCallback({ error, federate, forgotPassword, identity }) {
    if (error) {
      _track(`[complete] error`, { error, federate, forgotPassword, identity });
      log.error('problems logging in ', { state, error: error });
      setState({
        ...state,
        error:
          error?.message ||
          `Problems with federated [sign in](${process.env.APP_URL}${pageLinks.Auth.url}) please try again.`,
        step: Steps.ERROR,
      });
    } else if (federate) {
      _track(`[loginCallback] email tied to a federated account, so starting that flow`, {
        error,
        federate,
        forgotPassword,
        identity,
      });
      startFederatedSignIn(federate, currentPage, identity);
    } else if (forgotPassword) {
      _track(`[loginCallback] user chose forgot password option`, {
        error,
        federate,
        forgotPassword,
        identity,
      });
      setState({ ...state, step: Steps.FORGOT });
    } else {
      _track(`[complete] success`, { method: 'login', goingTo: currentPage });
      router.replace(currentPage);
    }
  }

  async function mount() {
    const tempPath = router.asPath + '&';
    const match = tempPath.match(/currentPage=(?<currentPage>[\S]+?)[&#]/);
    let _currentPage = match?.groups?.currentPage;

    if (_currentPage) {
      try {
        _currentPage = decodeURIComponent(_currentPage);
      } catch (err) {
        _currentPage = undefined;
      }
    }

    _track(`[mount] initial load for auth flow `);
    setCurrentPage(_currentPage || '/');
    let _step = undefined;
    if (!state.step) {
      _step = paramStep;

      if ([Steps.OAUTH_REDIRECT, Steps.SIGNOUT, Steps.LINK].includes(paramStep)) {
        _track(`[mount][${paramStep}] is a valid start state`);
        setState({ ...state, step: paramStep });
      } else {
        _track(`[mount][${paramStep}] not a valid start state, default to EMAIL step `);
        setState({ ...state, step: Steps.EMAIL });
        _step = Steps.EMAIL;
      }

      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, step: _step },
        },
        {
          pathname: router.pathname,
          query: { ...router.query, step: _step },
        },
        { shallow: true }
      );
    }

    setHasMounted(true);
  }

  useEffect(() => {
    mount();
  }, []);

  function _track(message, callbackInput = undefined) {
    track(`[Auth]${message}`, { currentPage, userData, state, ...callbackInput });
  }

  // changing step will trigger a route forward to the step
  useEffect(() => {
    if (!hasMounted) {
      return;
    }

    if ([Steps.OAUTH_REDIRECT, Steps.SIGNOUT, Steps.LINK, Steps.EMAIL].includes(state.step)) {
      _track(
        `[stateStepChange][initial][${state.step}] state step is valid initial step so no change  `
      );
      return;
    }

    _track(
      `[stateStepChange] state step needs to be forwarded to the corresponding url for this step ${state.step}`
    );
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, step: state.step },
      },
      {
        pathname: router.pathname,
        query: { ...router.query, step: state.step },
      },
      { shallow: true }
    );
  }, [state.step]);

  useEffect(() => {
    if (!hasMounted) {
      return;
    }

    // if they match then great
    if (paramStep === state.step) {
      _track(
        `[paramStepChange][render][${paramStep}] url and state step match, can render this step `
      );
      scrollToTop();
      return;
    }

    // if they don't match then it's possible it's from a back navigation .. ensure the param step is
    // is allowed from the current step
    switch (state.step) {
      case Steps.EMAIL:
        _track(
          `[paramStepChange][navigation][${paramStep}][${state.step}] change by browser navigation `
        );
        if ([Steps.LOGIN, Steps.SIGNUP].includes(paramStep)) {
          setState({ ...state, step: paramStep });
        }
        break;
      case Steps.LOGIN:
        _track(
          `[paramStepChange][navigation][${paramStep}][${state.step}] change by browser navigation `
        );
        if ([Steps.EMAIL, Steps.ERROR, Steps.FORGOT].includes(paramStep)) {
          setState({ ...state, step: paramStep });
        }
        break;
      case Steps.SIGNUP:
        _track(
          `[paramStepChange][navigation][${paramStep}][${state.step}] change by browser navigation `
        );
        if ([Steps.EMAIL, Steps.ERROR].includes(paramStep)) {
          setState({ ...state, step: paramStep });
        }
        break;
      default:
        _track(
          `[paramStepChange][error][${paramStep}][${state.step}] step changed out of sequence, sending to EMAIL `
        );
        setState({ ...state, step: Steps.EMAIL });
    }
  }, [paramStep]);

  log.info(`[auth.tsx][render][${paramStep}][${state.step}]`, state, true);

  return (
    <Container display="block" width="100%">
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <PageBox width={['100%']} display="flex">
          {hasMounted ? (
            <Switch active={state.step}>
              <Case name={Steps.EMAIL}>
                <EmailCollectionPage callback={emailCallback} />
              </Case>
              <Case name={Steps.LOGIN}>
                <Login
                  back={() => router.back()}
                  email={state.email}
                  providers={state.providers}
                  callback={loginCallback}
                  identities={state.identities}
                />
              </Case>
              <Case name={Steps.SIGNUP}>
                <SignUp back={() => router.back()} email={state.email} callback={signupCallback} />
              </Case>
              <Case name={Steps.OAUTH_REDIRECT}>
                <Federated
                  back={() => router.back()}
                  track={_track}
                  callback={federatedCallback}
                  isLoading={true}
                />
              </Case>
              <Case name={Steps.ERROR}>
                <Error error={state.error} back={() => router.back()}></Error>
              </Case>
              <Case name={Steps.SIGNOUT}>
                <SignOut callback={signOutCallback} />
              </Case>
              <Case name={Steps.FORGOT}>
                <ForgotPassword email={state.email} onChangeEmail={forgotEmailCallback} />
              </Case>
              <Case name={Steps.LINK}>
                <LoginByLink callback={linkLoginCallback} />
              </Case>
              <Case name={Steps.BLANK}>
                <></>
              </Case>
            </Switch>
          ) : (
            <> </>
          )}
        </PageBox>
      </Box>
    </Container>
  );
}

export default ManimeStandardContainer(AuthPage);
export const getStaticProps = async ({ res, req }) => await getGlobalProps();
