import { combineReducers } from "redux";

import tokenReducer from "./setTokenReducer";
import imageBaseUrlReducer from "./ImageBaseUrlReducer";
import userProfileReducer from "./userProfileReducer";
import notificationCountReducer from "./NotificationCountReducer";
import cartItemsCountReducer from "./CartItemsCountReducer";
import allProductsReducer from "./AllProductsReducer";
import colorSizeReducer from "./colorSizeReducer";

const rootReducer = combineReducers({
  // changeTheNumber,
  tokenReducer,
  imageBaseUrlReducer,
  cartItemsCountReducer,
  userProfileReducer,
  allProductsReducer,
  colorSizeReducer
  // notificationCountReducer,
});
// const rootReducer = (state, action) => {
//   if (action.type === "RESET_APP") {
//     state = undefined;
//   }
//   return allReducers(state, action);
// };
export default rootReducer;
