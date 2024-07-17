import { SET_ALL_COLOR_SIZE } from "../constants";

export const colorSizeAction = (data) => {
  return {
    type: SET_ALL_COLOR_SIZE,
    payload: data,
  };
};
