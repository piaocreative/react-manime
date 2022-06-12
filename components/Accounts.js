import { Auth } from '@aws-amplify/auth';
import { SET_KEY_VALUE, SET_USER_AND_PROFILE } from 'actions';
import { ManimeApi } from 'api/connections/manimeApi';
import { createProfile, getProfiles } from 'api/profile';
import { getProvidersByEmail } from 'api/user';
import sha1 from 'crypto-js/sha1';
import sha256 from 'crypto-js/sha256';
import Router from 'next/router';
import React from 'react';
import { connect } from 'react-redux';
import { hydrateUserData } from 'utils/hydrateUserData';
import { pageLinks } from 'utils/links';
import log from 'utils/logging';
import { retryPromise } from 'utils/retry';
import { track, trackFunnelActionProjectFunnel } from 'utils/track';

class Accounts extends React.Component {
  state = {
    retrievedUserData: null,
    retrievedCognitoData: null,
  };

  async componentDidMount() {
    this._mounted = true;
    const isCognitoAuth = this.props.userData.isCognitoAuth;

    if (isCognitoAuth) {
      this.accountsLogic('mount');
      process.env.IS_AUTH = 'true';
    } else {
      process.env.IS_AUTH = 'false';
    }
  }

  async componentDidUpdate(prevProps) {
    const isCognitoAuth = this.props.userData.isCognitoAuth;
    const prevIsCognitoAuth = prevProps.userData.isCognitoAuth;

    if (isCognitoAuth != prevIsCognitoAuth) {
      if (isCognitoAuth) {
        this.accountsLogic('update');
        process.env.IS_AUTH = 'true';
      } else {
        process.env.IS_AUTH = 'false';
      }
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  accountsLogic = async from => {
    track(`[Accounts][accoutsLogic] start`);
    trackFunnelActionProjectFunnel('[AUTH_REFACTOR] 1');
    let retrievedCognitoData = null; // this.state.retrievedCognitoData;
    if (!retrievedCognitoData) {
      retrievedCognitoData = await this.retrieveAccountData(from);
      if (!retrievedCognitoData) {
        process.env.IS_AUTH = 'false';
        return;
      }
      this.setState({ retrievedCognitoData });
    }
    const { identityId, attributes, user } = retrievedCognitoData;
    if (!identityId || !attributes || !user) {
      log.error(`[Accounts][accountsLogic] id, user or attr null`, {
        identityId,
        attributes,
        user,
      });
    }

    let userData = await this.callHydrateUserData(identityId);

    if (!userData) {
      const email = retrievedCognitoData?.attributes?.email;
      const migratedProviders = await getProvidersByEmail(email + '_migrated');
      const oldUserId = retrievedCognitoData?.attributes?.['custom:identity_id'];
      const newUserId = retrievedCognitoData?.identityId;
      if (migratedProviders.length > 0) {
        const result = await ManimeApi('post', '/update-user-id', { oldUserId, newUserId });
        log.userData = await this.callHydrateUserData(newUserId);
        if (userData) {
          // console.log({ at: 'components/Accounts/accountsLogic', userData });
          const user = await Auth.currentAuthenticatedUser();
          await Auth.updateUserAttributes(user, {
            'custom:identity_id': newUserId,
          });
        }
      }

      log.error(
        '[Accounts][accountsLogic] error: no user data found for cognito account, signing out',
        { identityId, attributes, user }
      );
      this.signOut();
      process.env.IS_AUTH = 'false';
      return;
    }
  };

  checkProfiles = async (identityId, profileName) => {
    try {
      const profiles = await getProfiles(identityId);

      if (profiles.length >= 2) {
        return profiles;
      }

      const profile = {
        userId: identityId, //
        profileName,
        isDefault: false,
        statusLeftFingers: null,
        statusLeftThumb: null,
        statusRightFingers: null,
        statusRightThumb: null,
        versionLeftFingers: null,
        versionLeftThumb: null,
        versionRightFingers: null,
        versionRightThumb: null,
        versionSide: null,
        statusSide: false,
        fitStatus: null, //'fittingValidated'
      };

      if (profiles.length === 0) {
        await createProfile({ ...profile, profileType: 'Manis' });
        await createProfile({ ...profile, profileType: 'Pedis' });
      } else if (profiles.length === 1) {
        if (profiles[0].profileType === 'Manis') {
          await createProfile({ ...profile, profileType: 'Pedis' });
        } else if (profiles[0].profileType === 'Pedis') {
          await createProfile({ ...profile, profileType: 'Manis' });
        }
      }

      return await getProfiles(identityId);
    } catch (err) {
      log.info('ERROR in Account.js / checkProfiles', err);
      trackFunnelActionProjectFunnel('ERROR in Account.js / checkProfiles', { err });
    }
    return [];
  };

  callHydrateUserData = async identityId => {
    try {
      trackFunnelActionProjectFunnel('[Accounts][callHydrateUserData] start', { identityId });
      const userData = await hydrateUserData(identityId);
      if (!userData) {
        log.info('[Accounts][callHydrateUserData] no user data', { identityId });
        return undefined;
      }
      log.verbose('callHydrateUserData ... hydrate results are ', userData);

      const profiles = await this.checkProfiles(
        userData.identityId,
        `${userData.name.firstName} ${userData.name.lastName}`
      );

      if (profiles.length < 2) {
        log.error('[Accounts][callHydrateUserData] profiles invalid', { identityId, profiles });
      }

      if (userData?.name) {
        this.identifyUserToKlaviyo(userData.email, userData.name.firstName, userData.name.lastName);
      }

      this.props.dispatchSetUserAndProfile({ userData, profileData: profiles });
      trackFunnelActionProjectFunnel('[Accounts][callHydrateUserData] just set user and profile', {
        userData,
      });
      return userData;
    } catch (err) {
      log.error('[Accounts][callHydrateUserData] call failed ' + err, { err });
      return undefined;
    }
    // must be authenticated
  };

  identifyUserToKlaviyo = (_email, _firstName, _lastName) => {
    const email = _email || '';
    const firstName = _firstName || '';
    const lastName = _lastName || '';

    // NOTE: Add referral link here
    // FIXME:
    let _learnq = window._learnq || [];
    _learnq.push([
      'identify',
      {
        $email: email,
        $first_name: firstName,
        $last_name: lastName,
        // 'hasPics': false,
        // 'Accepts Marketing': acceptsMarketing,
      },
    ]);
  };

  getProviderName = user => {
    let providerName = 'cognito';
    const username = user.username;
    let splitArray = username.split('_');
    if (splitArray && Array.isArray(splitArray) && splitArray.length > 1)
      providerName = splitArray[0];
    if (providerName === 'Google') providerName = 'google';
    if (providerName === 'Facebook') providerName = 'facebook';
    return providerName;
  };

  retrieveAccountData = async from => {
    let credentials = {};

    try {
      credentials = await retryPromise(
        Auth.currentCredentials,
        [],
        'Call Auth Current Credentials',
        150, // interval
        5, //
        1 // exponential factor
      );
    } catch (err) {
      const message =
        'signing out because there is no current creds during ' + from + ' error: ' + err;
      log.error(message);
      trackFunnelActionProjectFunnel(
        '[Accounts][retrieveAccountData] credentials failed even though isCognitoAuth',
        { err }
      );
      this.signOut();
      return null;
    }

    let user;

    user = await retryPromise(
      this.createAuthenticatedUserPromise,
      [],
      'Call Auth Current Authenticated User'
    );

    const identityId = credentials.identityId;
    const attributes = user.attributes;
    return { identityId, attributes, user };
  };

  createAuthenticatedUserPromise = () => {
    return new Promise(function (resolve, reject) {
      Auth.currentAuthenticatedUser()
        .then(user => {
          const emailsha1 = sha1(user.attributes.email)
            .words.map(val => val.toString(16))
            .join('');
          const phonesha1 = sha1(user.attributes.phone_number)
            .words.map(val => val.toString(16))
            .join('');
          const emailsha256 = sha256(user.attributes?.email || '');
          const phonesha256 = sha256(user.attributes?.phone_number || '');

          if (window['dataLayer']) {
            window['dataLayer'].push({
              event: 'signIn',
              customerId: user.username,
              customerEmailSHA1: emailsha1,
              customerPhoneSHA1: phonesha1,
              customerEmailSHA256: emailsha256,
              customerPhoneSHA256: phonesha256,
            });
          } else {
            log.error("window['dataLayer'] is not available");
          }
          resolve(user);
        })
        .catch(err => reject(err));
    });
  };

  signOut = async () => {
    Auth.signOut().finally(() => {
      if (window['dataLayer']) {
        window['dataLayer'].push({
          event: 'signOut',
          customerId: null,
          customerEmailSHA1: null,
          customerPhoneSHA1: null,
          customerEmailSHA256: null,
          customerPhoneSHA256: null,
        });
      }
      this.props.dispatchResetUserData();

      if (this.props?.userData?.providerName === 'cognito') {
        Router.push(pageLinks.signOut.url);
      }
    });
  };

  render() {
    return <div />;
  }
}

const mapStateToProps = state => ({
  userData: state.userData,
  uiData: state.uiData,
});

const mapDispatchToProps = dispatch => ({
  // NOTE: sign out actions, move to one sign out component for app
  dispatchResetUserData: () => dispatch({ type: 'RESET_USER_DATA' }),
  dispatchSetUserAndProfile: ({ userData, profileData }) =>
    dispatch(SET_USER_AND_PROFILE({ userData, profileData })),
  dispatchSetKeyValue: (key, value) => dispatch(SET_KEY_VALUE(key, value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
