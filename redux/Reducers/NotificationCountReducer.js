import { SET_NOTIFICATION_COUNT } from "../constants";

const initialState = {
  notifCount: 0,
};

const notificationCountReducer = (state = initialState, action) => {
  // console.log("kycStatusReducer>>>>>>>>", action.type);
  switch (action.type) {
    case SET_NOTIFICATION_COUNT:
      return {
        ...state,
        notifCount: action.payload,
      };
    default:
      return state;
  }
};

export default notificationCountReducer;
