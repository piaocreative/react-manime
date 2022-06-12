

import { ManimeApi } from './connections/manimeApi'
import { IntegrationProxy } from './connections/integrationProxy'
import { track, trackFunnelActionProjectFunnel } from 'utils/track';

export const updateUserColumn = async (userId, columnName, columnValue) => {
  // TODO: check later
  return await ManimeApi('post', `/users/update/column`, {
    columnName,
    columnValue,
    userId
  });
};

export const addCredits = async (userId, credits, description, category) => {
  let additionalData = {
    description,
    category
  };

  const result = await ManimeApi('post', '/users/credits/add', { userId, credits, additionalData });
  return result;
};


export const redeemCredits = async (userId, credits, description, category) => {
  let additionalData = {
    description,
    category
  };

  const result = await ManimeApi('post', '/users/credits/redeem', { userId, credits, additionalData });
  return result;
};

export const retrieveUserData = async identityId => {
  trackFunnelActionProjectFunnel('[lambdaFunctions][retrieveUserData] start', { identityId });
  const pathName = `/users/read/${identityId}`;
  const result = await ManimeApi('get', pathName);
  trackFunnelActionProjectFunnel('[lambdaFunctions][retrieveUserData] result', { pathName, result });

  return {
    ...result,
    identityId,
    email: result && typeof result.email == 'string' ? result.email.toLowerCase() : '',
  };
};

export const getFittedUsersWithEmail = async email => {
  const result = await ManimeApi('get', `/users/read?filter=email eq ${email},statusLeftFingers eq true,statusLeftThumb eq true,statusRightFingers eq true,statusRightThumb eq true,statusSide eq true`);
  return result;
}

export const migrateUserData = async (fromIdentityId, toIdentityId) => {

  const response = await IntegrationProxy('post', `/migrateuserdata/${fromIdentityId}`, 
    {body: { destination: toIdentityId },});
  return response;
};



export const getProvidersByEmail = async(email) =>{
  return await ManimeApi('get', `/user/providers?userSearch=${encodeURIComponent(email)}`)
}

export const createUser = async (userData) =>{
  return ManimeApi('post', '/users/create_v2', userData)
}


// retriev Emails saved in CMS
export const retrieveUsersWithEmail = async email => {
  const result = await ManimeApi('get', `/users/read?filter=email eq ${encodeURIComponent(email)}`);
  return result;
}

export const retrieveUserByProvider = async (email, provider) => {
  const result = await ManimeApi('get', `/users/read?filter=providername eq ${provider},email eq ${email}`);
  return result
}



export const getShippingAddressWithIndentity = async (identityId) => {
  const result = await ManimeApi('get', `/shippingaddresses/read?filter=userId eq ${identityId}`);
  return result;
}

export const addShippingAddress = async body => {
  const result = await ManimeApi('post', '/shippingaddresses/create', body);
  return result;
};

export const editShippingAddress = async body => {
  const result = await ManimeApi('post', '/shippingaddresses/update', body);
  return result;
};

// FIXME: UPDATE AFTER FILTERBY
export const getShippingAddresses = async identityId => {
  const result = await ManimeApi('get', `/shippingaddresses/read/user/${identityId}`);
  return result;
};


export const editUser = async (user) => {
  const result = await ManimeApi('post', '/users/patch', user);
  return result;
};