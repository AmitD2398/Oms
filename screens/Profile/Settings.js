import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    Image,
    Pressable,
    Dimensions,
    ImageBackground,
  } from "react-native";
  import React, { useState, useEffect } from "react";
  import ScreenWrapper from "../../components/ScreenWrapper";
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  const { width, height } = Dimensions.get("window");
  import { CommonActions, useFocusEffect } from "@react-navigation/native";
  import { fetchUrl } from "../../Utils/FetchHelper";
  import { LOGOUT_URL, USER_PROFILE_URL } from "../../Utils/ApiUrlConstants";
  import { showToastWithGravity } from "../../components/Common/SnackBar";
  import { useSelector, useDispatch } from "react-redux";
  import Loader from "../../components/Common/LoaderModal";
  import {} from "../../Utils/ValidationControl";
  import { clearTokenFromStorage } from "../../Utils/AsyncStorageHelper";
  import { unAuthorizedHandler } from "../../Utils/UnAuthorizedHandler";
  import LogoutExitModalAlert from "../../components/Common/LogoutExitModalAlert";
  import { setTokenAction } from "../../redux/Actions/SetTokenAction";
  import { cartItemCountAction } from "../../redux/Actions/CartItemsCountAction";
  
  export default function Settings({ navigation }) {
    const { token } = useSelector((state) => state.tokenReducer);
    const { imageBaseUrl } = useSelector((state) => state.imageBaseUrlReducer);
    // console.log("imageBaseUrl", imageBaseUrl);
    // console.log("token>>>>>>>>>>>>>>>>>>>>>>>MyProfile", token);
  
    const dispatch = useDispatch();
  
    const [loader, setLoader] = useState(false);
    const [userProfileData, setUserProfileData] = useState({});
    const [isLogoutModal, setIsLogoutModal] = useState(false);
  
    const SettingsArray = [
      {
        id: 1,
        title: "Saved Cards",
        subTitle: "Save your cards for faster checkout",
        image: require("../../assets/images/card.png"),
        navigateTo: "Cards",
      },
      {
        id: 2,
        title: "Saved Address",
        subTitle: "Save addresses for hassle-free checkout",
        image: require("../../assets/images/location.png"),
        navigateTo: "Addresses",
      },
      {
        id: 3,
        title: "General settings",
        subTitle: "Mange app settings",
        image: require("../../assets/images/profileSettingIcon.png"),
        navigateTo: "",
      },
    ];
  
    // useEffect(() => {
    //   userProfileApi();
    // }, []);
  
    useFocusEffect(
      React.useCallback(() => {
        userProfileApi();
      }, [token])
    );
  
    const userProfileApi = () => {
      setLoader(true);
      fetchUrl({}, token, USER_PROFILE_URL)
        .then((resJson) => {
          ////////////////////
          setLoader(false);
          // console.log("USER_PROFILE_result =====", resJson);
          if (resJson?.status == 200) {
            // setLoader(false);
            // showToastWithGravity(resJson?.message);
            // console.log('profile<><',resJson?.data);
            setUserProfileData(resJson?.data);
          } else if (resJson?.status == 400) {
            // setLoader(false);
            showToastWithGravity(resJson?.message);
          } else if (resJson?.status == 603) {
            // setLoader(false);
            // showToastWithGravity(resJson?.message);
            unAuthorizedHandler(resJson, navigation, dispatch);
          }
        })
        .catch((error) => {
          setLoader(false);
          console.log("USER_PROFILE_Error::", error);
        });
    };
    const logoutHandler = () => {
      setLoader(true);
      fetchUrl({}, token, LOGOUT_URL)
        .then((resJson) => {
          ////////////////////
          setLoader(false);
          // console.log('logout-result =====', resJson)
          if (resJson?.status == 200 || resJson?.status == 603) {
            // setLoader(false);
            // showToastWithGravity(resJson?.message);
            clearTokenFromStorage().then(() => {
              dispatch(setTokenAction(null));
              navigation.navigate("Dashboard");
            });
            // dispatch(cartItemCountAction(0));
            // navigation.dispatch(
            //   CommonActions.reset({
            //     index: 0,
            //     routes: [
            //       {
            //         name: "Dashboard",
            //       },
            //     ],
            //   })
            // );
            showToastWithGravity("Logout Successful");
          }
        })
        .catch((error) => {
          setLoader(false);
          console.log("logoutError::", error);
        });
    };
    //   const logoutHandler = () => {
    //     setLoader(true)
    //     fetchUrl(logoutParams, token, LOGOUT_URL).then((resJson) => { ////////////////////
    //         setLoader(false)
    //         // console.log('logout-result =====', resJson)
    //         showToastWithGravity(resJson?.message)
    //         if (resJson?.status == 200 || resJson?.status == 603) {
    //             clearTokenFromStorage()
    //             // navigation.navigate("AppIntro")
    //             navigation.dispatch(
    //                 CommonActions.reset({
    //                     index: 0,
    //                     routes: [
    //                         {
    //                             name: 'AppIntro',
    //                         },
    //                     ],
    //                 })
    //             );
    //         }
    //     })
    //         .catch((error) => {
    //             setLoader(false)
    //             console.log("logoutError::", error)
    //         })
    // }
  
    return (
      <ScreenWrapper>
        <View style={[styles.headerView]}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              resizeMode="contain"
              style={styles.backButton}
              source={require("../../assets/images/backArrow2.png")}
            />
          </Pressable>
          <Text style={styles.headerText}>Settings</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width: width, height: height }}
          contentContainerStyle={{ alignItems: "center" }}
        >
          <View style={styles.variousSettingsView}>
            {SettingsArray?.map((item, index) => {
              return (
                <Pressable
                  onPress={() =>
                    item?.navigateTo != ""
                      ? item?.navigateTo == "EditMyProfile"
                        ? navigation.navigate(item?.navigateTo, {
                            userProfileData: userProfileData,
                          })
                        : navigation.navigate(item?.navigateTo)
                      : null
                  }
                  key={item?.id}
                  style={styles.itemView}
                >
                  <View style={styles.itemImageView}>
                    <Image
                      resizeMode="contain"
                      style={styles.itemImage}
                      source={item?.image}
                    />
                  </View>
                  <View style={styles.itemTextView}>
                    <Text style={styles.itemTitle}>{item?.title}</Text>
                    <Text style={styles.itemSubTitle}>{item?.subTitle}</Text>
                  </View>
                  <View style={styles.rightArrowView}>
                    <Image
                      resizeMode="contain"
                      style={styles.rightArrow}
                      source={require("../../assets/images/rightArrow.png")}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
        <Loader loader={loader} setLoader={setLoader} />
      </ScreenWrapper>
    );
  }
  
  const styles = StyleSheet.create({
    headerView: {
      flexDirection: "row",
      // justifyContent: "space-between",
      alignSelf: "center",
      alignItems: "center",
      width: "100%",
      paddingHorizontal: 15,
      // backgroundColor: 'red',
      marginTop: 5,
    },
    backButton: {
      height: 20,
      width: 20,
      marginRight: 10,
    },
    headerText: {
      fontSize: 18,
      fontFamily: "OpenSans-Bold",
      color: "#161B2F",
    },
    profileANdBackImageView: {
      marginTop: 20,
      // backgroundColor: "red",
      width: "100%",
      paddingHorizontal: 15,
      height: 210,
      alignItems: "center",
    },
    backGroundImage: {
      height: 140,
      width: "100%",
      borderRadius: 10,
    },
    profileAndNameView: {
      position: "absolute",
      alignItems: "center",
      justifyContent: "center",
      height: 140,
      width: "100%",
      top: 140 / 2,
    },
    profileImage: {
      height: 110,
      width: 110,
      borderRadius: 110 / 2,
    },
    userName: {
      fontSize: 16,
      fontFamily: "OpenSans-SemiBold",
      color: "#161B2F",
      marginVertical: 5,
    },
    variousSettingsView: {
      marginTop: 15,
      // backgroundColor: "red",
      width: "100%",
      paddingHorizontal: 15,
      alignItems: "center",
    },
    itemView: {
      backgroundColor: "#F2F5F6",
      // backgroundColor: "red",
      height: 60,
      width: "100%",
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    itemImageView: {
      width: "12%",
      height: "100%",
      alignItems: "center",
      paddingTop: 2,
    },
    itemImage: {
      height: 20,
      width: 20,
      right: 4,
    },
    itemTextView: {
      width: "76%",
      height: "100%",
    },
    itemTitle: {
      fontSize: 14,
      fontFamily: "OpenSans-Medium",
      color: "#161B2F",
      // marginVertical: 5,
    },
    itemSubTitle: {
      fontSize: 12,
      fontFamily: "OpenSans-Regular",
      color: "#646464",
      // marginVertical: 5,
    },
    rightArrowView: {
      width: "12%",
      height: "100%",
      // backgroundColor: "yellow",
      alignItems: "center",
      paddingTop: 4,
    },
    rightArrow: {
      height: 15,
      width: 15,
      tintColor: "#0E1525",
    },
    logoutButtonView: {
      width: "25%",
      marginVertical: 50,
    },
    logoutImage: {
      width: "100%",
      height: 22,
    },
  });
  