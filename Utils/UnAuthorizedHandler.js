import { CommonActions } from "@react-navigation/native";
import { showToastWithGravity } from "../components/Common/SnackBar";
import { clearTokenFromStorage } from "../Utils/AsyncStorageHelper";
import { setTokenAction } from "../redux/Actions/SetTokenAction";
import { cartItemCountAction } from "../redux/Actions/CartItemsCountAction";
// import { useSelector, useDispatch } from "react-redux";

export const unAuthorizedHandler = (res, navigation, dispatch) => {
  // const dispatch = useDispatch();
  showToastWithGravity(res?.message ? res?.message : res?.data);
  dispatch(setTokenAction(null));
  // dispatch(cartItemCountAction(0));
  clearTokenFromStorage().then(() =>
    navigation.navigate("Login", { Unauthorized: true })
  );
  // navigation.dispatch(
  //   CommonActions.reset({
  //     index: 0,
  //     routes: [
  //       {
  //         name: "Login",
  //         params: {
  //           Unauthorized: true,
  //         },
  //       },
  //     ],
  //   })
  // );
  // navigation.push("Login", { Unauthorized: true });
};
