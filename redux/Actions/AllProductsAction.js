import { SET_ALL_PRODUCTS } from "../constants";

export const allProductsAction = (data) => {
  return {
    type: SET_ALL_PRODUCTS,
    payload: data,
  };
};
