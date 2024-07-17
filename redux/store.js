import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./Reducers/RootReducer";

export const store = createStore(rootReducer, applyMiddleware(thunk));
