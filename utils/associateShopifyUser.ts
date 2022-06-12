import {  trackFunnelActionProjectFunnel } from './track';

import { updateUserColumn } from 'api/user';
import { API } from '@aws-amplify/api';
import pRetry from 'p-retry';
import log from './logging'
import { validateEmail } from './validation';
import config from '../config/index'


async function updateCustomerWithShopifyId(identityId, result) {
  try {
    const shopifyId = (result || {}).id;
    await updateUserColumn(identityId, 'shopifyId', `${shopifyId}`);
  } catch (err) {
    log.error('[associateShopifyUser][updateCustomerWithShopifyId] DB User Creation Shopify Customer Creation Update Column', { err });
  }
  trackFunnelActionProjectFunnel('[Auth][updateCustomerWithShopifyId][v2] DB User Creation After Update Shopify Id', result);
}


function isValidEmail(email) {
  if (!email || email === '' || email.includes('us-west-2') || !validateEmail(email)) return false;
  return true;
}

type CreateShopifyUserInput = {
  firstName: string,
  lastName: string,
  email: string,
  verifiedEmail: boolean,
  note: string,
  acceptsMarketing: boolean,
  phone: string
}

async function createShopifyUser(input: CreateShopifyUserInput): Promise<{ success: boolean, error?: any, user?: any }> {

  const shopifyCustomerInit = {
    body: {
      ...input
    },
    headers: { 
      'Content-Type': 'application/json',
      'x-api-key': config.aws.api.ManimeApi.apiKey }
  };
  try {
    trackFunnelActionProjectFunnel('[Auth][createFederatedAccounts][v2] DB User Creation Before Shopify Customer Creation', shopifyCustomerInit);

    const result = await pRetry(
      () => API.post('IntegrationProxy', '/shopify/customer/create', shopifyCustomerInit),
      {
        onFailedAttempt: error => {
          const message = error.message || ""
          // want to only retry on network errors
          if(message.toLowerCase().indexOf('network') !== -1){
            throw new pRetry.AbortError(error.message);
          }
          log.info(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);

        },
        retries: 5, // 
        factor: 2,
        minTimeout: 1 * 500,
        maxTimeout: 5 * 500,
        randomize: true,
      },
    );

    return { success: true, user: result }
  } catch (error) {
    return { success: false, error }
  }
}

async function fetchExistingShopifyUser(input: CreateShopifyUserInput): Promise<{ success: boolean, error?: any, data?: any }> {
  const shopifyCustomerInit = {
    body: {
      ...input
    },
    headers: { 'Content-Type': 'application/json' }
  };
  trackFunnelActionProjectFunnel('[Auth][fetchExistingShopifyUSer] search by email ' + input.email);
  try {
    const user = await pRetry(
      () => API.get('IntegrationProxy', `/shopify/customer/read/${input.email}`, shopifyCustomerInit),
      {
        onFailedAttempt: error => {
          const message = error.message || ""
          // want to only retry on network errors
          if(message.indexOf('network') !== -1){
            throw new pRetry.AbortError(error.message);
          }
          log.info(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`);
        },
        retries: 3, // 5 calls
        factor: 2,
        minTimeout: 1 * 500,
        maxTimeout: 5 * 500,
        randomize: true,
      },
    );
    return { success: true, data: user }
  } catch (error) {
    return { success: false, error }
  }
}
async function findOrCreateShopifyUser(identityId, acceptsSMS, firstName, lastName, email, phoneNumber): Promise<{ error?: any, shopifyUser?: any }> {
  trackFunnelActionProjectFunnel('[Auth][createFederatedAccounts][v2] DB User Creation Before Shopify Customer Init');

  const userInput = {
    firstName,
    lastName,
    email,
    verifiedEmail: true,
    note: identityId,
    acceptsMarketing: acceptsSMS,
    phone: phoneNumber
  }
  let shopifyUser = undefined;
  try {
    let result =  await createShopifyUser(userInput)


    if (result.error) {
      log.info("Could not create shopify user, will try to find existing user", result)

      let fetchResult = await fetchExistingShopifyUser(userInput) 

      if (fetchResult.error) {
        log.error("associateShopifyCustomer error could not create user nor could find matching my email. User create failure", {userInput})
        return { error: { message: "associateShopifyCustomer error could not create user nor could find matching my email. User create failure", fatal: true }  }
      }
      if (Array.isArray(fetchResult.data.customers) && fetchResult.data.customers.length > 0) {
        shopifyUser =fetchResult.data.customers[0]

      } else {
        return {  error: { message: "associateShopifyCustomer error could not create user nor could find matching my email. User create failure", fatal: true } }
      }
    }else{
      shopifyUser = result
    }

    return {shopifyUser }
  } catch (err) {
    return { error: err }
  }

}

export default findOrCreateShopifyUser;
