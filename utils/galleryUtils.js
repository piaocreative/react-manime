export const compareByPrice = (a, b) => {
  return parseFloat(a.price) < parseFloat(b.price) ? -1 : 1;
};

export const compareByPriceDec = (a, b) => {
  return parseFloat(a.price) > parseFloat(b.price) ? -1 : 1;
};

export const compareBySortOrderShopPage = (a, b) => {
  return parseFloat(a.sortOrderShopPage) > parseFloat(b.sortOrderShopPage) ? 1 : -1;
};

export const compareByIndex = (a, b) => {
  return parseFloat(a.originIndex) > parseFloat(b.originIndex) ? 1 : -1;
};

export const compareByCreatedAt = (a, b) => {
  return a.sortOrderWhatsNewPage < b.sortOrderWhatsNewPage ? 1 : -1;
};

export const compareByReleaseDate = (a, b) => {
  return new Date(a.releaseDate) < new Date(b.releaseDate) ? 1 : -1;
};

export const sortByList = [
  { label: 'Featured', comp: compareBySortOrderShopPage },
  // {label: 'Featured', comp: compareByIndex},
  { label: 'Price: Low to high', comp: compareByPrice },
  { label: 'Price: High to low', comp: compareByPriceDec },
];

export const hasAnImage = product => product?.images?.[0];

export const hasTag = tag => product => product.tags.includes(tag);

export const isInStock = product =>
  parseInt(product.quantity || 0) > product.quantity > 0 + process.env.OUT_OF_STOCK_THRESHOLD;

export const isNotArchived = product => !product.isArchived;

export const noAction = _ => true;

export const ofType = productType => product => !productType || product.productType === productType;

export function productMatchesFilters(product, filters) {
  const productTags = product?.tags;
  if (filters.length === 0) return false;
  if (!Array.isArray(productTags)) return false;

  const colorFilters = filters.filter(filters => filters.color);
  const styleFilters = filters.filter(filters => !filters.color);
  const colorNotMatch = !colorFilters.find(item => productTags.includes(item.tag));
  const styleNotMatch = !styleFilters.find(item => productTags.includes(item.tag));

  return (colorFilters.length > 0 && colorNotMatch) || (styleFilters.length > 0 && styleNotMatch);
}
