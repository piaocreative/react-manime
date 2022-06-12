import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Router from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import dynamic from 'next/dynamic';


import Box from 'components/styled/Box';
import { DarkButton, OutlinedDarkButton } from 'components/basic/buttons';
import { pageLinks } from 'utils/links';

import style from '@styles/fitting/mani/mobile/success.module.css';
import {  trackFunnelActionProjectFunnel } from 'utils/track';
import { scrollToTop } from 'utils/scroll';
import { clearImageStatuses } from 'utils/localStorageHelpers';
import { updateUserColumn } from 'api/user';
import { experiments } from 'utils/abTest';
import { checkManiBag } from 'utils/cartUtils';
import profileData   from 'reducers/profileData' ;

const Lottie = dynamic(()=>import('react-lottie')) as any;

const fittingDoneImageSrc = 'static/images/fitting/fitting-done.jpg';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: require('static/anim_fit_final.json'),
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid'
  }
};

declare var hj

type Props ={
  userData : any,
  availableSteps,
  uiData;
  mainCartData: any;
}
type State ={
  
}

class MobileSuccess extends Component <Props, State> {
  componentDidMount() {
    // FIXME: only call when hasPics is false
    // OPTIMIZE:
    updateUserColumn(
      this.props.userData.identityId,
      'hasPics',
      true
    );

    let _learnq = window['_learnq']|| [];
    _learnq.push(['identify', {
      'hasPics': true,
    }]);

    /**
     * hotjar trigger after fitting end session
     */
    hj('trigger', 'fitting_end_section');


    if (this.checkMobile()) trackFunnelActionProjectFunnel('Fit Flow Complete - Mobile');
    else trackFunnelActionProjectFunnel('Fit Flow Complete - Desktop');

    if (window['dataLayer']) {
      window['dataLayer'].push({ event: 'fittingDone' });
    }

    this.checkVersionTwoUploaded();
    clearImageStatuses(this.props.userData.identityId);
    updateUserColumn(this.props.userData.identityId, 'fitted', true);
    trackFunnelActionProjectFunnel('A. Fit Flow Completed');

  }

  checkVersionTwoUploaded = () => {
    const availableSteps = this.props.availableSteps ? this.props.availableSteps : [];
    const {
      versionLeftFingers,
      versionLeftThumb,
      versionRightFingers,
      versionRightThumb,
      versionSide
    } = this.props.userData;
    const associatedVersions = [versionLeftFingers, versionLeftThumb, versionRightFingers, versionRightThumb, versionSide];

    // check available steps and associated version, if any is 2 or greater, send versionReport
    availableSteps.some(stepIndex => {
      if (associatedVersions[stepIndex] > 1) {
        axios({
          method: 'post',
          url: 'https://694hiefnxj.execute-api.us-west-1.amazonaws.com/versionReport',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            body: {
              userEmail: `${this.props.userData.email}`,
              versionNumbers: associatedVersions
            }
          }
        })
        return true;
      }
    });
  }

  navToGalleryPage = () => {
    scrollToTop();
    const flowName = this.props.uiData.flowName;

      Router.push({
        pathname:pageLinks.SetupDesign.url,
        // query: {action: 'cartOpen'}
      });
  };

  checkHasPedis = () => {
    const { hasPedis } = checkManiBag(this?.props?.mainCartData?.cart);

    return hasPedis;
  };

  checkPedisValidation = () => {
    const pData: any = profileData;
    const pedisProfile = (pData.profiles || []).find(profile => profile.profileType === 'Pedis');
    if (pedisProfile) {
      const {
        statusLeftFingers,
        statusLeftThumb,
        statusRightFingers,
        statusRightThumb,
        statusSide
      } = (pedisProfile || {});
      return statusLeftFingers && statusLeftThumb && statusRightFingers && statusRightThumb && statusSide;
    }
    return false;
  };

  navToCheckout = () => {
    const {
      fittingGalleryFlow: {
        experimentName,
        variantNames
      }
    } = experiments;

    Router.push(pageLinks.Checkout.url)
  };

  navToPediFit = () => {
    Router.push({
      pathname: pageLinks.PediFitting.url,
      query: Router.router.query
    });
  };

  checkMobile = () => {
    if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) return true;
    return false;
  };

  skipHandler = () => {
    // this.navToCheckout();
    if (Router.router.query.returnUrl) {
      Router.push(Router.router.query.returnUrl as string);
    } else if (Router.router.query.transitionTrigger === 'checkout') {
      Router.push(pageLinks.Checkout.url)
    } else {
      Router.push(pageLinks.SetupDesign.url);
    }
  };

  render () {

    const {
      fittingGalleryFlow: {
        experimentName,
        variantNames
      }
    } = experiments;
    const flowName = (((this || {}).props || {}).uiData || {}).flowName || '';
    if (flowName == 'events')
      return (
        <div className={style.root}>
          <div className={style.container}>
            <div className={style.title}>Thank You!</div>
            <div className={style.description}>
              Your 3D-model is now being rendered. Be ready for a manicure experience unlike any other.
            </div>
            <img
              className={style.fittingSuccessLogo}
              src={fittingDoneImageSrc}
              alt='fitting-success' />
          </div>
          <Link href='https://www.instagram.com/manime.co/?hl=en'>
            <a>
              <Box display='flex' flexDirection='row' alignItems='center' mt={4}>
                <img src='https://en.instagram-brand.com/wp-content/themes/ig-branding/prj-ig-branding/assets/images/ig-logo-black.svg' />
                <span style={{ marginLeft: 8, fontWeight: 700 }}>@manime.co</span>
              </Box>
            </a>
          </Link>

        </div>
      );
    else {
      const hasPedis = this.checkHasPedis();
      const isValidPedis = this.checkPedisValidation();
      const buttonLabel = (hasPedis && !isValidPedis) ? 'NEXT': 'CHECKOUT';
      // const pageTitle = (hasPedis && !isValidPedis) ? 'GO PEDIS TRANSITION PAGE': 'YOU DID IT!';
      return (
        <div className={style.root}>
          <div className={style.container}>

            <div className={style.title}>YAY! YOU DID IT!</div>
            <div className={style.fittingSuccessLogo}>
              <Lottie
                options={defaultOptions} />
            </div>

            <div className={style.question}>
              Ready for your pedi scan?
            </div>

            <DarkButton
              passedClass={style.actionButton}
              onClick={this.navToPediFit}>
                LET'S DO IT
            </DarkButton>


            <OutlinedDarkButton
              passedClass={classNames(style.skipLabel, style.actionButton)}
              onClick={this.skipHandler}>
              SKIP FOR NOW 
              <img
                className={style.skipButton}
                src='/static/icons/arrow-down.svg'
              />
            </OutlinedDarkButton>



          </div>
        </div>
      );
    }

  }
}

const mapStateToProps = state => ({
  userData: state.userData,
  profileData: state.profileData,
  uiData: state.uiData,
  mainCartData: state.mainCartData
})

export default connect(mapStateToProps, null)(MobileSuccess);
