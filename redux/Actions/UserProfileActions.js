import {
  SET_PROFILE_DATA,
  SET_PROFILE_IMAGE,
  SET_REGISTERED_EMAIL,
  SET_VERIFY_EMAIL,
} from "../constants";

export const setProfileDataAction = (data) => {
  return {
    type: SET_PROFILE_DATA,
    payload: data,
  };
};
export const setProfileImageAction = (data) => {
  return {
    type: SET_PROFILE_IMAGE,
    payload: data,
  };
};

export const setRegisteredEmailAction = (data) => {
  return {
    type: SET_REGISTERED_EMAIL,
    payload: data,
  };
};

export const setVerifyEmailAction = (data) => {
  return {
    type: SET_VERIFY_EMAIL,
    payload: data,
  }
}