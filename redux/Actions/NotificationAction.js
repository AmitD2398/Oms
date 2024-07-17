import { SET_NOTIFICATION_COUNT } from "../constants";

export const notificationCountAction = (data) => {
  return {
    type: SET_NOTIFICATION_COUNT,
    payload: data,
  };
};
