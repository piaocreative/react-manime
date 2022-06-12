import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import Link from 'next/link';
import axios from 'axios';

import Box from '../../../styled/Box';
import { DarkButton } from '../../../basic/buttons';
import { pageLinks } from 'utils/links';

import style from 'static/components/fitting/pedi/mobile/success-v3.module.css';
import { trackFunnelActionProjectFunnel } from 'utils/track';
import { scrollToTop } from 'utils/scroll';
import { clearImageStatuses } from 'utils/localStorageHelpers';
import { updateUserColumn } from 'api/user';
import { experiments } from 'utils/abTest';


const fittingDoneImageSrc = 'static/images/fitting/fitting-done.jpg';
const videoSrc = 'https://d1b527uqd0dzcu.cloudfront.net/web/videos/pedi-scan-success.mp4';


type Props ={
  userData : any,
  availableSteps,
  uiData;
  mainCartData: any;
}
type State ={
  
}
declare var hj

class MobileSuccess extends Component <Props, State> {
  componentDidMount() {
    // FIXME: only call when hasPics is false
    // OPTIMIZE:
    updateUserColumn(
      this.props.userData.identityId,
      'hasPics',
      true
    );

    let _learnq = window['_learnq'] || [];
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
    // trackFunnelAction('A. Fit Flow Completed');
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
  }

  navToRedeem = () => {
    Router.push({
      pathname: pageLinks.GroupGiftRedeemShipping.url,
      query: Router.router.query
    })
  }

  navToCheckout = () => {
    const {
      fittingGalleryFlow: {
        experimentName,
        variantNames
      }
    } = experiments;

    Router.push(pageLinks.Checkout.url)
  }

  checkMobile = () => {
    if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) return true;
    return false;
  }

  render () {
    const {
      fittingGalleryFlow: {
        experimentName,
        variantNames
      }
    } = experiments;


    const transitionTrigger = Router.router.query?.transitionTrigger;

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
    else
      return (
        <div className={style.root}>
          <video width="100%" height="100%" autoPlay loop muted playsInline
            className={style.videoBackground}>
            <source src={videoSrc} type="video/mp4"/>
            Your browser does not support the video tag.
          </video>
          <div className={style.container}>
            {/* <Box
              position='relative'
              height='40px'
              display='flex'
              alignItems='center'>
              <img
                className={style.backButton}
                src='/static/icons/back.svg'
                onClick={this.props.backButton}
                alt='back' />
            </Box> */}
            <div className={style.title}>SCAN COMPLETE!</div>
            <div className={style.description}>
              Woohoo! You did it, get excited for <br />
              the pedi of the future!
            </div>
            {transitionTrigger === 'checkout' ?
              <DarkButton
                passedClass={style.actionButton}
                onClick={this.navToCheckout}>
                  CHECKOUT
              </DarkButton> : transitionTrigger === 'redeem' ?
              <DarkButton
                passedClass={style.actionButton}
                onClick={this.navToRedeem}>
                  Redeem
              </DarkButton> :
              <DarkButton
                passedClass={style.actionButton}
                onClick={this.navToGalleryPage}>
                  SEE DESIGNS
              </DarkButton>
            }
          </div>
        </div>
      );
  }
}

const mapStateToProps = state => ({
  userData: state.userData,
  profileData: state.profileData,
  uiData: state.uiData,
  mainCartData: state.mainCartData
})

export default connect(mapStateToProps, null)(MobileSuccess);
