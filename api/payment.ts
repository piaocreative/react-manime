import { PaymentApi } from './connections/paymentApi';
import log from 'utils/logging'

export async function createStripeCharge(stripeId, chargeAmount, description, stripeSourceObject: any, idempotencyKey: string): 
Promise<{ chargeId?: string, error?: any}> {

  let apiBody = {
    customerId: stripeId,
    total: chargeAmount,
    idempotencyKey,
    description,
    source: stripeSourceObject
  };

  try{
    const response = await PaymentApi('post', '/payment/charge/source', apiBody);

    log.verbose('response is ', response)
    if(!response.id){
      const error = new Error("Gifting CreateCharge could not find charge id");
      error['source'] = "SYSTEM";
      error['reason'] =  "Gifting CreateCharge could not find charge id";
      error['response'] = response;
      throw error;
    }
    // this.props.setErrorMessage(false, null);
    log.verbose("response from creating charge: ", response)
  
  
    return {chargeId: response.id}
  }catch(err){
    log.error(`[payment][createStripeCharge] could not create charge ${err}`, {err, apiBody})
    return  {error: err}
  }



}

export const createPayment = async (customerId, total, idempotencyKey) =>{
  let apiBody = {
    customerId,
    total,
    idempotencyKey
  }
  const response = await PaymentApi('post', '/payment/live', apiBody)
  return response;
}

export const addShopifyIdStripeCharge = async (chargeId, shopifyOrderId) => {

  const response = await PaymentApi('post', `/charges/${chargeId}/shopifyOrderId`, {shopifyOrderId});
  return response;
}

export const getCustomer = async stripeCustomerId => {

  const response = await PaymentApi('get', `/customer/read/${stripeCustomerId}`);
  return response;
}

export const removePayment = async (stripeCustomerId, cardId) => {
  const body = {
      customerId: stripeCustomerId,
      cardId
    }
  const response = await PaymentApi('post', `/cards/delete`, body);
  return response;
}

export const getPayments = async stripeCustomerId => {
  if (!stripeCustomerId) return;
  const response = await getCustomer(stripeCustomerId);
  return response.sources.data;
}


export const setDefaultCard = async (customerId, defaultSource) => {

  if (!defaultSource || !customerId) return null;

  const response = await PaymentApi('post', `/customer/update`, { customerId, defaultSource });
  return response;
}

type AddCardToUserResponse = Promise<
  {
    success?: {expMonth, expYear, last4, brand}, 
    error?
  }>

export const addCardtoUser = async(source, stripeId) : AddCardToUserResponse =>{
  let userData = {
    source: source.id,
    stripeId
  };


  try {

    const response = await PaymentApi('post',  '/subscription/customer/payment', userData);
    
    const success = {
      expMonth: source.card.exp_month,
      expYear: source.card.exp_year,
      last4: source.card.last4,
      brand: source.card.brand
    }

    return {success}

  } catch (err) {

    const error = (((err || {}).response || {}).data || {}).err || '';
    log.error(`[payment] addCardtoUser ${err}`, { err } );
    return {error}
    
  }
}

// Subscription
export const getSubscription = async stripeId => {
  if (!stripeId) return null;
  const response = await PaymentApi('get', `/subscription/retrieve/${stripeId}`);
  return response;
};

export const cancelSubscription = async subscriptionId => {
  if (!subscriptionId) return null;
  const response = await PaymentApi( 'post', `/subscription/cancel/${subscriptionId}`);
  return response;
};

export const resumeSubscription = async subscriptionId => {
  if (!subscriptionId) return null;
  // if null, that means this user does not have any subscriptions, we need to subscribe this user to a new subscription with the right plan.
  const response = await PaymentApi('post', `/subscription/resume/${subscriptionId}`);
  return response;
};
// Test this function
export const startSubscription = async (subscriptionPlan, customerId, discountCode) => {
  let userData = {
    pricingPlan: subscriptionPlan,
    customerId,
    discountCode: typeof discountCode == 'string' ? discountCode.toLowerCase() : ''
  };


  PaymentApi( '/subscription/subscribe', userData)
  .then(response => {
    log.info(response);
  })
  .catch(err => {
    log.error(`[payment][startSubscription] ${err}`, {subscriptionPlan, customerId, discountCode, err, userData});

  });
};
