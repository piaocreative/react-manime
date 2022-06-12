import { ApolloProvider } from '@apollo/client';
import { emitter, Experiment, experimentDebugger, Variant } from '@marvelapp/react-ab-test';
import * as Sentry from '@sentry/browser';
import { addSessionActionDDB, addSessionDDB } from 'api/util';
import Accounts from 'components/Accounts';
import ErrorBoundary from 'components/ErrorBoundary';
import GorgiasChatWidget from 'components/GorgiasChatWidget';
import ShopifyLifecycle from 'components/ShopifyLifecycle';
import config from 'config';
import withApolloClient from 'lib/apollo/with-apollo-client';
import { initStore } from 'lib/redux';
import withRedux from 'next-redux-wrapper';
import App from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import 'rc-slider/assets/index.css';
import React from 'react';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Provider } from 'react-redux';
import { createGlobalStyle } from 'styled-components';
import { experiments } from 'utils/abTest';
import { initGA, logPageView } from 'utils/analytics';
import { configureAmplify } from 'utils/aws';
import campaignParams from 'utils/lastTouchUTM';
import log from 'utils/logging';
import {} from 'utils/track';
import uuid from 'uuid';

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Avenir';
    src: url('/static/fonts/AvenirLTStd-Black.otf');
    src: url('/static/fonts/AvenirLTStd-Book.otf');
    src: url('/static/fonts/AvenirLTStd-Heavy.otf');
    src: url('/static/fonts/AvenirLTStd-Light.otf');
    src: url('/static/fonts/AvenirLTStd-Medium.otf');
    font-display: swap;
  }
  @font-face {
    font-family: 'Gentium';
    src: url('/static/fonts/GentiumBasic-Bold.ttf') ;
    src: url('/static/fonts/GentiumBasic-Italic.ttf');
    src: url('/static/fonts/GentiumBasic-Regular');
    font-display: swap;
  }
`;

Sentry.init({
  dsn: config.sentryDsn,
  environment: process.env.RELEASE_LABEL,
  release: process.env.RELEASE,
  beforeSend(event, hint) {
    const error = hint.originalException;
    if (
      error &&
      error.message &&
      (error.message.match(/find your IP/i) ||
        error.message.match(/evaluating/i) ||
        error.message.match(/currentStyle/i))
    ) {
      return null;
    }
    return event;
  },
});

class _App extends App {
  constructor(props) {
    super(props);
    this.state = {
      stripe: null,
      isMobileView: true,
      userIdentifier: 'server',
    };
    configureAmplify();
    process.env.IS_AUTH = 'startup';
  }

  handleResize = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 768) {
        if (this.state.isMobileView) {
          this.setState({ isMobileView: false });
        }
      } else if (window.innerWidth < 768) {
        if (!this.state.isMobileView) {
          this.setState({ isMobileView: true });
        }
      }
    }
  };

  async componentDidMount() {
    initGA();
    logPageView();

    Router.router.events.on('routeChangeComplete', logPageView);
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    this.handleResize();
    window.addEventListener('resize', this.handleResize);

    // this is throwing an error because variantNames is not initialized.
    // this.initGoogleOptimize();
    let userIdentifier = window.localStorage.getItem('userIdentifier');

    if (!userIdentifier) {
      // if session does not exist, create a session id, set it in storage, and then check referral id
      userIdentifier = uuid.v1();
      window.localStorage.setItem('userIdentifier', userIdentifier);
    }

    this.setState({ userIdentifier });

    emitter.defineVariants(
      experiments.fittingGalleryFlow.experimentName,
      experiments.fittingGalleryFlow.variantNames
    );

    emitter.setActiveVariant(
      experiments.fittingGalleryFlow.experimentName,
      experiments.fittingGalleryFlow.variantNames[1]
    );

    emitter.defineVariants(
      experiments.landingFlow.experimentName,
      experiments.landingFlow.variantNames
    );

    emitter.defineVariants(
      experiments.fitting.experimentName,
      experiments.fitting.variantNames,
      experiments.fitting.variantWeights
    );

    emitter.defineVariants(
      experiments.checkoutFlow.experimentName,
      experiments.checkoutFlow.variantNames,
      experiments.checkoutFlow.variantWeights
    );

    this.addEmitterListener();
    experimentDebugger.setDebuggerAvailable(process.env.SHOW_EXPERIMENT_DEBUG_PANEL === 'true');
    experimentDebugger.enable();

    const sessionId = window.localStorage.getItem('sessionId');
    let referralId = window.localStorage.getItem('referralId');
    let updatedReferralId = false;
    if (!referralId && this.props.pageProps.id != '') {
      // if referral id is null and the prop is a valid referral, update it in storage
      referralId = this.props.pageProps.id;
      window.localStorage.setItem('referralId', referralId);
      updatedReferralId = true;
    }
    if (!sessionId) {
      // if session does not exist, create a session id, set it in storage, and then check referral id
      const sessionId = uuid.v1();
      window.localStorage.setItem('sessionId', sessionId);
      addSessionDDB(sessionId, referralId);
    } else {
      // if session does exist and the referral link changed update it in DDB
      if (updatedReferralId) {
        addSessionActionDDB(sessionId, 'referralId', referralId);
      }
    }

    campaignParams();
  }

  initGoogleOptimize = async () => {
    if (window['dataLayer']) {
      await window['dataLayer'].push({ event: 'optimize.activate' });
    }
    this.intervalId = setInterval(() => {
      if (window.google_optimize !== undefined) {
        const variant = window.google_optimize.get('RNDaZ_kmRBG_ipI6DOHlOA');

        try {
          const validIndex =
            variant && parseInt(variant) != NaN && parseInt(variant) < variantNames?.length
              ? true
              : false;
          const i = validIndex ? parseInt(variant) : 0;
        } catch (err) {
          '[_app] google optimize ' + err, { err };
        }

        clearInterval(this.intervalId);
      }
    }, 100);
  };

  addEmitterListener = () => {};

  render() {
    log.verbose(`rendering path: ${this.props.pathname}`);
    const { Component, pageProps, pathname, store, apolloClient } = this.props;

    const { isMobileView, userIdentifier } = this.state;
    const isDevMode = process.env.NODE_ENV !== 'production';

    const renderBody = (
      <ApolloProvider client={apolloClient}>
        <Provider store={store}>
          <GlobalStyle />
          <ShopifyLifecycle />
          {/*
              This component sends every single redux state change to mixpanel. Might be overkill
              <TrackReducerChanges />
              */}
          <Accounts />
          {
            <>
              <Experiment name={experiments.fittingGalleryFlow.experimentName}>
                <Variant name={experiments.fittingGalleryFlow.variantNames[0]} />
                <Variant name={experiments.fittingGalleryFlow.variantNames[1]} />
              </Experiment>
              <Experiment
                name={experiments.landingFlow.experimentName}
                userIdentifier={userIdentifier}
              >
                <Variant name={experiments.landingFlow.variantNames[0]} />
                <Variant name={experiments.landingFlow.variantNames[1]} />
              </Experiment>

              <Experiment
                name={experiments.maniFittingFlow.experimentName}
                userIdentifier={`${userIdentifier}${experiments.maniFittingFlow.iteration}`}
              >
                <Variant name={experiments.maniFittingFlow.variantNames[0]} />
                <Variant name={experiments.maniFittingFlow.variantNames[1]} />
              </Experiment>
              <Experiment
                name={experiments.fitting.experimentName}
                userIdentifier={`${userIdentifier}${experiments.fitting.iteration}`}
              >
                <Variant name={experiments.fitting.variantNames[0]} />
                <Variant name={experiments.fitting.variantNames[1]} />
              </Experiment>

              <Experiment
                name={experiments.checkoutFlow.experimentName}
                userIdentifier={`${userIdentifier}${experiments.checkoutFlow.iteration}`}
              >
                <Variant name={experiments.checkoutFlow.variantNames[0]} />
                <Variant name={experiments.checkoutFlow.variantNames[1]} />
              </Experiment>
            </>
          }

          <Component {...pageProps} userIdentifier={userIdentifier} isMobileView={isMobileView} />
        </Provider>
      </ApolloProvider>
    );

    const body = isDevMode ? renderBody : <ErrorBoundary>{renderBody}</ErrorBoundary>;
    return (
      <>
        <Head>
          <title>ManiMe</title>
          <meta
            name="og:image"
            content="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/manime.jpg"
          />
          <meta
            name="twitter:image"
            content="https://cdn.shopify.com/s/files/1/0253/6561/0605/files/manime.jpg"
          />
          <meta
            name="description"
            content="3D modeled, stick-on gel manicures. Custom fit and ready to apply anytime, anywhere."
          />
          <meta name="p:domain_verify" content="bb77c13e7586c71b91d3529a094fcbcd" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        {body}
        <GorgiasChatWidget />
      </>
    );
  }
}

export default withApolloClient(withRedux(initStore)(_App));
