import pRetry from 'p-retry';
import { SubscriptionEntitlement, SubscriptionPlan } from 'types';
import log from 'utils/logging';
import { ManimeApi } from './connections/manimeApi';

export const getPlans = async (): Promise<[SubscriptionPlan]> => {
  // TODO: check later
  const result = await ManimeApi('get', `/subscription-plan`);

  if (!result.rows) {
    throw new Error('Subscription data not available');
  }

  return result.rows;
};

export async function getSubscription(
  userId,
  isNew = false
): Promise<SubscriptionEntitlement[] | undefined> {
  const retries = isNew ? 5 : 1;
  async function _getSubscription() {
    const result = await ManimeApi('get', `/recurlySubscription?userId=${userId}`);
    if (result?.rows.length > 0) {
      return result.rows;
    } else {
      throw new Error(`No subscription entitlement found`);
    }
  }

  try {
    const result = await pRetry(_getSubscription, {
      onFailedAttempt: error => {
        console.log(`Fetching Subscription. There are ${error.retriesLeft} retries left.`);
      },
      retries,
      maxRetryTime: 15000,
      factor: 3,
    });
    log.verbose('results are', { result });
    console.log('results are', { at: 'getSubscription', result });
    return result;
  } catch (err) {
    if (err.message === 'No redeemable subscriptions') {
      return [];
    } else {
      return undefined;
    }
  }
}

export async function getAllEntitlements(
  userId,
  isNew = false
): Promise<SubscriptionEntitlement[] | undefined> {
  const retries = isNew ? 5 : 1;
  async function _getEntitlements() {
    const result = await ManimeApi(
      'get',
      `/subscription-entitlement?userId=${userId}&withOrderInfo`
    );
    if (result?.rows.length > 0) {
      return result.rows;
    } else {
      throw new Error(`No subscription entitlement found`);
    }
  }

  try {
    const result = await pRetry(_getEntitlements, {
      onFailedAttempt: error => {
        console.log(`Fetching Entitlement. There are ${error.retriesLeft} retries left.`);
      },
      retries,
      maxRetryTime: 15000,
      factor: 3,
    });
    log.verbose('results are', { result });
    return result;
  } catch (err) {
    if (err.message === 'No redeemable subscriptions') {
      return [];
    } else {
      return undefined;
    }
  }
}

export async function getEntitlements(
  userId,
  isNew = false
): Promise<SubscriptionEntitlement[] | undefined> {
  const retries = isNew ? 5 : 1;
  async function _getEntitlements() {
    const result = await ManimeApi('get', `/subscription-entitlement?userId=${userId}`);
    if (result?.rows.length > 0) {
      let entitlements = result.rows.filter(entitlement => !entitlement.redeemed);
      if (entitlements.length > 0) {
        return entitlements;
      } else {
        throw new Error('No redeemable subscriptions');
      }
    } else {
      throw new Error(`No subscription entitlement found`);
    }
  }

  try {
    const result = await pRetry(_getEntitlements, {
      onFailedAttempt: error => {
        console.log(`Fetching Entitlement. There are ${error.retriesLeft} retries left.`);
      },
      retries,
      maxRetryTime: 15000,
      factor: 3,
    });
    log.info('results are', { result });
    return result;
  } catch (err) {
    if (err.message === 'No redeemable subscriptions') {
      return [];
    } else {
      return undefined;
    }
  }
}
