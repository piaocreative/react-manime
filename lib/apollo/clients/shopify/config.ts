import config from '../../../../config';
const types = require( './possibleTypes');
export default {
  headers: {"X-Shopify-Storefront-Access-Token": config.shopify.storefrontAccessToken},
  possibleTypes: types['__schema'].types,
  uri: config.shopify.graphQLDomain
}