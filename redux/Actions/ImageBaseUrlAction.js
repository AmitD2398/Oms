import { SET_IMAGE_BASE_URL } from "../constants";

export const imageBaseUrlAction = (data) => {
  return {
    type: SET_IMAGE_BASE_URL,
    payload: data,
  };
};
