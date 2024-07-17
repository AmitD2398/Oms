import { SET_CART_ITEM_COUNT } from "../constants";

const initialState = {
  cartItemCount: 0,
};

const cartItemsCountReducer = (state = initialState, action) => {
  // console.log("setTokenReducerHITTTT>>", action.payload);
  switch (action.type) {
    case SET_CART_ITEM_COUNT:
      return { ...state, cartItemCount: action.payload };
    default:
      return state;
  }
};

export default cartItemsCountReducer;
