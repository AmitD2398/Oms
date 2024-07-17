import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    Image,
    TextInput,
    Pressable,
    BackHandler,
    Platform,
    Linking
  } from "react-native";
  import React, { useState } from "react";
  import ScreenWrapper from "../../components/ScreenWrapper";
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import { fetchUrl } from "../../Utils/FetchHelper";
  import { LOGIN_URL, REGISTER_URL, SETTING_URL } from "../../Utils/ApiUrlConstants";
  import { getDeviceToken } from "../../Utils/DeviceTokenHelper";
  import { showToastWithGravity } from "../../components/Common/SnackBar";
  import { useSelector, useDispatch } from "react-redux";
  import Loader from "../../components/Common/LoaderModal";
  import {
    validate_email,
    validate_password,
    validate_number,
    validate_PIN,
    validate_name,
  } from "../../Utils/ValidationControl";
  import { setItemInStorage } from "../../Utils/AsyncStorageHelper";
  import { setTokenAction } from "../../redux/Actions/SetTokenAction";
  import { useFocusEffect } from "@react-navigation/native";
  import { CommonActions } from "@react-navigation/native";
import { clientId } from "../../constants/Constant";
  
  export default function Register({ navigation, route: { params } }) {
    const dispatch = useDispatch();
  
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [term, setTerm] = useState("");
    const [privac, setPrivac] = useState("");
    const [secureEntry, setSecureEntry] = useState(true);
    const [deviceToken, setDeviceToken] = useState(null);
    const [loader, setLoader] = useState(false);
  
    const handleChange = text => {
      // Replace dots, dashes, and spaces with empty string
      const filteredText = text.replace(/[,.-\s]/g, '');
      setMobile(filteredText);
    };

    useFocusEffect(
      React.useCallback(() => {
        //hardwareBackPress action
        const backAction = () => {
          params?.Unauthorized
            ? navigation.navigate("Dashboard")
            : navigation.goBack();
          return true;
        };
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
        return () => backHandler.remove();
      }, [])
    );
  
    const DeviceToken = async () => {
      var DeviceTokenN = await getDeviceToken();
      setDeviceToken(DeviceTokenN);
    };
    //Device token
    deviceToken == null && DeviceToken();
  
    //signin api params
    const signUpUrl = REGISTER_URL;
    const settingUrl = SETTING_URL;
    let signInParams = {
      name:userName?.trim(),
      email: email?.trim(), //"BETA_8KHPQB9I@mailinator.com", //email
      password: password?.trim(), //123456 //password
      mobile:mobile?.trim(), //
      device_token: deviceToken,
      client_id:clientId,
      device_type: Platform.OS === "android" ? "1" : "2",
    };
  
    const checkValidation = () => {
      let validationErrorMessage = null;
      if (!validate_name(userName?.trim()))
        return (validationErrorMessage = "Enter Valid Name");
      if (!validate_email(email?.trim()))
        return (validationErrorMessage = "Enter Valid Email");
      else if (password === '')
        return (validationErrorMessage = "Enter Valid Password");
      else if (mobile === '')
        return (validationErrorMessage = "Enter Valid mobile number");
      else return validationErrorMessage;
    };
  
    const validationHandler = () => {
      let valMsg = null;
      valMsg = checkValidation();
  
      if (valMsg) {
        //if not valid
        showToastWithGravity(valMsg);
      } else {
        //if no validation error
        //Api call >>>> then Navigate on success>>
        // console.log(signInParams);
        setLoader(true);
        fetchUrl(signInParams, "", signUpUrl)
          .then((resJson) => {
            ////////////////////
            setLoader(false);
            // console.log("SignIn-result =====", resJson);
            showToastWithGravity(resJson?.message);
            if (resJson?.status == 200) {
              // console.log("accessToken", resJson?.token);
              navigation.navigate("VerifyAccount", {email: resJson?.data?.email });
              // navigation.dispatch(
              //   CommonActions.reset({
              //     index: 0,
              //     routes: [
              //       {
              //         name: "VerifyAccount",
              //         // params: {
              //         //   fromLogin: true,
              //         // },
              //       },
              //     ],
              //   })
              // );
            }
          })
          .catch((error) => {
            setLoader(false);
            console.log("registerError::", error);
          });
      }
    };
    const termandCondtion = () => {
      let valMsg = null;
  
      if (valMsg) {
        //if not valid
        showToastWithGravity(valMsg);
      } else {
        setLoader(true);
        fetchUrl('', '', settingUrl)
          .then((resJson) => {
            ////////////////////
            setLoader(false);
            // console.log("SignIn-result =====", resJson);
            showToastWithGravity(resJson?.message);
            if (resJson?.status == 200) {
        Linking.openURL(resJson?.data?.terms)
            }
          })
          .catch((error) => {
            setLoader(false);
            console.log("forgotError::", error);
          });
      }
    };
    const privacy = () => {
      let valMsg = null;
  
      if (valMsg) {
        //if not valid
        showToastWithGravity(valMsg);
      } else {
        setLoader(true);
        fetchUrl('', '', settingUrl)
          .then((resJson) => {
            ////////////////////
            setLoader(false);
            // console.log("SignIn-result =====", resJson);
            showToastWithGravity(resJson?.message);
            if (resJson?.status == 200) {
        Linking.openURL(resJson?.data?.privacy
        )
            }
          })
          .catch((error) => {
            setLoader(false);
            console.log("forgotError::", error);
          });
      }
    };
    return (
      <ScreenWrapper>
        <View style={[styles.headerView]}>
          {/* {params?.Unauthorized ? null : ( */}
          <Pressable
            onPress={() =>
              params?.Unauthorized
                ? navigation.navigate("Dashboard")
                : navigation.goBack()
            }
          >
            <Image
              resizeMode="contain"
              style={styles.backButton}
              source={require("../../assets/images/backArrow2.png")}
            />
          </Pressable>
          {/* )} */}
          {/* <Text style={styles.headerText}>Order Details</Text> */}
        </View>
        <ScrollView
          style={[styles.scrollView]}
          contentContainerStyle={[styles.scrollViewContainer]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.ViewIntoScrollView}>
            <Image
              resizeMode="contain"
              style={styles.loginImage}
              source={require("../../assets/images/signupimage.png")}
            />
            <Text style={styles.title}>Sign up</Text>
            <View style={styles.textInputView}>
              <Image
                source={require("../../assets/images/user.png")}
                resizeMode="contain"
                style={styles.textInputImage}
              />
              <View style={styles.textInputAndSeparatorLineView}>
                <TextInput
                  maxLength={80}
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  placeholder="Name"
                  placeholderTextColor={"rgba(22, 27, 47,0.6)"}
                  style={styles.textInput}
                  value={userName}
                  onChangeText={setUserName}
                />
                <View style={styles.separatorLine}></View>
              </View>
              <Image
                source={require("../../assets/images/atRateImage.png")}
                resizeMode="contain"
                style={[styles.textInputImage, { opacity: 0, marginRight: 10 }]}
              />
            </View>
            <View style={styles.textInputView}>
              <Image
                source={require("../../assets/images/atRateImage.png")}
                resizeMode="contain"
                style={styles.textInputImage}
              />
              <View style={styles.textInputAndSeparatorLineView}>
                <TextInput
                  maxLength={80}
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  placeholder="Email ID"
                  placeholderTextColor={"rgba(22, 27, 47,0.6)"}
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                />
                <View style={styles.separatorLine}></View>
              </View>
              <Image
                source={require("../../assets/images/atRateImage.png")}
                resizeMode="contain"
                style={[styles.textInputImage, { opacity: 0, marginRight: 10 }]}
              />
            </View>
            <View style={styles.textInputView}>
              <Image
                source={require("../../assets/images/lock.png")}
                resizeMode="contain"
                style={styles.textInputImage}
              />
              <View style={styles.textInputAndSeparatorLineView}>
                <TextInput
                  maxLength={30}
                  autoCorrect={false}
                  placeholder="Password"
                  placeholderTextColor={"rgba(22, 27, 47,0.6)"}
                  style={styles.textInput}
                  secureTextEntry={secureEntry}
                  value={password}
                  onChangeText={setPassword}
                />
                <View style={styles.separatorLine}></View>
              </View>
              <Pressable onPress={() => setSecureEntry(!secureEntry)}>
                {secureEntry ? (
                  <Image
                    source={require("../../assets/images/eye.png")}
                    resizeMode="contain"
                    style={[styles.textInputImage, { marginRight: 10 }]}
                  />
                ) : (
                  <Image
                    source={require("../../assets/images/hiddenEye.png")}
                    resizeMode="contain"
                    style={[styles.textInputImage, { marginRight: 10 }]}
                  />
                )}
              </Pressable>
            </View>
            <View style={styles.textInputView}>
              <Image
                source={require("../../assets/images/mobile_phone.png")}
                resizeMode="contain"
                style={styles.textInputImage}
              />
              <View style={styles.textInputAndSeparatorLineView}>
                <TextInput
                  maxLength={13}
                  autoCorrect={false}
                  underlineColorAndroid="transparent"
                  placeholder="Mobile"
                  placeholderTextColor={"rgba(22, 27, 47,0.6)"}
                  keyboardType="numeric"
                  style={styles.textInput}
                  value={mobile}
                  onChangeText={handleChange}
                />
                <View style={styles.separatorLine}></View>
              </View>
              <Image
                source={require("../../assets/images/atRateImage.png")}
                resizeMode="contain"
                style={[styles.textInputImage, { opacity: 0, marginRight: 10 }]}
              />
            </View>
            <View>
            <Text style={styles.signUpText}>By signing up, you agree to our<Text>
            <Text onPress={termandCondtion} style={{color:'#DD1B47',alignItems:'center'}}> Terms & Conditions</Text>
            <Text style={{color:'#333'}}> and</Text></Text><Text onPress={privacy} style={styles.txt}> Privacy Policy</Text></Text>
            </View>
            <Pressable
              onPress={() =>
                // navigation.navigate("VerifyAccount")
                validationHandler()
              }
              style={styles.loginButton}
            >
              <Text style={styles.loginText}>Register</Text>
              <Image
                resizeMode="contain"
                style={styles.arrowImage}
                source={require("../../assets/images/rightArrow.png")}
              />
            </Pressable>
  
           <View style={styles.bottomSection}>
           <Pressable
              onPress={() => navigation.navigate("Login")}
              style={styles.accountButton}
            >
              <Text style={[styles.signUpText,{color:'#000'}]}>Joined us before? <Text style={{color:'#DD1B47',fontSize: 14,fontFamily: "OpenSans-Regular",}}>Login</Text></Text>
            </Pressable>
           </View>
          </View>
        </ScrollView>
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
      paddingHorizontal: 20,
      // backgroundColor: "red",
      marginTop: 10,
    },
    backButton: {
      width: 20,
      height: 20,
    },
    headerText: {
      fontSize: 18,
      color: "#161B2F",
      fontFamily: "OpenSans-Bold",
    },
    scrollView: {
      // width: wp(100),
      // flex: 1,
      backgroundColor: "white",
    },
    scrollViewContainer: {
      alignItems: "center",
      // height: hp(100) - 25,
      height: hp(100) - 55,
      // flex: 1
      // width: '100%',
      // backgroundColor: 'green',
    },
    ViewIntoScrollView: {
      alignSelf: "center",
      alignItems: "center",
      width: wp(100),
      paddingHorizontal: 20,
      // paddingVertical: 15,
    },
    loginImage: {
      width: wp(60),
      height: hp(20),
      marginTop: hp(4),
    },
    title: {
      alignSelf: "flex-start",
      fontSize: 28,
      fontFamily: "OpenSans-SemiBold",
      color: "#161B2F",
      marginVertical: hp(2),
    },
    textInputView: {
      // backgroundColor: 'red',
      height: 45,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    textInputImage: {
      height: 18,
      width: 18,
      tintColor: "rgba(22, 27, 47,0.6)",
    },
    textInputAndSeparatorLineView: {
      width: "80%",
    },
    textInput: {
      //   backgroundColor: 'green',
      color: "rgba(22, 27, 47,1)",
      fontSize: 15,
      fontFamily: "OpenSans-Medium",
      width: "100%",
      height: "100%",
      // borderBottomWidth: 0.7,
      // borderBottomColor: 'rgba(159, 159, 159,0.6)',
    },
    separatorLine: {
      backgroundColor: "rgba(159, 159, 159,0.6)",
      top: -5,
      height: 0.5,
      width: wp(80),
    },
    loginButton: {
      backgroundColor: "#1A97CC",
      borderRadius: 5,
      width: "100%",
      height: 50,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginVertical: 20,
    },
    loginText: {
      color: "white",
      fontSize: 15,
      fontFamily: "OpenSans-Medium",
    },
    arrowImage: {
      width: 20,
      height: 20,
    },
    bottomSection: {
      alignItems: "center",
      marginTop:hp(2)
      // backgroundColor: 'red',
    },
    forgotPasswordButton: {
      alignItems: "center",
      // marginVertical: hp(10),
      // backgroundColor: 'red',
    },
    accountButton: {
      alignItems: "center",
      // marginVertical: hp(5),
      // backgroundColor: 'red',
    },
    forgotPasswordText: {
      color: "#DD1B47",
      fontSize: 14,
      fontFamily: "OpenSans-Regular",
    },
    signUpText: {
      color: "#7E7E7E",
      fontSize: 14,
      fontFamily: "OpenSans-Regular",
    },
    txt:{
        color:'#DD1B47',fontSize: 14,fontFamily: "OpenSans-Regular",
    }
  });
  