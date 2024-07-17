import { SET_IMAGE_BASE_URL } from "../constants";

const initialState = {
  imageBaseUrl: null,
};

const imageBaseUrlReducer = (state = initialState, action) => {
  // console.log("setTokenReducerHITTTT>>", action.payload);
  switch (action.type) {
    case SET_IMAGE_BASE_URL:
      return { ...state, imageBaseUrl: action.payload };
    default:
      return state;
  }
};

export default imageBaseUrlReducer;
