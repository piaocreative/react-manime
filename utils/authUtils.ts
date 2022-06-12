import { Auth } from '@aws-amplify/auth';
import { ICredentials } from '@aws-amplify/core';
import { SET_IS_COGNITO_AUTH } from 'actions';
import { createDefaultCheckout } from 'api/cart';
import { createReferralLink, getReferralsWithIdentityId } from 'api/referral';
import { createUser, retrieveUserByProvider, retrieveUserData, updateUserColumn } from 'api/user';
import { getPresigned, upsertPresigned } from 'api/util';
import config from 'config';
import sha1 from 'crypto-js/sha1';
import sha256 from 'crypto-js/sha256';
import { getStore } from 'lib/redux';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { identity } from 'lodash';
import findOrCreateShopifyUser from 'utils/associateShopifyUser';
import log from 'utils/logging';
import { checkReferral } from 'utils/referralUtils';
import { retryPromise } from 'utils/retry';
import { track, trackFunnelActionProjectFunnel } from 'utils/track';
import uuid from 'uuid';
import { ManimeApi } from './lambdaFunctions';

export async function startFederatedSignIn(provider, currentPage, expectedIdentity = undefined) {
  const customState = currentPage + (expectedIdentity ? `&${expectedIdentity}` : ``);

  trackFunnelActionProjectFunnel(
    `[authUtils][startFederatedSignIn] using provider ${provider} and currentPage ${currentPage}`
  );
  Auth.federatedSignIn({ provider, customState: btoa(customState) });
}

type SignInResult = {
  success: boolean;
  credentials?: ICredentials;
  error?: any;
};

/**
 * to log in
 */
export async function constructLoginLink(email, currentPage) {
  const encodedEmail = Buffer.from(email).toString('base64');
  let presignedUrl = '';
  const originPath = config.appUrl;
  try {
    const sessionPromise = Auth.currentSession();
    const session = await sessionPromise;
    const accessTokenObject = session.getAccessToken();
    const idTokenObject = session.getIdToken();

    const access_token = accessTokenObject.getJwtToken();

    const id_token = idTokenObject.getJwtToken();
    const token_type = 'Bearer';
    const expires_in = 3300;

    presignedUrl =
      `${originPath}/auth?step=oauth_redirect&currentPage=${encodeURIComponent(currentPage)}` +
      `#access_token=${access_token}&id_token=${id_token}&token_type=${token_type}&expires_in=${expires_in}`;
  } catch (error) {
    log.error(
      'Trying to construct an OAUTH url but exceptions occured getting the correct data from Amplify Cognito',
      error
    );
  }
  const usePresignedFederated = presignedUrl != '';
  let url = `${originPath}/auth?step=link&e=${encodedEmail}`;
  if (usePresignedFederated) {
    const id = uuid.v1();
    url = `${originPath}/auth?step=link&id=${id}&e=${encodedEmail}`;
    upsertPresigned(id, presignedUrl);
  }

  return url;
}

export async function completeFederatedSignIn(): Promise<{
  success: boolean;
  complete?: boolean;
  user?;
  credentials?: ICredentials;
  error?: any;
}> {
  trackFunnelActionProjectFunnel('[authUtils][completeFederatedSignIn] start');

  try {
    const user = await Auth.currentAuthenticatedUser();
    const credentials = await Auth.currentCredentials();
    const emailsha1 = sha1(user.attributes.email)
      .words.map(val => val.toString(16))
      .join('');
    const phonesha1 = sha1(user.attributes.phone_number)
      .words.map(val => val.toString(16))
      .join('');
    const emailsha256 = sha256(user.attributes.email);
    const phonesha256 = sha256(user.attributes.phone_number);

    if (await hasDbUser(user, credentials.identityId)) {
      log.verbose('federatedSignIn user', {
        user,
        email: user.attributes.email,
        emailsha1,
        emailsha256,
      });

      if (window['dataLayer']) {
        window['dataLayer'].push({
          event: 'signIn',
          customerId: user.username,
          customerEmailSHA1: emailsha1,
          customerPhoneSHA1: phonesha1,
          customerEmailSHA256: emailsha256,
          customerPhoneSHA256: phonesha256,
        });
      }

      dispatchSignInEvent(true);

      return { success: true, complete: true, credentials, user };
    } else {
      return { success: true, complete: false, credentials, user };
    }
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function signIn(
  email,
  password,
  dispatchEvent = true
): Promise<{ success: boolean; credentials?: ICredentials; error?: any; dispatchEvent?: boolean }> {
  trackFunnelActionProjectFunnel('[authUtils][signIn] signIn start');

  try {
    const user = await Auth.signIn(email, password);

    const emailsha1 = sha1(user.attributes.email)
      .words.map(val => val.toString(16))
      .join('');
    const phonesha1 = sha1(user.attributes.phone_number)
      .words.map(val => val.toString(16))
      .join('');
    const emailsha256 = sha256(user.attributes.email);
    const phonesha256 = sha256(user.attributes.phone_number);

    const credentials = await Auth.currentCredentials();
    const identityId = credentials.identityId;

    await ManimeApi('post', '/users/date-last-login', { userId: identityId });

    if (window['dataLayer']) {
      window['dataLayer'].push({
        event: 'signIn',
        customerId: identityId,
        customerEmailSHA1: emailsha1,
        customerPhoneSHA1: phonesha1,
        customerEmailSHA256: emailsha256,
        customerPhoneSHA256: phonesha256,
      });
    }

    /* This is check is a potential break point because it's going across the network again. 
    if (await hasDbUser(user, identityId)) {
      log.verbose("User has complete profile ", identityId)
    } else {
      log.verbose("User signed in but doesn't have a complete profile", identityId)
    }
    */

    if (dispatchEvent) {
      dispatchSignInEvent(true);
    }
    return { success: true, credentials };
  } catch (err) {
    trackFunnelActionProjectFunnel('[ERROR][authUtils][signIn]', { err: err });
    return { success: false, error: err };
  }
}

export async function signUp(
  email,
  password,
  firstName,
  lastName,
  phoneNumber,
  acceptsSMS
): Promise<SignInResult> {
  trackFunnelActionProjectFunnel('[authUtils][signUp] signUp start', {
    email,
    firstName,
    lastName,
    _phoneNumber: phoneNumber,
  });
  let attributes = {
    given_name: firstName,
    family_name: lastName,
    'custom:accepts_sms': acceptsSMS ? 'true' : 'false',
  };

  try {
    const _phoneNumber = parsePhoneNumberFromString(`${phoneNumber}`, 'US');

    if (_phoneNumber) {
      attributes['phone_number'] = _phoneNumber.number;
    }
  } catch (err) {
    log.error('[authUtils][signUp] phone number parsing ' + err, { err, phoneNumber: phoneNumber });
  }

  let signUpResult,
    signInResult = undefined;
  try {
    signUpResult = await Auth.signUp({
      username: email,
      password: password,
      attributes,
    });
    trackFunnelActionProjectFunnel('[authUtils][signUp] cognito signUp successful', { email });
    signInResult = await retryPromise(signIn, [email, password, false], 'Call Auth Sign In');

    trackFunnelActionProjectFunnel('[authUtils][signUp] cognito login successful', { email });
    log.verbose('[signUp] results from sign up and sign in', {
      signupResults: signUpResult,
      signInResult,
    });
    const identityId = signInResult.credentials.identityId;

    const signinResult = await createDbUser({
      identityId,
      email,
      firstName,
      lastName,
      acceptsSMS,
      phoneNumber,
      providerName: 'cognito',
    });
    if (!signinResult) {
      return { success: false, error: { message: 'Problem creating account. Please try again' } };
    }
    trackFunnelActionProjectFunnel('[authUtils][signUp] createDbUser in our system successful', {
      email,
    });
    dispatchSignInEvent(true);

    return signInResult;
  } catch (error) {
    let message = undefined;
    if (error?.code === 'UsernameExistsException') {
      message =
        'An account with this email has been partially created but requires further attention from our care team. Please contact them at care@manime.co';
      log.fatal('[ERROR][authUtils][signUp] signUp failed', {
        error,
        attributes,
        email,
        signupResults: signUpResult,
        signInResult,
      });
    } else if (!signUpResult) {
      message = 'Problems creating account, please try again';
      log.error('[ERROR][authUtils][signUp] signUp failed', {
        error,
        attributes,
        email,
        signupResults: signUpResult,
        signInResult,
      });
    } else if (!signInResult) {
      log.fatal(
        '[ERROR][authUtils][signUp] signUp failed, please manually create this user in the db',
        {
          email,
          firstName,
          lastName,
          acceptsSMS,
          phoneNumber: attributes['phone_number'],
          providerName: 'cognito',
        }
      );
      message =
        'Problems creating account. Our care team has been made aware and will create the account for you. You may reach out to care directly by writing care@manime.co for quicker resolution.';
    } else {
      log.error('[ERROR][authUtils][signUp] signUp failed', {
        error,
        attributes,
        email,
        signupResults: signUpResult,
        signInResult,
      });
      message = 'Problems creating account, please try again';
    }
    trackFunnelActionProjectFunnel('[authUtils][signUp] signUp failure', {
      error,
      attributes,
      email,
      signupResults: signUpResult,
      signInResult,
      message,
    });

    return { success: false, error: { wrappedError: error, message } };
  }
}

async function hasDbUser(cognitoUser, identityId: string) {
  try {
    // we may want to remove this check .... I set this on the cognito user after all steps are done
    // for acount creation, but it's not easy to edit or remove this field to allow a customer to go through
    // account creation again for a previous user acount.
    if (!cognitoUser.attributes['custom:profile_complete']) {
      const manimeUser = await retrieveUserData(identityId);

      const isComplete = checkManimeProfileComplete(manimeUser);
      if (isComplete) {
        log.verbose('user was not complete but is now', undefined);
        Auth.updateUserAttributes(cognitoUser, {
          'custom:profile_complete': 'true',
        });
        return true;
      }

      log.verbose('user is not complete', undefined);
      return false;
    } else {
      log.verbose('user is complete', undefined);
      return true;
    }
  } catch (error) {
    if (error?.response?.data?.message === 'the user was not found') {
      log.verbose('user not found', identity);
    }
    return false;
  }
  return false;
}

/** checks to see if there is a complete profile for the user */
function checkManimeProfileComplete(manimeUser) {
  return manimeUser && manimeUser.email && true;
}

export function dispatchSignInEvent(isSignedIn) {
  getStore().dispatch(SET_IS_COGNITO_AUTH(isSignedIn));
}

export async function signInByLink() {
  const url = new URL(window.location.href);
  const c = url.searchParams.get('c');
  const id = url.searchParams.get('id');
  const e = url.searchParams.get('e');

  const hash = window.location.hash;

  let email;

  // NOTE: get email to track beginning of pre-signed link usage
  try {
    if (e) email = Buffer.from(e, 'base64').toString();
    if (email) {
      trackFunnelActionProjectFunnel('Immediately track signInByLink email');
    }
  } catch (err) {
    log.error('[authUtils][signInByLink] try email ' + err, { err });
  }

  if (id) {
    const presignedData = await getPresigned(id);
    if (presignedData) {
      log.verbose('should be presigned data', undefined);

      let temp = presignedData.text;
    }
  }
}

export async function createDbUser({
  identityId,
  email,
  firstName,
  lastName,
  acceptsSMS,
  phoneNumber,
  providerName,
}) {
  const acceptsMarketing = true;
  const _phoneNumber = phoneNumber ? phoneNumber.replace(/\s/g, '') : '';

  const promises = [];
  let pResults = [];
  try {
    log.verbose('[Auth][CreateDbUser] findOrCreateShopifyUser for ' + identityId, undefined);
    track('[authUtils][createDbUser][findOrCreateShopifyUser]');
    const shopifyResult = await findOrCreateShopifyUser(
      identityId,
      acceptsSMS,
      firstName,
      lastName,
      email,
      phoneNumber
    );

    // of all the promises just run only associateShopifyUSer is a createDBUser failure
    if (shopifyResult.error) {
      log.fatal(
        '[Auth][createDbUser] failed to create a new account or find an existing account to associate the user to. There is a dangling cognito account without a manime profile',
        {
          identityId,
          acceptsSMS,
          firstName,
          lastName,
          email,
          phoneNumber,
          error: shopifyResult.error,
        }
      );
      track('[authUtils][createDbUser][error]', {
        step: 'findOrCreateShopifyUser',
        error: shopifyResult.error,
      });
      return false;
    } else {
      log.verbose(
        '[Auth][CreateDbUser] successfully found shopify user for ' + identityId,
        undefined
      );
    }
    track('[authUtils][createDbUser][createDefaultCheckout]');
    let checkout = undefined;
    try {
      log.verbose(
        '[Auth][CreateDbUser] creating default checkout to assign to user ' + identityId,
        undefined
      );
      checkout = await createDefaultCheckout();
      log.verbose('[Auth][CreateDbUser] default checkout created  ' + identityId, undefined);
    } catch (error) {
      track('[authUtils][createDbUser][error]', { step: 'createDefaultCheckout', error: error });
    }

    let userData = {
      firstName,
      lastName,
      userId: identityId,
      email,
      fitted: false,
      acceptsConditions: acceptsMarketing,
      acceptsMarketing: acceptsMarketing,
      providerName,
      acceptsSMS,
      shopifyId: `${shopifyResult.shopifyUser.id}`,
      checkoutId: checkout?.id || '',
      phoneNumber: _phoneNumber || '',
    };

    let createResult = undefined;
    let updateResult = undefined;

    try {
      log.verbose('[autUtils][createDbUser] CreateUser does an upsert' + identityId, userData);

      track('[authUtils][createDbUser][createUser]');

      createResult = await retryPromise(
        createUser,
        [userData],
        '[authUtils][createDbUser] upsert a new user user',
        150, // interval
        5, //
        1 // exponential factor
      );

      log.verbose('[autUtils][createDbUser] db usesr created for id ' + identityId, {
        createResult,
      });
    } catch (error) {
      log.fatal(
        '[Auth][createDbUser] caught error in creating userShould be recoverable with manual intervention',
        { userData, error }
      );
      track('[authUtils][createDbUser][error]', { step: 'createUser', error: error });
      return false;
    }

    if (!createResult.user) {
      log.fatal(
        '[Auth][createDbUser] createResult has no user. At this point there is a cognito user and a shopify user but no corresponding mani me user. Should be recoverable with manual intervention',
        { userData, createResult }
      );

      track('[authUtils][createDbUser][error]', { step: 'createUser', error: createResult.error });

      return false;
    }

    // finish off the user creation
    try {
      log.verbose(
        '[autUtils][createDbUser] fishing up with non critical work for user creation ' +
          identityId,
        undefined
      );
      track('[authUtils][createDbUser][currentAuthUser]');
      const user = await Auth.currentAuthenticatedUser();
      let emailUpdate: any = {};
      if (user.email !== email) {
        emailUpdate.email = email;
      }
      track('[authUtils][createDbUser][updateUserAttributes]');
      promises.push(
        Auth.updateUserAttributes(user, {
          'custom:profile_complete': 'true',
          'custom:identity_id': identityId,
          ...emailUpdate,
        })
      );
      promises.push(checkReferral(identityId));
      promises.push(migrateUserData(email, identityId, providerName));
      promises.push(referralStuff(identityId, email));

      pResults = await Promise.all(promises);
      track('[authUtils][createDbUser][miscFinish]');
      log.verbose(
        '[authUtils][createDbUser] results from non critical work:  ' + identityId,
        pResults
      );
    } catch (error) {
      track('[authUtils][createDbUser][error]', { step: 'miscFinish', error: error });
      log.error('non fatal error while creating user, user account will still be created', error);
      // console.log({
      //   at: '[authUtils][createDbUser] results from non critical work [ERROR]:  ' + identityId,
      //   pResults,
      // });
    }

    return true;
  } catch (error) {
    track('[authUtils][createDbUser][error]', { step: 'generalCatch', error });
    log.fatal('[Auth][createDbUser] caught exception creating user, likely not created. ', {
      identityId,
      email,
      firstName,
      lastName,
      acceptsSMS,
      phoneNumber,
      providerName,
      error,
    });
    return false;
  }
}

// NOTE: CAREFUL, COULD OVERWRITE DATA, ONLY CALL ON NEW USER CREATION AND IF OLD ASSOCIATED PROVIDERNAME EXISTS
// NOTE: call when user is created, if email doesn't exist, return;
// NOTE: or call when user has empty email and is updated with an email
async function migrateUserData(email, identityId, providerName = undefined) {
  if (!email || !identityId || email == '' || identityId == '') {
    log.error('[Accounts][migrateUserData] migrate missing email or identityId', {
      providerName,
      email,
      identityId,
    });
    return;
  }
  // if oldprovider, migrate all data over
  // how? a request to filter by email and providername, if it exists, migrate from
  const oldProviderName =
    providerName == 'facebook'
      ? 'old_facebook'
      : providerName == 'google'
      ? 'old_google'
      : providerName == 'cognito'
      ? 'old_user_pool'
      : '';

  if (oldProviderName == '') {
    return;
  }
  // log.fatal("Trying to migrate user data ... this old provider should not be in play anymore", {email, identityId, providerName})

  try {
    let oldIdentityToBeMapped = '';
    const result = await retrieveUserByProvider(email, oldProviderName);

    if (Array.isArray(result) && result.length > 0) oldIdentityToBeMapped = result[0].userId;

    if (oldIdentityToBeMapped != '') {
      // TODO: checking error
      await migrateUserData(oldIdentityToBeMapped, identityId);
      await updateUserColumn(identityId, 'providerName', providerName);
    }
  } catch (err) {
    log.error('[Accounts][migrateUserData] exception ' + err, {
      providerName,
      email,
      identityId,
      err,
    });
  }
}

async function referralStuff(identityId, email) {
  const promotionId = 'defaultPromotion';
  const sourceId = identityId ? identityId : '';
  const linkType = 'defaultLink';
  let result = [];
  let referralId = '';

  try {
    result = await getReferralsWithIdentityId(sourceId, linkType, promotionId);
  } catch (err) {
    log.error('[authUtils][referralStuff] first try/catch ' + err, { err });
  }

  if (result.length > 0) {
    referralId = result[0].referralId;
  } else {
    try {
      const result = await createReferralLink(promotionId, sourceId, linkType);
      referralId = result.referralId;
    } catch (err) {
      log.error('error creating referral ID!!!!', { err });
    }
  }

  try {
    const originPath =
      typeof window !== 'undefined' && window.location ? window.location.origin : config.appUrl;
    const defaultManimePath = `${originPath}/verify?referral=${referralId}`;

    let _learnq = window['_learnq'] || [];
    _learnq.push([
      'identify',
      {
        $email: email,
        referral_link: defaultManimePath,
      },
    ]);
  } catch (err) {
    log.error(`[authUtils][referralStuff] third try/catch ` + err, { err });
  }
}
