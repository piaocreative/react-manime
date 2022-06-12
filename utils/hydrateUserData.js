import { Auth } from '@aws-amplify/auth';
import * as Sentry from '@sentry/browser';
import { retrieveUserData } from 'api/user';
import log from 'utils/logging';
import { setGlobalOrderCount, trackFunnelActionProjectFunnel } from './track';

export const hydrateUserData = async identityId => {
  trackFunnelActionProjectFunnel('[hydrateUserData] start', { identityId });
  return await Auth.currentCredentials()
    .then(async credentials => {
      console.log({ at: 'hydrateUserData', credentials, identityId });
      trackFunnelActionProjectFunnel('[hydrateUserData] after currentCredentials', {
        credentials,
        identityId,
      });

      const results = await retrieveUserData(identityId);

      const {
        pageName,
        firstName,
        lastName,
        skinColor,
        designPref,
        description,
        designPref2,
        designPref3,
        email,
        phoneNumber,
        subscription,
        stripeId,
        fitStatus,
        versionLeftThumb,
        versionLeftFingers,
        versionRightThumb,
        versionRightFingers,
        versionSide,
        statusLeftFingers,
        statusLeftThumb,
        statusRightFingers,
        statusRightThumb,
        statusSide,
        acceptsConditions,
        acceptsMarketing,
        checkoutId,
        defaultShippingAddressId,
        referralId,
        shopifyId,
        credits,
        flowName,
        providerName,
        totalOrders,
        acceptsSMS,
        defaultProfileId,
        recurlyAuthToken,
      } = results;

      // track('B. 4');
      const object = {
        name: {
          firstName,
          lastName,
        },
        pageName,
        identityId,
        description,
        email,
        phoneNumber,
        stripeId,
        isAuth: true,
        isCognitoAuth: true,
        fitStatus,
        acceptsConditions,
        checkoutId,
        defaultShippingAddressId,
        referralId,
        shopifyId,
        credits,
        providerName,
        acceptsMarketing,
        totalOrders,
        acceptsSMS,
        defaultProfileId,
        recurlyAuthToken,
      };

      sentrySetUser(identityId);

      let mixpanelId = email;
      if (!email || email == '') {
        mixpanelId = identityId;
        log.error('[hydrateUserData] no email', { email, identityId });
      }

      mixpanel.funnel.identify(mixpanelId);
      mixpanel.funnel.people.set_once({ $name: mixpanelId, $email: mixpanelId });
      mixpanel.funnel.register({
        userid: mixpanelId,
      });

      // set gloabl total orders for mixpanel logging
      setGlobalOrderCount(totalOrders ? totalOrders : 0);
      trackFunnelActionProjectFunnel('[hydrateUserData] end of hydrate', object);
      return object;
    })
    .catch(err => {
      // track('B. 7');
      log.error('[hydrateUserData] catch ' + err, { err });
      return {};
    });
};

const sentrySetUser = identityId => {
  Sentry.configureScope(scope => {
    scope.setUser({ identityId });
  });
};
