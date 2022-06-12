import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import log from 'utils/logging'
import HowToQASection from '../../howto/apply/HowToFAQSection';
import InternationalShipping from '../InternationalShipping';
// import EmailCapturePopup from '../../../components/landing/EmailCapturePopup/EmailCapturePopup';
// import LandingManiThanksDialog from '../LandingManiThanksDialog';
import LandingHotListSection from './LandingHotListSection_V2';
import LandingOnTheGoSection2 from './Sections/LandingOnTheGoSection_V2';
import LandingReasonOfLoveSection from './Sections/LandingReasonOfLoveSection';
import LandingHighTechManis from './Sections/LandingHighTechManis';
// import LandingOurSolids from './Sections/LandingOurSolids';
import LandingGuaranteeSection from './Sections/LandingGuaranteeSection';
import LandingYotpoSection from './Sections/LandingYotpoSection';
import LandingFeatureSection from './Sections/LandingFeatureSection';
import LandingSubscriptionFAQSectoin from './Sections/LandingSubscriptionFAQSectoin';
import LandingYotpoGallerySection from '../LandingYotpoGallerySection';


import { trackFunnelAction, trackFunnelActionProjectFunnel,  } from '../../../utils/track';
import { setItemToLocalStorage } from '../../../utils/localStorageHelpers';
import {
  SET_FLOW,
  UI_SET_KEY_VALUE
} from '../../../actions';
import { experiments } from '../../../utils/abTest';

const LandingPage = props => {
  useEffect(() => {
    storeReferralQuery();
    props.dispatchSetUIKeyValue('showLeapDayModal', true);
  }, []);

  const storeReferralQuery = () => {
    try {
      const url = new URL(window.location.href);
      const referralId = url.searchParams.get('referral');
      if (referralId) setItemToLocalStorage('referralId2', referralId);
    } catch (err) {
      log.error('[LandingPageV1] unable to store referralId ' + err, { err } );
    }
  }


  return (
    <div style={{position: 'relative'}}>
      <LandingOnTheGoSection2  isMobileView={props.isMobileView} />
      <LandingReasonOfLoveSection />
      <LandingHotListSection globalProps={props.globalProps} trackFunnelAction={trackFunnelAction} trackFunnelActionProjectFunnel={trackFunnelActionProjectFunnel} isMobileView={props.isMobileView} />
      <LandingHighTechManis isMobileView={props.isMobileView} />
      {/* <LandingOurSolids isMobileView={props.isMobileView} /> */}
      <LandingGuaranteeSection isMobileView={props.isMobileView} />
      <LandingYotpoSection isMobileView={props.isMobileView}/>
      <LandingFeatureSection trackFunnelAction={trackFunnelAction} trackFunnelActionProjectFunnel={trackFunnelActionProjectFunnel} isMobileView={props.isMobileView} />
      <LandingSubscriptionFAQSectoin isMobileView={props.isMobileView} />
      {props.isMobileView &&
        <HowToQASection isLanding />
      }
      <LandingYotpoGallerySection />
      <InternationalShipping />
      {/* <EmailCapturePopup isMobileView={props.isMobileView} isAuth={props.userData.isAuth} /> */}
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
