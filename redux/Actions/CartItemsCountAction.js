import { SET_CART_ITEM_COUNT } from "../constants";

export const cartItemCountAction = (data) => {
  return {
    type: SET_CART_ITEM_COUNT,
    payload: data,
  };
};
