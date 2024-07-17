import { SET_ALL_PRODUCTS } from "../constants";

const initialState = {
  allProducts: null,
};

const allProductsReducer = (state = initialState, action) => {
  // console.log("setTokenReducerHITTTT>>", action.payload);
  switch (action.type) {
    case SET_ALL_PRODUCTS:
      return { ...state, allProducts: action.payload };
    default:
      return state;
  }
};

export default allProductsReducer;
