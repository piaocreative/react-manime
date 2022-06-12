const initialState = {
  products: [],
  productsMap: {},
}

const productsData = (state = initialState, action) => {
  const newState = {...state}
  switch (action.type) {
    
    case 'SET_PRODUCTS_DATA':
      newState.products = [...action.products]
      return newState
    case 'SET_PRODUCTS_MAP':
      newState.productsMap = {...action.productsMap}
      return newState
    case 'UPDATE_PRODUCT_MAP':
      newState.productsMap = { ...newState.productsMap, ...action.productsMap}
      return newState;
    default:
      return state;
  }
};

export default productsData;
