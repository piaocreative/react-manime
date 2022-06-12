import constants from 'constants/index';
import log from 'utils/logging';
import { ManimeApi } from './connections/manimeApi';
import { ManimeApiCached } from './connections/manimeApiCached';

const isTimeForBlackFriday = (nowDate) => {
  const startDate = new Date(constants.getBlackFriday.startDate);
  const endDate = new Date(constants.getBlackFriday.endDate);
  
  if(nowDate>startDate && nowDate<endDate){
    return true;
  }
  return false;
}
const calcDiscountedPrice = (price, percent, decimal = 1) => {
  return +(price * (1 - percent/100)).toFixed(decimal);
}

export const getNailProductByName = async name => {
  const result = await ManimeApiCached('get', `/nailproducts/read?filter=name eq ${name}`);
  log.verbose('getNailProductByName');
  if (result) {
    const product = result[0];
    const images = [
      product?.picuri1,
      product?.picuri2,
      product?.picuri3,
      product?.picuri4,
      product?.picuri5,
    ].filter(picuri => picuri);
    // .map(picuri => (picuri || '').split('?v=')[0]),
    const tags = (product?.tags || '').split(', ');

    product.tags = tags;
    product.images = images;
    if (product.extraJsonFields) {
      product.extraFields = JSON.parse(product.extraJsonFields);
    }

    return product;
  }
  return null;
};

export const getNailProductByKeyValue = async (key, value) => {
  const result = await ManimeApiCached('get', `/nailproducts/read?filter=${key} eq ${value}`);
  log.verbose('getNailProductByHandle');
  if (result) {

    if(isTimeForBlackFriday(new Date())){
      result[0].compareAtPrice = result[0]?.price.toString();
      result[0].price = calcDiscountedPrice(result[0].price, constants.getBlackFriday.discountPercent, 1);
    }

    const product = result[0];
    const images = [
      product.picuri1,
      product.picuri2,
      product.picuri3,
      product.picuri4,
      product.picuri5,
    ].filter(picuri => picuri);
    // .map(picuri => (picuri || '').split('?v=')[0]),
    const tags = (product.tags || '').split(', ');

    product.tags = tags;
    product.images = images;
    if (product.extraJsonFields) {
      product.extraFields = JSON.parse(product.extraJsonFields);
    }

    return product;
  }
  return null;
};

export const getNailProductsByType = async type => {
  try {
    const result = await ManimeApiCached(
      'get',
      `/nailproducts/read?filter=product_type eq ${type}&sort=sortOrderShopPage desc`
    );
    const products = [];
    if (result) {
      result.map(product => {
        const images = [
          product.picuri1,
          product.picuri2,
          product.picuri3,
          product.picuri4,
          product.picuri5,
        ].filter(picuri => picuri);
        // .map(picuri => (picuri || '').split('?v=')[0]),
        const tags = (product.tags || '').split(', ');

        product.tags = tags;
        product.images = images;
        if (product.extraJsonFields) {
          product.extraFields = JSON.parse(product.extraJsonFields);
        }
        products.push(product);
      });

      if(isTimeForBlackFriday(new Date())){
        products.forEach(entry => {
            entry.compareAtPrice = entry?.price.toString();
            entry.price = calcDiscountedPrice(entry.price, constants.getBlackFriday.discountPercent, 1);
        });
      }

      return products;
    }
    return null;
  } catch (err) {
    log.error(`[lambdaFunctions][getNailProductsByType] ` + err, { err, type });
  }
};

export const getNailProductWithId = async nailProductId => {
  const result = await ManimeApiCached(
    'get',
    `/nailproducts/read?filter=nailProductId eq ${nailProductId}`
  );
  if (result?.length === 1) {
    if (result[0].extraJsonFields) {
      result[0].extraFields = JSON.parse(result[0].extraJsonFields);
    }

    if(isTimeForBlackFriday(new Date())){
      result[0].compareAtPrice = result[0]?.price.toString();
      result[0].price = calcDiscountedPrice(result[0].price, constants.getBlackFriday.discountPercent, 1);
    }

    return result[0];
  }
  return null;
};

export const getNailProductWithVariantId = async variantId => {
  const result = await ManimeApiCached(
    'get',
    `/nailproducts/read?filter=variantId eq ${variantId}`
  );
  if (result?.length === 1) {
    if (result[0].extraJsonFields) {
      result[0].extraFields = JSON.parse(result[0].extraJsonFields);
    }
    let timerState = false;
    if(isTimeForBlackFriday(new Date())){
      result[0].compareAtPrice = result[0]?.price.toString();
      result[0].price = calcDiscountedPrice(result[0].price, constants.getBlackFriday.discountPercent, 1);
    }

    return result[0];
  }
  return null;
};

export const getLiveProductByHandle = async handle => {
  let result = await ManimeApi('get', `/nailproducts/read?filter=shopifyHandle eq ${handle}`);
  if (result?.length === 1) {
    if (result[0].extraJsonFields) {
      result[0].extraFields = JSON.parse(result[0].extraJsonFields);
    }

    let timerState = false;
    if(isTimeForBlackFriday(new Date())){
      result[0].compareAtPrice = result[0]?.price.toString();
      result[0].price = calcDiscountedPrice(result[0].price, constants.getBlackFriday.discountPercent, 1);
    }
    
    return result[0];
  }
  return null;
};

const getLiveProduct = async variantId => {
  const result = await ManimeApi('get', `/nailproducts/read?filter=variantId eq ${variantId}`);
  if (result?.length === 1) {
    if (result[0].extraJsonFields) {
      result[0].extraFields = JSON.parse(result[0].extraJsonFields);
    }

    let timerState = false;
    if(isTimeForBlackFriday(new Date())){
      result[0].compareAtPrice = result[0]?.price.toString();
      result[0].price = calcDiscountedPrice(result[0].price, constants.getBlackFriday.discountPercent, 1);
    }
    
    return result[0];
  }
  return null;
};

export async function getLiveProducts(productIds) {
  const promises = [];

  productIds.forEach(product => {
    promises.push(getLiveProduct(product));
  });

  return await Promise.all(promises);
}

export const getArchiveProducts = async () => {
  const result = await ManimeApiCached(
    'get',
    `/nailproducts/read?filter=isArchived eq 1&sort=sortOrderWhatsNewPage desc`
  );
  return result;
};

export const createWaitlistRequests = async waitlistRequest => {
  const result = await ManimeApi('post', `/waitlistRequests`, waitlistRequest);
  return result;
};

export const filterDate = () => Date.now();

export const inProduction = product =>
  product?.visible && (!product?.releaseDate || Date.parse(product?.releaseDate) <= filterDate());

export const inDevelopment = product =>
  product?.visible || Date.parse(product?.releaseDate) > filterDate();

export const getNailProducts = async () => {
  log.verbose('getNailProducts');
  const isProduction = constants.isProduction();

  log.verbose('nail product is ' + encodeURI(`/nailproducts/read?sort=sortOrderShopPage asc`));
  let result = await ManimeApiCached(
    'get',
    encodeURI(`/nailproducts/read?sort=sortOrderShopPage asc`)
  );

  const allProducts = result.map(product => ({
    ...product,
    images: [
      product.picuri1,
      product.picuri2,
      product.picuri3,
      product.picuri4,
      product.picuri5,
    ].filter(picuri => picuri),
    tags: (product.tags || '').split(', '),
    extraFields: product?.extraJsonFields && JSON.parse(product?.extraJsonFields),
  }));

  const products = allProducts.filter(isProduction ? inProduction : inDevelopment);
  log.verbose({ at: 'getNailProducts', length: products.length });
  
  if(isTimeForBlackFriday(new Date())){
    products.forEach(entry => {
        entry.compareAtPrice = entry?.price.toString();
        entry.price = calcDiscountedPrice(entry.price, constants.getBlackFriday.discountPercent, 1);
    });
  }

  return products;
};

export const createReviewProduct = async ({
  productId,
  userId,
  title,
  description,
  rating,
  picUri1,
  picUri2,
  picUri3,
  reviewImage,
}) => {
  const reviewProduct = {
    nailProductId: productId,
    userId,
    title,
    description,
    rating,
    picUri1,
    picUri2,
    picUri3,
  };
  return await ManimeApi('post', '/reviewproducts/create', reviewProduct);
};

export const readProductReviews = async productId => {
  return await ManimeApi('get', `/reviewproducts/read?filter=nailProductId eq ${productId}`);
  // return await ManimeApi('get', `/reviewproducts/read`);
};
