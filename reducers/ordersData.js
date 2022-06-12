const initialState = {};
// TODO:
//we still need to figure out when and where to set the current orderId since it's key for the whole implementation
//maybe we should have a list with all the orders and once you click on an order you wish to give a review for on this onclick event
//we can set it in the redux state and then get it inside the Review components from there.. just an idea how we could implement the whole solution
//up for discussion :)

const ordersData = (state = initialState, action) => {
  // log.info("action : ", action);
  switch (action.type) {
    case "SET_ORDER_RATING":
      return {
        ...state,
        [action.orderId]: {
          ...state[action.orderId],
          [action.ratingType]: action.ratingValue
        }
      };
    case "CHOOSE_SPECIFIC_FEEDBACK":
      return {
        ...state,
        [action.orderId]: {
          ...state[action.orderId],
          [action.fingerType]: {}
        }
      };
    default:
      return state;
  }
};

export default ordersData;
