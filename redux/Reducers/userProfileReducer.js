import {
  SET_PROFILE_DATA,
  SET_PROFILE_IMAGE,
  SET_REGISTERED_EMAIL,
  SET_VERIFY_EMAIL,
} from "../constants";

const initialState = {
  name: null,
  email: null,
  verifyEmail: null,
  mobile: null,
  address: null,
  advisorCode: null,
  dateOfJoin: null,
  profilePic: null,
  profilePicExist: null,
  membershipPaidStatus: null,
  membershipPaymentStatus: null,
  referralCode: null,
  icardUrl: null,
};

const userProfileReducer = (state = initialState, action) => {
  // console.log("userProfileReducer>>>>>>>>", action.type);
  switch (action.type) {
    case SET_PROFILE_DATA:
      return action.payload; ////
    case SET_PROFILE_IMAGE:
      return {
        ...state,
        profilePicExist: action.payload.profilePicExist,
        profilePic: action.payload.profilePic,
      }; ////
    case SET_REGISTERED_EMAIL:
      return {
        ...state,
        email: action.payload,
      }; ////
    case SET_VERIFY_EMAIL:
      return {
        ...state,
        verifyEmail: action.payload,
      }; ////
    default:
      return state;
  }
};

export default userProfileReducer;
