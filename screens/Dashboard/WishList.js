import { Text, View, StyleSheet, Image, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import ScrollingTabsComponent from "../../components/Wishlist/ScrollingTabsComponent";
import ItemsList from "../../components/Wishlist/ItemsList";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector, useDispatch } from "react-redux";
import {
  USER_WISHLIST_URL,
  ADD_TO_CART_URL,
  ADD_TO_WISHLIST_URL,
} from "../../Utils/ApiUrlConstants";
import { fetchUrl } from "../../Utils/FetchHelper";
import Loader from "../../components/Common/LoaderModal";
import { unAuthorizedHandler } from "../../Utils/UnAuthorizedHandler";
import NoRecordFoundComponent from "../../components/Common/NoRecordFoundComponent";
import { showToastWithGravity } from "../../components/Common/SnackBar";
import {
  setObjectInStorage,
  getObjectFromStorage,
} from "../../Utils/AsyncStorageHelper";
import { useFocusEffect } from "@react-navigation/native";

export default function WishList({ navigation }) {
  const { token } = useSelector((state) => state.tokenReducer);
  const dispatch = useDispatch();

  const [loader, setLoader] = useState(true);
  const [emptyModal, setEmptyModal] = useState(false);
  const [wishListData, setWishListData] = useState([]);
  const [allFromAsyncStorage, setAllFromAsyncStorage] = useState([]);
  const [fromAsyncCart, setFromAsyncCart] = useState([]);

  useEffect(() => {
    wishlistDataApi();
    getObjectFromStorage("_cartArray").then((result) => {
      if (result) {
        // console.log("resultFromStorage", result);
        setAllFromAsyncStorage(result);
      }
    });
    // return () => alert("Unmount");
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      return () => setEmptyModal(false);
    }, [])
  );

  const WishlistDataParams = {
    vendor_id: 4, //will have to set dynamically
  };
  const wishlistDataApi = () => {
    // setLoader(true);
    fetchUrl(WishlistDataParams, token, USER_WISHLIST_URL)
      .then((resJson) => {
        ////////////////////
        setLoader(false);
        // console.log("WISHLIST_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          // console.log("accessToken", resJson?.data?.login_token?.token);
          setWishListData(resJson?.wishlist);
        } else if (resJson?.status == 400) {
          showToastWithGravity(resJson?.message);
        } else if (resJson?.status == 404) {
          setWishListData([]);
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("WISHLIST_Error::", error);
      });
  };
  let addToCartParams = {
    request: [
      {
        id: "6059", //product_id
        selectedQuantity: "1", //quantity
        pp_id: "20893", //product_price_id
        vendor_id: "13", //vendor_id
      },
    ],
  };

  const removeFromWishlistApi = (wishlistParams) => {
    // console.log("wishlistParams>>", wishlistParams);
    setLoader(true);
    fetchUrl(wishlistParams, token, ADD_TO_WISHLIST_URL)
      .then((resJson) => {
        ////////////////////
        // setLoader(false);
        // console.log("REMOVEFROMWISHLIST_Error_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          showToastWithGravity(resJson?.message);
          // from == "Dashboard" ? viewAllProductsApi() : subCatAllProductsApi();
          setTimeout(() => {
            wishlistDataApi(); //////////
          }, 200);
        } else if (resJson?.status == 400) {
          showToastWithGravity(resJson?.message); 
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("REMOVEFROMWISHLIST_Error::", error);
      });
  };

  // const addCartProductsInAsyncStorage = (AddNewItem) => {
  //   ///////////
  //   ///// Get items already IN Storage//////////////
  //   // getObjectFromStorage("_cartArray").then((result) => {
  //   //   if (result) {
  //   //     console.log("resultFromStorage", result);
  //   //     setFromAsyncCart(result);
  //   //   }
  //   // });
  //   let CartArrayToBeStored = {
  //     id: AddNewItem?.product_id, //product_id
  //     pp_id: AddNewItem?.pp_id,
  //     vendor_id: AddNewItem?.vendor_id,
  //     selectedQuantity: "1",
  //     // color: "Default",
  //     // size: "No Size",
  //     color: "Black",
  //     size: "XL",
  //   };
  //   ///////////////////////////////////
  //   setAllFromAsyncStorage([...allFromAsyncStorage, CartArrayToBeStored]); //set all in state for local check
  //   ////////////
  //   ////////set new in asyncStorage with already In storage////
  //   let toBeStoredArray = [...allFromAsyncStorage, CartArrayToBeStored];
  //   // console.log("toBeStoredArrayFinal", toBeStoredArray);
  //   const isStored = setObjectInStorage("_cartArray", toBeStoredArray);
  //   // console.log("llllllllllllll");
  //   if (isStored) {
  //     showToastWithGravity("Added to cart");
  //   }
  //   ////////////////////////////
  // };

  // const checkAlreadyInAsyncStore = (checkProductData) => {
  //   let isPresent = allFromAsyncStorage?.find(
  //     (item) =>
  //       item?.id == checkProductData?.product_id &&
  //       item?.pp_id == checkProductData?.pp_id &&
  //       item?.vendor_id == checkProductData?.vendor_id
  //   );
  //   // console.log(
  //   //   "checkAlreadyInAsyncStore",
  //   //   isPresent,
  //   //   "===",
  //   //   allFromAsyncStorage
  //   // );
  //   if (isPresent) return true;
  //   return false;
  // };

  return (
    <ScreenWrapper>
      <View style={styles.headerView}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image
            resizeMode="contain"
            style={styles.backButton}
            source={require("../../assets/images/backArrow.png")}
          />
        </Pressable>
        <View style={{ width: "50%" }}>
          <Text style={styles.headerText}>Wishlist</Text>
          <Text style={styles.headerSubText}>
            {wishListData?.length != 0
              ? wishListData?.length == 1
                ? "1 item"
                : wishListData?.length + " " + "Items"
              : 0 + " " + "item"}
          </Text>
        </View>
      </View>
      {/* <ScrollingTabsComponent TabsData={TabsData} /> */}
      {wishListData?.length == 0 && loader == false ? (
        <NoRecordFoundComponent />
      ) : (
        <ItemsList
          navigation={navigation}
          listData={wishListData}
          removeFromWishlistApi={removeFromWishlistApi}
          // checkAlreadyInAsyncStore={checkAlreadyInAsyncStore}
          // addCartProductsInAsyncStorage={addCartProductsInAsyncStorage}
        />
      )}
      <Loader loader={loader} setLoader={setLoader} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: "100%",
  },
  backButton: {
    width: 40,
    height: 40,
    marginLeft: 5,
  },
  headerText: {
    fontSize: 18,
    color: "#161B2F",
    fontFamily: "OpenSans-Bold",
    // width: "50%",
  },
  headerSubText: {
    fontSize: 10,
    fontFamily: "OpenSans-Regular",
    color: "161B2F",
  },
  iconsView: {
    flexDirection: "row",
    // justifyContent: 'space-around',
    justifyContent: "flex-end",
    width: "50%",
  },
  favouriteIconView: {
    marginHorizontal: 10,
  },
  ViewIntoScrollView: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
    width: wp(100),
    // paddingBottom: 10,
    // paddingHorizontal: 10,
    // paddingVertical: 10,
    // backgroundColor: 'red',
  },
  favouriteIcon: {
    width: 22,
    height: 22,
    tintColor: "#161B2F",
  },
  bagIcon: {
    width: 20,
    height: 20,
    tintColor: "#161B2F",
  },
  //renderItem style>>>>>>>>>>>>>>>
  itemView: {
    width: "94%",
    height: 150,
    alignSelf: "center",
    // backgroundColor: 'red',
    // overflow: 'hidden',
  },
  itemBackgroundImageStyle: {
    borderRadius: 15,
    borderTopRightRadius: 70,
  },
  itemBackgroundImage: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    //   backgroundColor: '#FFFFFF00',
  },
  itemTextView: {
    alignSelf: "flex-end",
    backgroundColor: "#FFFFFF",
    width: "40%",
    height: "45%",
    borderTopLeftRadius: 70,
    overflow: "hidden",
    paddingTop: 15,
    paddingLeft: 15,
    // padding: 5,
  },
  itemHeadingText: {
    alignSelf: "center",
    fontSize: 16,
    color: "#161B2F",
    fontFamily: "OpenSans-Bold",
  },
  itemDescText: {
    fontSize: 12,
    color: "#646464",
    fontFamily: "OpenSans-Regular",
  },
});
