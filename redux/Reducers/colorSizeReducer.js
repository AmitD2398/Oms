import { SET_ALL_COLOR_SIZE } from "../constants";

const initialState = {
  color_Size: [],
};

const colorSizeReducer = (state = initialState, action) => {
  // console.log("setTokenReducerHITTTT>>", action.payload);
  switch (action.type) {
    case SET_ALL_COLOR_SIZE:
      return { ...state, color_Size: action.payload };
    default:
      return state;
  }
};

export default colorSizeReducer;
