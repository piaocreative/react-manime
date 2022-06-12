import { API } from '@aws-amplify/api';
import uuid from 'uuid';
import short from 'short-uuid';
import axios from 'axios';
import log from './logging'
import { track, trackFunnelActionProjectFunnel, incrementGlobalOrderCount } from './track';
import config from '../config';
import {UAParser} from 'ua-parser-js'
import constants from 'constants/index'

const API_MANIME = 'ManimeApi';
const API_MANIME_TEST = 'ManimeApiTest'
const API_MANIME_CACHED = 'ManimeApiCached'

const DYNAMO_DB_1 = 'DynamoDB1';
import { newProductIds, removingProductIds } from '../config/config-local';
import pRetry from 'p-retry';
import {getFitVersion, getLotteryOverride}  from './camera'
import {experiments} from './abTest'
export const ManimeApi = (method, path, body=undefined, header=undefined) => {
  const apiName = API_MANIME;
  const userInit = {
    body,
    headers: { 
      'Content-Type': 'application/json' ,
      'x-api-key': config.aws.api.ManimeApi.apiKey,
      ...header
    }
  };
  if (method == 'post') {
    return API.post(apiName, path, userInit);
  } else if (method == 'get') {
    return API.get(apiName, path, userInit);
  } else if (method == 'put') {
    return API.put(apiName, path, userInit);
  } else if (method == 'delete') {
    return API.del(apiName, path, userInit);
  } else {
    return null;
  }
}

export const ManimeApiTest = (method, path, body=undefined, header=undefined) => {
  const apiName = API_MANIME_TEST;
  const userInit = {
    body,
    headers: { 
      'Content-Type': 'application/json' ,
      'x-api-key': config.aws.api.ManimeApi.apiKey,
      ...header
    }
  };
  if (method == 'post') {
    return API.post(apiName, path, userInit);
  } else if (method == 'get') {
    return API.get(apiName, path, userInit);
  } else if (method == 'put') {
    return API.put(apiName, path, userInit);
  } else if (method == 'delete') {
    return API.del(apiName, path, userInit);
  } else {
    return null;
  }
}
export const ManimeApiCached = (method, path, body=undefined, header=undefined) => {
  const apiName = API_MANIME_CACHED;
  const userInit = {
    body,
    headers: { 
      'Content-Type': 'application/json' ,
      'x-api-key': config.aws.api.ManimeApi.apiKey,
      ...header
    }
  };

    return API.get(apiName, path, userInit);

}

export const updateUserColumn = async (userId, columnName, columnValue) => {
  // TODO: check later
  return await ManimeApi('post', `/users/update/column`, {
    columnName,
    columnValue,
    userId
  });
};

export const getNailProductByName = async name =>{
  const result = await ManimeApiCached('get', `/nailproducts/read?filter=name eq ${name}`);
  log.verbose("getNailProductByName")
  if (result ) {

    const product = result[0]
    const images = [product?.picuri1, product?.picuri2, product?.picuri3, product?.picuri4, product?.picuri5]
    .filter(picuri => picuri);
    // .map(picuri => (picuri || '').split('?v=')[0]),
    const tags = (product.tags || '').split(', ');

    product.tags = tags;
    product.images = images;
    if(product.extraJsonFields){
      product.extraFields = JSON.parse(product.extraJsonFields);
    }

    return product;
  }
  return null;  
}

export const getNailProductByKeyValue = async (key, value) =>{
  const result = await ManimeApiCached('get', `/nailproducts/read?filter=${key} eq ${value}`);
  log.verbose("getNailProductByHandle")
  if (result ) {

    const product = result[0]
    const images = [product.picuri1, product.picuri2, product.picuri3, product.picuri4, product.picuri5]
    .filter(picuri => picuri);
    // .map(picuri => (picuri || '').split('?v=')[0]),
    const tags = (product.tags || '').split(', ');

    product.tags = tags;
    product.images = images;
    if(product.extraJsonFields){
      product.extraFields = JSON.parse(product.extraJsonFields);
    }

    return product;
  }
  return null;  
}

export const getNailProductsByType = async  type => {

  try{
    const result = await ManimeApiCached('get', `/nailproducts/read?filter=product_type eq ${type}&sort=sortOrderShopPage desc`);
    const products = [];
    if (result ) {
  
      result.map(product => {
  
        const images = [product.picuri1, product.picuri2, product.picuri3, product.picuri4, product.picuri5]
        .filter(picuri => picuri);
        // .map(picuri => (picuri || '').split('?v=')[0]),
        const tags = (product.tags || '').split(', ');
    
        product.tags = tags;
        product.images = images;
        if(product.extraJsonFields){
          product.extraFields = JSON.parse(product.extraJsonFields);
        }
        products.push(product)
      })
  
  
      return products;
    }
    return null;    
  }catch(err){
    log.error(`[lambdaFunctions][getNailProductsByType] ` + err, {err, type})
  }

}

export const getNailProductWithId = async (nailProductId, isProduction=true) => {
  const products = (await getNailProducts())
    .filter(product => product.nailproductid === nailProductId);
  return products?.length === 1 ? products[0] : null;
}

// export const getNailProductWithId = async nailProductId => {
//   const result = await ManimeApiCached('get', `/nailproducts/read?filter=nailProductId eq ${nailProductId}`);
//   if (result && result.length === 1) {
//     if(result[0].extraJsonFields){
//       result[0].extraFields = JSON.parse(result[0].extraJsonFields);
//     }
//     return result[0];
//   }
//   return null;
// };

export const getNailProductWithVariantId = async (variantId, isProduction=true) => {
  const products = (await getNailProducts())
    .filter(product => product.variant_id === variantId);
  return products?.length === 1 ? products[0] : null;
}

// export const getNailProductWithVariantId = async variantId => {
//   const result = await ManimeApiCached('get', `/nailproducts/read?filter=variantId eq ${variantId}`);
//   if (result && result.length === 1) {
//     if(result[0].extraJsonFields){
//       result[0].extraFields = JSON.parse(result[0].extraJsonFields);
//     }
//     return result[0];
//   }
//   return null;
// };

const getLiveProduct = async variantId => {
  const result = await ManimeApi('get', `/nailproducts/read?filter=variantId eq ${variantId}`);
  if (result && result.length === 1) {
    if(result[0].extraJsonFields){
      result[0].extraFields = JSON.parse(result[0].extraJsonFields);
    }
    return result[0];
  }
  return null;
};

// export const getLiveProducts = async (productIds) =>
//   await Promise.all(productIds.map(getLiveProduct));
export async function getLiveProducts(productIds){
  const promises= [];

  productIds.forEach( product => {
    promises.push(
      getLiveProduct(product)
    )
  })

  return await Promise.all(promises)
}

export const getArchiveProducts = async (isProduction=true) => 
  (await getNailProducts()).filter(isArchived);
// export const getArchiveProducts = async (isProduction=true) => {
  // const result = await ManimeApiCached('get', `/nailproducts/read?filter=isArchived eq 1&sort=sortOrderWhatsNewPage desc`);
  // return result;
// };

export const createWaitlistRequests  = async waitlistRequest => {
  const result = await ManimeApi('post', `/waitlistRequests`, waitlistRequest);
  return result;
};

const excludeEnvSpecificProducts = product => !removingProductIds.includes(product?.nailProductId);
const onlyDefinedImages = product => [product.picuri1, product.picuri2, product.picuri3, product.picuri4, product.picuri5].filter(picuri => picuri);
const tagsAsArray = product => (product.tags || '').split(', ');
const extraFieldData = product => product.extraJsonFields && JSON.parse(product.extraJsonFields);
const isArchived = product => product.isArchived

const productionVisibleAsOf = filterDate => product => 
  product.visible && (!product.releaseDate || product.releaseDate <= filterDate);
const nonProductionVisible = product => product.visible || product.releaseDate;

export const getNailProducts = async () => {
  const isProduction = constants.isProduction();

  log.verbose('nail product is ' + encodeURI(`/nailproducts/read?sort=sortOrderShopPage asc`))
  let result = await ManimeApiCached('get', encodeURI(`/nailproducts/read?sort=sortOrderShopPage asc`));

  const filterDate = (new Date()).toISOString();
  const productionVisible = productionVisibleAsOf(filterDate);

  result = result.filter(excludeEnvSpecificProducts)
    .map(product => ({
      ...product,
      tags: tagsAsArray(product),
      images: onlyDefinedImages(product),
      extraFields: extraFieldData(product),
  }))
    .filter(isProduction ? productionVisible : nonProductionVisible);

  return result;
};

export const addCredits = async (userId, credits, description, category) => {
  let additionalData = {
    description,
    category
  };

  const result = await ManimeApi('post', '/users/credits/add', { userId, credits, additionalData });
  return result;
};

const DEFAULT_PROFILE = {
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

export const createProfile = async (profile) => {
  const result = await ManimeApi('post', '/profiles/create', profile);
  return result;
};


export const editProfile = async (profile) => {
  const activeVariant = getFitVersion();
  const lotteryOverride = getLotteryOverride();

  // with more time would be good to add this to redux and only set it on initial mount of the app
  const width = window?.screen?.width * window?.devicePixelRatio;
  const height = window?.screen?.height * window?.devicePixelRatio
  const scaleFactor = window?.devicePixelRatio
  const userAgent = navigator?.userAgent || "";
  var parser = new UAParser(userAgent);
  const metaData = {
    fitVersion: lotteryOverride ? experiments.fitting.variantNames[1] :  activeVariant ,
    vendor: parser.getDevice().vendor,
    model: parser.getDevice().model,
    width, 
    height,
    scaleFactor,
  }
  const result = await ManimeApi('post', '/profiles/patch', { ...profile, metaData});
  return result;
};

export const getProfiles = async userId => {
  const result = await ManimeApi('get', `/profiles/read?filter=userId eq ${userId}`);
  log.verbose('get profile result is ',  result)
  return result;
};

export const getProfileWithId = async profileId => {
  const result = await ManimeApi('get', `/profiles/read?filter=profileId eq ${profileId}`);
  if (result && result.length === 1) {
    return result[0];
  }
  return null;
};

export const removeProfile = async profileId => {
  return await ManimeApi('delete', `/profiles`, {
    profileId
  });
};

export const getProfileOverview = async userId => {
  const result = await ManimeApi('get', `/userData?userId=${userId}`);
  return result;
}

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



// FIXME: UPDATE AFTER FILTERBY
export const getReferralLink = async referralId => {
  // FIXME later : denis touched
  const response = await ManimeApi('get', `/referrals/read?filter=referralId eq ${referralId}` );
  return response;
  // const response = {
  //   referralId: '9e481030-93b4-11e9-bde4-77037da08f23',
  //   sourceId: 'us-west-2:ecdbac47-d489-4cd7-b656-a1c3f026cc05',
  //   type: 'defaultLink',
  //   promotionId: 'defaultPromotion'
  // };
  // return response;
};

export const getReferralsWithIdentityId = async (sourceId, linkType, promotionId) => {
  let path = `/referrals/read?filter=sourceId eq ${sourceId}`
  if (linkType) path += `,type eq ${linkType}`;
  if (promotionId) path += `,promotionId eq ${promotionId}`;
  const response = await ManimeApi('get',  path);
  return response;
}

export const createReferralLink = async (promotionId, sourceId, type) => {
  const referralId = short.generate();
  const userData = { referralId, promotionId, sourceId, type };
  const result = await ManimeApi('post', '/referrals', userData);
  return result;
};

export const retrieveUsersWithReferralId = async referralId => {
  const result = await ManimeApi('get', `/users/read?filter=referralId eq ${referralId}`);
  return result;
};

export const addReferralToUser = async (referralId, sourceId, userId) => {
  const userData = {
    referralId,
    referrerUserId: sourceId,
    referredUserId: userId
  };
  const result = await ManimeApi('post', `/referraltousers/create`, userData);
  return result;
}

export const migrateUserData = async (fromIdentityId, toIdentityId) => {
  const userInit = {
    body: { destination: toIdentityId },
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await API.post('IntegrationProxy', `/migrateuserdata/${fromIdentityId}`, userInit);
  return response;
};

export const createReviewProduct = async ({ productId, userId, title, description, rating, picUri1, picUri2, picUri3, reviewImage }) => {
  const reviewProduct = { nailProductId: productId, userId, title, description, rating, picUri1, picUri2, picUri3 };
  return await ManimeApi('post', '/reviewproducts/create', reviewProduct);
}

export const readProductReviews = async productId => {
  return await ManimeApi('get', `/reviewproducts/read?filter=nailProductId eq ${productId}`);
  // return await ManimeApi('get', `/reviewproducts/read`);
};

export const createReviewOrder = async data => {
  // data should include userId key
  const reviewOrder = data;
  Object.keys(reviewOrder).forEach((key) => (reviewOrder[key] === null) && delete reviewOrder[key]);

  return await ManimeApi('post', '/revieworders/create', reviewOrder);
};

// FIXME: set available votes in the back end
export const setAvailableVotes = async (userId, availableVotes) => {
  return await ManimeApi('post', `/users/update/column`, {
    columnName: 'availableVotes',
    columnValue: availableVotes,
    userId
  });
}

export const editUser = async (user) => {
  const result = await ManimeApi('post', '/users/patch', user);
  return result;
};

export const getVotesByDesigner = async designerId => {
  return await ManimeApiCached('get', `/votes?filter=designerId eq ${designerId}, votes ne 0`);
}

export const getVoteByUserId = async userId => {
  if (!userId) {
    return [];
  }
  return await ManimeApiCached('get', `/votes?filter=userId eq ${userId}, votes ne 0`);
}

export const addVoteDesigner = async (userId, designerId) => {
  return await ManimeApi('post', `/votes`, {
    designerId,
    userId
  });
}

export const changeVotedDesigner = async (userId, designerId) => {
  return await ManimeApi('post', `/delete-all-votes-and-vote`, {
    designerId,
    userId
  });
}

export const removeVoteDesigner = async (userId, designerId) => {
  return await ManimeApi('delete', `/votes`, {
    designerId,
    userId
  });
}

export const getDesigners = async () => {
  return await ManimeApiCached('get', '/designers/read?sort=designerId asc');
}

export const getDesignerWithId = async designerId => {
  return await ManimeApiCached('get', `/designers/read?filter=designerId eq ${designerId}`);
}

export const sendSlackMessage = async (channelName, message) => {
  const body = {channelName, body: message}
  return await ManimeApi('post', `/slack/messages`, body);
};

export const addFitReview = async (body) => {
  return await ManimeApi('post', '/fitreviews/create', body);
};

export const subscribeToKlaviyo = async (email, listId) => {
  const userInit = {
    body: { email, listId },
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await API.post('IntegrationProxy', '/klaviyo/subscribe', userInit);
  return response;
};


export const rotateImage = async (identityId, angle, fileName) => {
  const userInit = {
    body: { identityId, angle, fileName },
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await API.post('IntegrationProxy', '/image/rotate', userInit);
  return response;
};

export const compressImage = async (identityId, quality, fileName) => {
  const userInit = {
    body: { identityId, quality, fileName },
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await API.post('IntegrationProxy', '/image/compress', userInit);
  return response;
};

export const sendEmail = async dynamicData => {
  const userInit = {
    body: { ...dynamicData },
    headers: { 'Content-Type': 'application/json' }
  };

  const response = await API.post('IntegrationProxy', '/email', userInit);
  return response;
  return null;
};

export const sendSMS = async (to, body) => {
  const userInit = {
    body: { to, body },
    headers: { 'Content-Type': 'application/json' }
  };

  const response = await API.post('IntegrationProxy', '/message', userInit);
  log.info(response);
  return response;
};

export const sendSESEmail = async dynamicData => {

  const userInit = {
    body: { ...dynamicData },
    headers: { 'Content-Type': 'application/json' }
  };

  const response = await API.post('IntegrationProxy', '/ses', userInit);
  return response;
};

export const createFunnelUser = async email => {
  const userInit = {
    body: { email },
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await API.post('IntegrationProxy', '/actions', userInit);
  return response;
};

export const addSessionDDB = async (sessionId, referralId) => {
  const userInit = {
    body: { sessionId, referralId },
    headers: { 'Content-Type': 'application/json' }
  };
  // const response = await API.post('IntegrationProxy', '/actions', userInit);
  // return response;
};

export const addSessionActionDDB = async (sessionId, attributeName, attributeValue) => {
  const userInit = {
    body: { sessionId, attributeName, attributeValue },
    headers: { 'Content-Type': 'application/json' }
  };
  // const response = await API.put('IntegrationProxy', '/actions', userInit);
  // return response;
};

export const getShopifyCustomerByEmail = async email => {
  const userInit = {
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await API.get('IntegrationProxy', `/shopify/customer/read/${email}`, userInit);
  return response;
};

/**
 * toggle Shopify customer attribute
 * @param  {[String]}  tagName
 * @return {[Object]}
 */
export const toggleShopifyCustomerAttribute = async (email, tagName) => {
  const userInit = {
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await API.get('IntegrationProxy', `/shopify/customer/read/${email}`, userInit);
  // NOTE:
  if (Array.isArray(response.customers) && response.customers.length > 0) {
    const {
      id,
      tags
    } = response.customers[0];
    // log.info(id, tags);
    const tagArray = typeof tags == 'string' ? tags.split(/[ ,]+/) : [];
    if (tagArray.indexOf(tagName) == -1) tagArray.push(tagName);
    else tagArray.splice(tagArray.indexOf(tagName), 1);
    // log.info(tagArray);
    const newTags = tagArray.join(', ');
    // log.info(newTags);
    const result = await API.post('IntegrationProxy', `/shopify/customer/update`, {...userInit, body: { id, tags: newTags }});
    // log.info(result);

  } else {
    return false;
  }
};

/**
 * add Shopify customer attribute
 * @param  {[String]}  tagName
 * @return {[Object]}
 */
export const addShopifyCustomerAttribute = async (email, tagName) => {
  const userInit = {
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await API.get('IntegrationProxy', `/shopify/customer/read/${email}`, userInit);
  // NOTE:
  if (Array.isArray(response.customers) && response.customers.length > 0) {
    const {
      id,
      tags
    } = response.customers[0];
    log.info(id, tags);
    const tagArray = typeof tags == 'string' ? tags.split(/[ ,]+/) : [];
    if (tagArray.indexOf(tagName) == -1) tagArray.push(tagName);
    else return true;
    log.info(tagArray);
    const newTags = tagArray.join(', ');
    log.info(newTags);
    const result = await API.post('IntegrationProxy', `/shopify/customer/update`, {...userInit, body: { id, tags: newTags }});
    log.info(result);

  } else {
    return false;
  }
};

/**
 * remove Shopify customer attribute
 * @param  {[String]}  tagName
 * @return {[Object]}
 */
export const removeShopifyCustomerAttribute = async (email, tagName) => {
  const userInit = {
    headers: { 'Content-Type': 'application/json' }
  };
  const response = await API.get('IntegrationProxy', `/shopify/customer/read/${email}`, userInit);
  // NOTE:
  if (Array.isArray(response.customers) && response.customers.length > 0) {
    const {
      id,
      tags
    } = response.customers[0];
    log.info(id, tags);
    const tagArray = typeof tags == 'string' ? tags.split(/[ ,]+/) : [];
    if (tagArray.indexOf(tagName) == -1) return true;
    else tagArray.splice(tagArray.indexOf(tagName), 1);
    log.info(tagArray);
    const newTags = tagArray.join(', ');
    log.info(newTags);
    const result = await API.post('IntegrationProxy', `/shopify/customer/update`, {...userInit, body: { id, tags: newTags }});
    log.info(result);

  } else {
    return false;
  }
};


export const checkDiscountCode = async discountCode => {
  try {
    const res = await API.get('IntegrationProxy', `/shopify/discounts/${discountCode}`, undefined);
    return res;
  } catch(error){
    //IN ORDER TO ALWAYS GET PROPER UI WITHOUT ADDITIONAL VALIDATIONS (disabling button etc)
    return {}
  }
}

export const validateImage = async (identityId, image, fileName) => {
  // var bodyFormData = new FormData();
  // bodyFormData.append('l_top', image);
  //
  // const userInit = {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //     // 'Access-Control-Allow-Origin': '*',
  //   },
  //   body: bodyFormData
  // };
  // const response = await API.post('IntegrationProxy', '/process', userInit);
  // log.info(response);
  // return response;

  const bodyFormData = new FormData();
  // bodyFormData.set('l_top', image);
  bodyFormData.append('l_top', image);
  bodyFormData.append('fileName', fileName);

  const body = JSON.stringify({dat: 'dataaa'});

  // return axios({
  //   // url: 'https://imagevalidation.manime.co/process',
  //   url: `http://127.0.0.1:3001/uploadImage/${identityId}`,
  //   method: 'post',
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //     // 'Access-Control-Allow-Origin': '*',
  //   },
  //   bodyFormData
  // });
  return await axios.post(
    `http://127.0.0.1:3001/uploadImage/${identityId}`,
    body,
    {headers: {
      'Content-Type': 'multipart/form-data',
      // 'Access-Control-Allow-Origin': '*',
    }}
  );
};

export const smartyStreetExtract = async addressString => {
  const userInit = {
    body: { addressString },
    headers: { 'Content-Type': 'application/json' }
  };

  return API.post('IntegrationProxy', '/smartystreet/extract', userInit);
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


// FIXME: MAKE RETRY WORK FOR ALL METHODS

// Retry
const API_RETRIES = 7;
const INIT_TIMEOUT = 2000;

function wait(waitTime) {
  return new Promise(resolve => setTimeout(resolve, waitTime));
}

function retryManimePost(path, myInit, waitTime, retry){

  return  ManimeApi('post ',path, myInit).catch(error => {
    // Sentry.captureException(apiName + path);
    log.error(`[lambdaFunctions] / ${path} retryAPI() ${error}`, { myInit, err: error } );
    // logger.error(apiName + path);
    return wait(waitTime).then(() => retryManimePost(path, myInit, waitTime * 2, retry - 1));
  });
   
}

function retryAPI(apiName, path, myInit, waitTime, retry) {
  if (retry < 0) return Promise.reject(apiName + path);

  return API.post(apiName, path, myInit).catch(error => {
    // Sentry.captureException(apiName + path);
    log.error(`[lambdaFunctions] ${apiName} / ${path} retryAPI()`, { myInit } );
    // logger.error(apiName + path);
    return wait(waitTime).then(() => retryAPI(apiName, path, myInit, waitTime * 2, retry - 1));
  });
}


export const getGiftCard = async code => {
  return axios({
    url: `https://api.giftup.app/gift-cards/${code}`,
    method: 'get',
    headers: {
      'Authorization': `bearer ${config.giftCard.apiKey}`,
      'x-giftup-testmode': config.giftCard.testMode,
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': '*',
    },
  })
}

export const redeemGiftCard = async (code, amount, reason) => {
  return axios({
    url: `https://api.giftup.app/gift-cards/${code}/redeem`,
    method: 'post',
    headers: {
      'Authorization': `bearer ${config.giftCard.apiKey}`,
      'x-giftup-testmode': config.giftCard.testMode,
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': '*',
    },
    data: {amount, reason}
  });
}

export const getGiftCardList = async () => {
  return axios({
    url: `https://api.giftup.app/gift-cards`,
    method: 'get',
    headers: {
      'Authorization': `bearer ${config.giftCard.apiKey}`,
      'x-giftup-testmode': config.giftCard.testMode,
      'Content-Type': 'application/json',
    },
  });
}

export const postEmail = async email => {
  const userInit = {
    body: { text: email },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  };

  const response = await API.post(DYNAMO_DB_1, `/todos`, userInit);
  return response;
};

export const sendGridEmailValidation = async email => {
  return axios({
    url: `https://api.sendgrid.com/v3/validations/email`,
    method: 'post',
    headers: {
      'Authorization': `bearer ${config.sendgrid.apiKey}`,
      'Content-Type': 'application/json',
    },
    data: { email }
  });
}

export const getShortenLink = async Url => {
  try {
    const result = await axios({
      url: `${config.endpoints.shortLink}/getLink`,
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {url: Url}
    });
    return result.data;
  } catch (err) {
    return Url;
  }
}

export const upsertPresigned = async (userId, text) => {
  const init = {
    body: { id: userId, text },
    headers: { 'Content-Type': 'application/json' }
  };

  const response = await API.post('PresignedDB', `/presigned`, init);
  log.info(response);
  return response;
};

// export const updatePresigned = async (userId, text) => {
//   const init = {
//     body: { text },
//     headers: { 'Content-Type': 'application/json' }
//   };
//
//   const response = await API.put('PresignedDB', `/presigned/${userId}`, init);
//   return response;
// };

export const getPresigned = async userId => {
  const response = await API.get('PresignedDB', `/presigned/${userId}`, undefined);
  return response;
};

export const upsertEmailCollection = async (userId, text) => {
  const init = {
    body: { id: userId, text },
    headers: { 'Content-Type': 'application/json' }
  };

  const response = await API.post('EmailCollectionDB', `/email`, init);
  // log.info(response);
  return response;
};

export const getRedeemableItem = async id => {
  const response = await API.get('RedeemableItemsDB', `/item/${id}`, undefined);
  return response;
};

export const postRedeemableItem = async (id, text) => {
  const init = {
    body: { id, text },
    headers: { 'Content-Type': 'application/json' }
  };

  const response = await API.post('RedeemableItemsDB', `/item`, init);
  return response;
};


export const sendKlaviyoEmail = async ({templateId='', user={} as any, fromName='ManiMe', fromEmail='ManiMe@manime.co', context={} as any, subject=''}) => {
  var data = {
    subject: subject || 'Subject',
    from_name: fromName,
    from_email: fromEmail,
    to:  [{
      email: user.email,
      name: user.name
    }],
    context: {
      message: (context || {}).message || '',
      sender: (context || {}).sender || '',
      link: (context || {}).link || '',
      name: (context || {}).name || '',
      friend_name: (context || {}).friend_name || ''
    }
  }
   const response = await axios({
    url: `${config.klaviyoTemplate.sendEmailUrl}/${templateId}/render`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data
  })



  try {

    const body = JSON.parse(response.data.body)
    const dynamicData = {
      email: user.email,
      from: fromEmail,
      subject: subject || 'Subject',
      body: body.data.html,
    };
    await sendSESEmail(dynamicData);
  } catch (err) {
    log.error('[lambdaFunctions][sendKlaviyoEmail] error sending  email ' + err, 
      { err },
    );
  }

}
