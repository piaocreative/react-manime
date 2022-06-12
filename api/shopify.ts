import { IntegrationProxy } from './connections/integrationProxy';
import log from 'utils/logging'

export const getShopifyCustomerByEmail = async email => {

  const response = await IntegrationProxy('get', `/shopify/customer/read/${email}`);
  return response;
};

/**
 * toggle Shopify customer attribute
 * @param  {[String]}  tagName
 * @return {[Object]}
 */
export const toggleShopifyCustomerAttribute = async (email, tagName) => {

  const response = await IntegrationProxy('get', `/shopify/customer/read/${email}`);
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
    const result = await IntegrationProxy('post', `/shopify/customer/update`, {body: { id, tags: newTags }});
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

  const response = await IntegrationProxy('get', `/shopify/customer/read/${email}`);
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
    const result = await IntegrationProxy('post', `/shopify/customer/update`, { body: { id, tags: newTags }});
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

  const response = await IntegrationProxy('get', `/shopify/customer/read/${email}`);
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
    const result = await IntegrationProxy('post', `/shopify/customer/update`, {body: { id, tags: newTags }});
    log.info(result);

  } else {
    return false;
  }
};

