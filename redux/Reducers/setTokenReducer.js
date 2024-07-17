import { SET_TOKEN } from "../constants";

const initialState = {
  token: null,
};

const tokenReducer = (state = initialState, action) => {
  // console.log("setTokenReducerHITTTT>>", action.payload, action.type);
  switch (action.type) {
    case SET_TOKEN:
      return { ...state, token: action.payload };
    default:
      return state;
  }
};

export default tokenReducer;
