import { SET_TOKEN } from "../constants";

export const setTokenAction = (data) => {
  // console.log("setTokenActionHITTTT>>", data);
  return {
    type: SET_TOKEN,
    payload: data,
  };
};
