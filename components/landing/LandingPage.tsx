import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import log from 'utils/logging';
import LandingOnTheGoSection from './LandingOnTheGoSection';
import LandingHotListSection from './LandingHotListSection';
import LandingHighTechManis from './LandingHighTechManis';
import LandingHowWorkSection from './LandingHowWorkSection';
import LandingFreeSection from './LandingFreeSection';
import LandingIntroSection from './LandingIntroSection';
import LandingFullHappinessSection from './LandingFullHappinessSection';
import LandingFeedbackSection from './LandingFeedbackSection';
import HowToQASection from './HowToQASection';
import InternationalShipping from './InternationalShipping';
// import EmailCapturePopup from '../../components/landing/EmailCapturePopup/EmailCapturePopup';

import LandingYotpoGallerySection from './LandingYotpoGallerySection';


import { trackFunnelAction, trackFunnelActionProjectFunnel,  } from '../../utils/track';
import { setItemToLocalStorage } from '../../utils/localStorageHelpers';
import {
  SET_FLOW,
  UI_SET_KEY_VALUE
} from '../../actions';
import { experiments } from '../../utils/abTest';
import style from '../../static/components/landing/landing.module.css';

const LandingPage = props => {


  useEffect(() => {
    // trackFunnelActionProjectFunnel('A. Entered Landing Page');
    storeReferralQuery();
    props.dispatchSetUIKeyValue('showLeapDayModal', true);
  }, []);

  const storeReferralQuery = () => {
    try {
      const url = new URL(window.location.href);
      const referralId = url.searchParams.get('referral');
      if (referralId) setItemToLocalStorage('referralId2', referralId);
    } catch (err) {
      log.error('[LandingPage] unable to store referralId ' + err, { err } );
    }
  }

  return (
    <div style={{overflow: 'hidden', position: 'relative'}}>
      {/* {showManiThanksDialog && <LandingManiThanksDialog onClose={this.closeManiThanksHandler} />} */}
      <LandingOnTheGoSection />
      <div style={{overflow: 'hidden', position: 'relative'}} className={style.tempLanding}>
        <LandingHotListSection trackFunnelAction={trackFunnelAction} trackFunnelActionProjectFunnel={trackFunnelActionProjectFunnel}/>
        <LandingHowWorkSection />
      </div>
      <LandingHighTechManis  isMobileView={props.isMobileView} />
      <div style={{overflow: 'hidden', position: 'relative'}} className={style.tempLanding}>
        <LandingFreeSection />
      </div>
        <LandingIntroSection trackFunnelAction={trackFunnelAction} trackFunnelActionProjectFunnel={trackFunnelActionProjectFunnel}/>
      <div style={{overflow: 'hidden', position: 'relative'}} className={style.tempLanding}>
        <LandingFullHappinessSection />
        <LandingFeedbackSection />
        <LandingYotpoGallerySection />
        <HowToQASection />
      </div>
      <InternationalShipping />
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  userData: state.userData,
});

const mapDispatchToProps = dispatch => ({
  dispatchSetUIKeyValue: (key, value) => dispatch(UI_SET_KEY_VALUE(key, value))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LandingPage);
