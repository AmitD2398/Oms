import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  RefreshControl,
  BackHandler,
  Alert,
  ToastAndroid,
  Platform,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import CheckOutScrollComponent from "../../components/Dashboard/CheckOutScrollComponent";
import ScrollingTabsComponent from "../../components/Dashboard/ScrollingTabsComponent";
import NowOrNeverComponent from "../../components/Dashboard/NowOrNeverComponent";
import NewCollectionComponent from "../../components/Dashboard/NewCollectionComponent";
import BringItHomeAutoSlider from "../../components/Dashboard/BringItHomeAutoSlider";
import ShopTillYouDropComponent from "../../components/Dashboard/ShopTillYouDropComponent";
import KnockOutDealsComponent from "../../components/Dashboard/KnockOutDealsComponent";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/Common/LoaderModal";
import {
  setItemInStorage,
  getObjectFromStorage,
  getItemFromStorage,
  clearTokenFromStorage,
} from "../../Utils/AsyncStorageHelper";
import { fetchUrl } from "../../Utils/FetchHelper";
import { DASHBOARD_URL, All_PRODUCTS_URL } from "../../Utils/ApiUrlConstants";
import { showToastWithGravity } from "../../components/Common/SnackBar";
import { cartItemCountAction } from "../../redux/Actions/CartItemsCountAction";
import { imageBaseUrlAction } from "../../redux/Actions/ImageBaseUrlAction";
import { useFocusEffect } from "@react-navigation/native";
import { unAuthorizedHandler } from "../../Utils/UnAuthorizedHandler";
import LogoutExitModalAlert from "../../components/Common/LogoutExitModalAlert";
import { setRegisteredEmailAction } from "../../redux/Actions/UserProfileActions";
import { allProductsAction } from "../../redux/Actions/AllProductsAction";
import { setTokenAction } from "../../redux/Actions/SetTokenAction";
// import { Pages } from "react-native-pages";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
// import PushNotification,{Importance} from "react-native-push-notification";

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};
let flatlistRef = React.createRef();

// PushNotification.createChannel(
//   ///for Local Push Notification
//   {
//     channelId: "106237949789", // (required)
//     channelName: "Skyon Shop", // (required)
//     channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
//     playSound: true, // (optional) default: true
//     soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
//     importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
//     vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
//   },
//   //  (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
// );

Notifications.setNotificationHandler({
  //for listen
  handleNotification: async () => ({
    shouldShowAlert: false, // true for remote notifications in foreground mode
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
export default function Dashboard({ navigation, route: { params } }) {
  // PushNotification.configure({
  //   //on tap local notification/////////////////
  //   onNotification: function (notification) {
  //     console.log("onNotification", notification);
  //     console.log("onNotification Amit", notification?.data);
  //     // ToastAndroid.show('onNotification', 3000);
  //     if (notification?.data?.redirect == 1) {
  //       navigation.navigate("Notifications");
  //     } else if (notification?.data?.redirect == 2) {
  //       navigation.navigate("MyOrders");
  //     } else if (notification?.data?.redirect == 3) {
  //       navigation.navigate("Dashboard");
  //     } else {
  //       navigation.navigate("Dashboard");
  //     }
  //   },
  // });
  const { token } = useSelector((state) => state.tokenReducer);
  // console.log("token>>>>>>>>>>>>>>>>>>>>>>>Dashboard", token);
  const { cartItemCount } = useSelector((state) => state.cartItemsCountReducer);
  // const token = null;
  const notificationListener = useRef();
  const responseListener = useRef(); //NOT USED BECAUSE onNotification is handling all mode tap(onPressAction) //

  const [refreshing, setRefreshing] = React.useState(false);

  const [tokenInState, setTokenInState] = useState("");
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(true);

  const [imageBaseUrl, setImageBaseUrl] = useState(null);
  const [checkOutSliderData, setCheckOutSliderData] = useState([]);
  const [topRightSliderData, setTopRightSliderData] = useState({});
  const [middleSliderData, setMiddleSliderData] = useState(null);
  const [bottomSliderData, setBottomSliderData] = useState([]);
  const [totalCartItemCount, setTotalCartItemCount] = useState(0); //////////////////
  const [totalWishlistItemCount, setTotalWishlistItemCount] = useState(0);

  /////Groups Data Showing on TopTabs and in NowOrNEVER
  const [topTabsDataArray, setTopTabsDataArray] = useState([]); //top tabsdata
  const [groupProducts, setGroupProducts] = useState([]); //in NowOrNever section products
  const [groupType, setGroupType] = useState(""); //in NowOrNever section products
  // const [hotProductsArray, setHotProductsArray] = useState([]);
  // const [bestOffersArray, setBestOffersArray] = useState([]);
  // const [topDealArray, setTopDealArray] = useState([]);

  const [newProductsProductsArray, setNewProductsSaleProductsArray] = useState(
    []
  );
  const [featuredProductsArray, setFeaturedSaleProductsArray] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [onSaleProductsArray, setOnSaleProductsArray] = useState([]);

  const [isExitModal, setIsExitModal] = useState(false);

  const [notificationListenCheck, setNotificationListenCheck] = useState(null);
  const [PushnotificationData, setPushNotificationData] = useState({});

  useEffect(() => {
    registerForPushNotificationsAsync();
    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        // setNotification(notification);
        // console.log("addNotificationReceivedListener=====", notification); /////////////
        setNotificationListenCheck(
          notification?.request?.trigger?.remoteMessage?.data?.id
        );
        setPushNotificationData({
          title:
            notification?.request?.trigger?.remoteMessage?.notification?.title,
          message:
            notification?.request?.trigger?.remoteMessage?.notification?.body,
          imageUrl:
            notification?.request?.trigger?.remoteMessage?.notification
              ?.imageUrl,
          redirect:
            notification?.request?.trigger?.remoteMessage?.data?.redirect,
          id: notification?.request?.trigger?.remoteMessage?.data?.id,
        });
        // localNotificationTrigger(
        //   //send local  notification on getting data from remote notification/////////////
        //   notification?.request?.trigger?.remoteMessage?.notification?.title,
        //   notification?.request?.trigger?.remoteMessage?.notification?.body,
        //   notification?.request?.trigger?.remoteMessage?.notification?.imageUrl,
        //   notification?.request?.trigger?.remoteMessage?.data?.redirect
        // );
      });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    //IN THIS PROJECT WORKED ONLY ON FOREGROUND
    // responseListener.current =
    //   Notifications.addNotificationResponseReceivedListener((response) => {
    //     console.log("notificationTapped>>", response);
    //     console.log(
    //       "notificationTapped>>",
    //       response?.notification?.request?.trigger?.remoteMessage?.data
    //         ?.redirect
    //     );
    //     // 1-> redirect to notification detail page,
    //     // 2-> redirect to orders,
    //     // 3-> redirect to dashboard
    //     // navigation.navigate("Notifications");
    //     if (
    //       response?.notification?.request?.trigger?.remoteMessage?.data?.redirect == 1
    //     ) {
    //       navigation.navigate("Notifications");
    //     } else if (
    //       response?.notification?.request?.trigger?.remoteMessage?.data
    //         ?.redirect == 2
    //     ) {
    //       navigation.navigate("MyOrders");
    //     } else if (
    //       response?.notification?.request?.trigger?.remoteMessage?.data
    //         ?.redirect == 3
    //     ) {
    //       navigation.navigate("Dashboard");
    //     } else {
    //       navigation.navigate("Dashboard");
    //     }
    //   });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      // Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const dashboardParams = {
    vendor_id: "4", //"13,"4
  };

  const allProductsApi = () => {
    // setLoader(true);
    fetchUrl({ vendor_id: 4 }, "", All_PRODUCTS_URL)
      .then((resJson) => {
        ////////////////////
        // setLoader(false);
        // console.log("All_PRODUCTS_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          // console.log("accessToken", resJson?.data?.login_token?.token);
          // setWishListData(resJson?.wishlist);

          // setImageBaseUrl(resJson?.data?.imageBaseUrl);
          // setAllProductsData(resJson?.data?.products);
          // setFilteredDataArray(resJson?.data?.products);
          dispatch(allProductsAction(resJson?.data));
        } else if (resJson?.status == 400) {
          // showToastWithGravity(resJson?.message);
        } else if (resJson?.status == 404) {
          // setWishListData([]);
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("All_PRODUCTS_Error::", error);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      // console.log("dashLog::", params);
      if (params?.fromLogin) {
        fetchUrl(
          dashboardParams,
          tokenInState != null ? tokenInState : "",
          // "678236623468372347234820384842",
          DASHBOARD_URL
        )
          .then((resJson) => {
            ////////////////////
            // setRefreshing(false);
            // setLoader(false);
            // console.log("DASHBOARD_result =====", resJson); /////
            // showToastWithGravity(resJson?.message);
            if (resJson?.status == 200) {
              (tokenValue || tokenInState) &&
                getObjectFromStorage("_cartArray").then((result) => {
                  ///////////
                  if (result) {
                    dispatch(
                      cartItemCountAction(
                        Number(result?.length) + Number(resJson?.tot_cart_item)
                      )
                    );
                  }
                });
              // console.log("resJson?.tot_cart_item", resJson?.tot_cart_item);
              // dispatch(cartItemCountAction(resJson?.tot_cart_item)); // update cart item count
            }
          })
          .catch((error) => {
            setLoader(false);
            console.log("DASHBOARD_Error::", error);
          });
      }
      // dashBoardApiFunction();
      /////////////////////////
      //   getItemFromStorage("accessToken").then((res) => {
      //     if (res) {
      //       setTokenInState(res);
      //       console.log("tokenReducer111111111111", res);
      //       setLoader(true);
      //       dashBoardApiFunction(res);
      //     } else {
      //       setLoader(true);
      //       dashBoardApiFunction();
      //     }
      //   });
      //   getItemFromStorage("_regdEmail").then((res) => {
      //     if (res) {
      //       dispatch(setRegisteredEmailAction(res));
      //     }
      //   });

      //hardwareBackPress action
      // dispatch(setTokenAction(token));
      const backAction = () => {
        setIsExitModal(true);
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }, [])
  );
  useEffect(() => {
    // dashBoardApiFunction();
    getItemFromStorage("accessToken").then((res) => {
      if (res) {
        setTokenInState(res);
        // console.log("tokenReducer111111111111", res);
        setLoader(true);
        dashBoardApiFunction(res);
      } else {
        // console.log("notToken", res);
        setTokenInState("");
        setLoader(true);
        dashBoardApiFunction();
      }
    });
    getItemFromStorage("_regdEmail").then((res) => {
      if (res) {
        dispatch(setRegisteredEmailAction(res));
      }
    });
    setTimeout(() => {
      allProductsApi();
    }, 500);
  }, []);
  // useEffect(() => {
  //   // dashBoardApiFunction();
  //   getItemFromStorage("accessToken").then((res) => {
  //     if (res) {
  //       setTokenInState(res);
  //       console.log("tokenReducer111111111111", res);
  //       setLoader(true);
  //       dashBoardApiFunction(res);
  //     } else {
  //       setLoader(true);
  //       dashBoardApiFunction();
  //     }
  //   });
  //   getItemFromStorage("_regdEmail").then((res) => {
  //     if (res) {
  //       dispatch(setRegisteredEmailAction(res));
  //     }
  //   });
  //   setTimeout(() => {
  //     allProductsApi();
  //   }, 500);
  // }, [token]);

  const dashBoardApiFunction = (tokenValue) => {
    fetchUrl(
      dashboardParams,
      tokenValue ? tokenValue : tokenInState != null ? tokenInState : "",
      // "678236623468372347234820384842",
      DASHBOARD_URL
    )
      .then((resJson) => {
        ////////////////////
        setRefreshing(false);
        setLoader(false);
        // console.log("DASHBOARD_result =====", resJson); /////
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          // console.log("accessToken", resJson?.data?.login_token?.token);
          setImageBaseUrl(resJson?.imageBaseUrl);
          dispatch(imageBaseUrlAction(resJson?.imageBaseUrl)); ///////////
          setCheckOutSliderData(resJson?.slider?.top); //top
          setTopRightSliderData(resJson?.slider?.topRight[0]); //topRight
          setMiddleSliderData(resJson?.slider?.middle[0]); //middle
          setBottomSliderData(resJson?.slider?.bottom); //bottom
          setTotalCartItemCount(resJson?.tot_cart_item); /////////////////////
          setTotalWishlistItemCount(resJson?.tot_wishlist_item);

          setFeaturedSaleProductsArray(resJson?.products?.Featured_Products); //Featured_Products,
          setMenuCategories(resJson?.menu_categories);
          setNewProductsSaleProductsArray(resJson?.products?.New_Products); //New_Products
          setOnSaleProductsArray(resJson?.products?.On_Sale); //On_Sale

          // console.log("KKKKKKK", resJson?.group_products[0].product_details);
          setTopTabsDataArray(resJson?.group_products);
          setGroupProducts(resJson?.group_products[0].product_details); //initial group first index value
          setGroupType(resJson?.group_products[0].name); // //initial groupType( name)
          // setHotProductsArray(resJson?.group_products[0]?.Hot_Products); //Hot_Products
          // setBestOffersArray(resJson?.group_products[1]?.Best_Offers); //Best_Offers
          // setTopDealArray(resJson?.group_products[2]?.Top_Deal); //Top_Deal
          // console.log("Group_products========", resJson?.group_products);

          (tokenValue || tokenInState) &&
            getObjectFromStorage("_cartArray").then((result) => {
              ///////////
              if (result) {
                dispatch(
                  cartItemCountAction(
                    Number(result?.length) + Number(resJson?.tot_cart_item)
                  )
                );
              }
            });
          // console.log("resJson?.tot_cart_item", resJson?.tot_cart_item);
          // dispatch(cartItemCountAction(resJson?.tot_cart_item)); // update cart item count
        } else if (resJson?.status == 400) {
          showToastWithGravity(resJson?.message);
        } else if (resJson?.status == 603) {
          // unAuthorizedHandler(resJson, navigation, dispatch);
          // showToastWithGravity(resJson?.message);
          clearTokenFromStorage().then(() => {
            setTokenInState("");
            onRefresh();
          });
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("DASHBOARD_Error::", error);
      });
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
    setLoader(true);
    dashBoardApiFunction();
    // setRefreshing(false);
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      // token = (await Notifications.getExpoPushTokenAsync()).data;
      token = (await Notifications.getDevicePushTokenAsync()).data;
      // console.log("tokenforPushNotifications::", token);
      // console.log("permissionForPushNotification-Status::", finalStatus);
    } else {
      alert("Must use physical device for Push Notifications");
    }
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(() => {
    PushnotificationData?.title
      ? localNotificationTrigger(
          PushnotificationData?.title,
          PushnotificationData?.message,
          PushnotificationData?.imageUrl,
          PushnotificationData?.redirect
        )
      : null;

    return () => {};
  }, [PushnotificationData?.id]);

  const localNotificationTrigger = (title, message, imageurl, redirect) => {
    if (Platform.OS === "ios") {
    } else {
      try {
        const options = {
          channelId: "106237949789",
          bigPictureUrl: imageurl,
          title: title,
          message: message,
          body: message,
          userInfo: {
            image: imageurl,
            redirect: redirect,
          },
          priority: "normal",
          importance: "normal",
        };
        // PushNotification.localNotification(options);
        // console.log("call me");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onExitHandler = () => {
    BackHandler.exitApp();
  };

  return loader ? (
    <Loader loader={loader} setLoader={setLoader} />
  ) : (
    <ScreenWrapper>
      <View style={styles.headerBarView}>
        <Pressable
          onPress={() => navigation.navigate("SearchProducts")}
          style={styles.searchBarView}
        >
          <Text style={styles.searchText}>Search</Text>
          <Image
            resizeMode="contain"
            style={styles.searchIcon}
            source={require("../../assets/images/searchIcon.png")}
          />
        </Pressable>
        <View style={{ flexDirection: "row" }}>
          <Pressable
            style={{ marginHorizontal: 10 }}
            onPress={() =>
              token ? navigation.navigate("WishList") : navigation.push("Login")
            }
          >
            <Image
              resizeMode="contain"
              style={styles.favouriteIcon}
              source={require("../../assets/images/favouriteIcon.png")}
            />
            {/* {totalWishlistItemCount != 0 ? (
              <View style={styles.itemCountBadgeView}>
                <Text style={styles.itemBadgeCountText}>
                  {totalWishlistItemCount}
                </Text>
              </View>
            ) : null} */}
          </Pressable>
          <Pressable
            onPress={() =>
              token ? navigation.navigate("MyCart") : navigation.push("Login")
            }
          >
            <Image
              resizeMode="contain"
              style={styles.bagIcon}
              source={require("../../assets/images/bagIconTab.png")}
            />
            {/* {totaltoken&&cartItemCount != 0 ? (
              <View style={styles.itemCountBadgeView}>
                <Text style={styles.itemBadgeCountText}>
                  {totalCartItemCount}
                </Text>
              </View>
            ) : null} */}
            {token && cartItemCount != 0 ? (
              <View style={styles.itemCountBadgeView}>
                <Text style={styles.itemBadgeCountText}>{cartItemCount}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>
      <ScrollView
        style={[styles.scrollView]}
        contentContainerStyle={[styles.scrollViewContainer]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.ViewIntoScrollView}>
          <View style={[styles.componentWrapper, { paddingHorizontal: 0 }]}>
            <CheckOutScrollComponent
              bannerData={checkOutSliderData}
              // bannerData={CheckOutSliderData}
              baseUrl={imageBaseUrl ? imageBaseUrl : ""}
              intervalTime={2500}
            />
          </View>
          <View style={[styles.componentWrapper, { marginBottom: 10 }]}>
            <ScrollingTabsComponent
              TabsData={topTabsDataArray}
              setGroupProducts={setGroupProducts}
              setGroupType={setGroupType}
            />
          </View>
          {/* {MyPager()}
           */}

          {/* <Pages>
            <View style={{ flex: 1, backgroundColor: "red" }} />
            <View style={{ flex: 1, backgroundColor: "green" }} />
            <View style={{ flex: 1, backgroundColor: "blue" }} />
          </Pages> */}

          <View style={[styles.componentWrapper]}>
            <NowOrNeverComponent //On_Sale, New_Products, Featured_Products
              // data={NowOrNeverCollectionData}
              bannerData={topRightSliderData ? topRightSliderData : {}}
              data={groupProducts ? groupProducts : []} //group
              groupType={groupType}
              baseUrl={imageBaseUrl ? imageBaseUrl : ""}
              navigation={navigation}
            />
          </View>
          <View style={styles.componentSeparatorView}></View>
          <View style={[styles.componentWrapper]}>
            <NewCollectionComponent //New_Products
              // data={NewCollectionData}
              bannerData={middleSliderData}
              data={newProductsProductsArray} //New_Products
              product_type={"New Products"}
              baseUrl={imageBaseUrl ? imageBaseUrl : ""}
              navigation={navigation}
            />
          </View>
          <View style={styles.componentSeparatorView}></View>
          <View style={[styles.componentWrapper, { paddingHorizontal: 0 }]}>
            {bottomSliderData?.length != 0 && (
              <BringItHomeAutoSlider //Featured_Products
                // slideData={BringItHomeSliderData}
                bannerData={bottomSliderData}
                // listData={BringItHomeCollectionData}
                listData={featuredProductsArray} //Featured_Products
                product_type={"Featured Products"}
                baseUrl={imageBaseUrl ? imageBaseUrl : ""}
                intervalTime={2500}
                navigation={navigation}
              />
            )}
          </View>
          <View style={styles.componentSeparatorView}></View>
          <View style={[styles.componentWrapper]}>
            <ShopTillYouDropComponent //menu_Categories
              listData={menuCategories}
              // listData={ShopTillYouDropCollectionData}
              // listData={hotProductsArray}
              baseUrl={imageBaseUrl ? imageBaseUrl : ""}
              navigation={navigation}
            />
          </View>
          <View style={styles.componentSeparatorView}></View>
          <View style={[styles.componentWrapper]}>
            <KnockOutDealsComponent //On-Sale
              // data={KnockOutDealsCollectionData}
              data={onSaleProductsArray} //On-Sale
              product_type={"On Sale"}
              baseUrl={imageBaseUrl ? imageBaseUrl : ""}
              navigation={navigation}
            />
          </View>
        </View>
      </ScrollView>
      <LogoutExitModalAlert
        fromScreen="Dashboard"
        isModal={isExitModal}
        setIsModal={setIsExitModal}
        onPressHandler={onExitHandler}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerBarView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    //   backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%",
  },
  searchBarView: {
    height: 40,
    width: "80%",
    backgroundColor: "#F2F5F6",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  searchText: {
    fontSize: 14,
    color: "#9B9B9B",
    fontFamily: "Poppins-Regular",
  },
  componentWrapper: {
    paddingHorizontal: 10,
    // paddingVertical: 20,
    width: "100%",
    // backgroundColor: 'red',
  },
  componentSeparatorView: {
    backgroundColor: "#F2F2F2",
    height: 4,
    width: wp(100),
    marginVertical: 20,
  },
  scrollView: {
    // width: wp(100),
    // flex: 1,
    backgroundColor: "white",
  },
  scrollViewContainer: {
    alignItems: "center",
    // height: hp(100),
    // flex: 1
    // width: '100%',
    // backgroundColor: 'green',
  },
  ViewIntoScrollView: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
    width: wp(100),
    paddingBottom: 10,
    // paddingHorizontal: 10,
    // paddingVertical: 10,
    // backgroundColor: 'red',
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: "#161B2F",
  },
  favouriteIcon: {
    width: 22,
    height: 22,
    tintColor: "#161B2F",
  },
  itemCountBadgeView: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "#E1385E",
    height: 14,
    width: 14,
    borderRadius: 14 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  itemBadgeCountText: {
    color: "#FFFFFF",
    fontSize: 9,
  },
  bagIcon: {
    width: 20,
    height: 20,
    tintColor: "#161B2F",
  },

  //////

  mainContainer: {
    flex: 1,
  },
  imageBackground: {
    width: wp(100),
    height: wp(100),
    // marginTop: 10,
    // position: 'absolute',
    backgroundColor: "#0E1525",
    // backgroundColor: "rgba(14, 21, 37, 0.6)",
    alignItems: "flex-end",
  },
  shopNowButtonView: {
    width: wp(40),
    height: wp(95),
    flexDirection: "row",
    alignItems: "flex-end",
    //   backgroundColor: 'yellow',
  },
  shopNowButton: {
    backgroundColor: "#0E1525",
    height: 35,
    width: "90%",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  shopNowText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  rightArrrowIcon: {
    width: 18,
    height: 15,
  },
  pagingIndicatorLineView: {
    height: 4,
    backgroundColor: "#0E1525",
    width: wp(100),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
