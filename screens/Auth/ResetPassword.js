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
} from "react-native";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import ScreenWrapper from "../../components/ScreenWrapper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FORGOTPASSWORD_URL, SETTING_URL } from "../../Utils/ApiUrlConstants";
import { showToastWithGravity } from "../../components/Common/SnackBar";
import { fetchUrl } from "../../Utils/FetchHelper";
import { useDispatch } from "react-redux";
import Loader from "../../components/Common/LoaderModal";

export default function ResetPassword({ navigation,route }) {
  const [secureEntry, setSecureEntry] = useState(true);
  const [secureEntryConfirm, setSecureEntryConfirm] = useState(true);
  const [password,setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loader, setLoader] = useState(false);


  const dispatch = useDispatch();

  useEffect(() => {
    if(route?.params?.email) setUserEmail(route?.params?.email)
  }, [route]);

  //resetPassword api params
  const resetPasswordUrl = FORGOTPASSWORD_URL;
  let resetPasswordParams = {
    email: userEmail, 
    password:password,
  };

  const checkValidation = () => {
    let validationErrorMessage = null;
       if (password === '')
        return (validationErrorMessage = "Enter Valid New Password");
      else if ( password.length < 6)
        return (validationErrorMessage = "Enter Valid New Password");
      else if ( confirmPassword === '')
        return (validationErrorMessage = "Enter Valid Confirm new password");
      else if ( confirmPassword.length < 6)
        return (validationErrorMessage = "Enter Valid Confirm new password");
      else if ( confirmPassword !== password)
        return (validationErrorMessage = "Enter Valid Confirm new password");
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
      // console.log(resetPasswordParams);
      setLoader(true);
      fetchUrl(resetPasswordParams, "", resetPasswordUrl)
        .then((resJson) => {
          ////////////////////
          setLoader(false);
          // console.log("SignIn-result =====", resJson);
          showToastWithGravity(resJson?.message);
          if (resJson?.status == 200) {
            navigation.replace("Login");
          }
        })
        .catch((error) => {
          setLoader(false);
          console.log("forgotError::", error);
        });
    }
  };




  useFocusEffect(
    React.useCallback(() => {
      //hardwareBackPress action
      const backAction = () => {
        navigation.goBack();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );

  useEffect(()=>{
    settings()
  },[])

  const settings = () => {
    let valMsg = null;

    if (valMsg) {
      //if not valid
      showToastWithGravity(valMsg);
    } else {
      setLoader(true);
      fetchUrl('', '', SETTING_URL)
        .then((resJson) => {
          ////////////////////
          setLoader(false);
          // console.log("SignIn-result =====", resJson);
          // showToastWithGravity(resJson?.message);
          console.log(resJson?.data);
          if (resJson?.status == 200) {
              setMessage(resJson?.data?.password_info)
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
      <ScrollView
        style={[styles.scrollView]}
        contentContainerStyle={[styles.scrollViewContainer]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ViewIntoScrollView}>
          <View style={styles.backButtonView}>
            <Pressable
              style={{ left: -10 }}
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Image
                resizeMode="contain"
                style={styles.backButtonImage}
                source={require("../../assets/images/backArrow.png")}
              />
            </Pressable>
            {/* <Text style={styles.backButtonHeadingText}>Change Password</Text> */}
          </View>
          <Image
            resizeMode="contain"
            style={styles.resetImage}
            source={require("../../assets/images/resetPasswordImage.png")}
          />
          <Text style={styles.title}>Reset{'\n'}Password?</Text>
          <Text style={styles.subTitle}>
            {message}
          </Text>
          <View style={styles.textInputView}>
            <Image
              source={require("../../assets/images/lock.png")}
              resizeMode="contain"
              style={styles.textInputImage}
            />
            <View style={styles.textInputAndSeparatorLineView}>
              <TextInput
                autoCorrect={false}
                underlineColorAndroid="transparent"
                placeholder="New password"
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
              source={require("../../assets/images/lock.png")}
              resizeMode="contain"
              style={styles.textInputImage}
            />
            <View style={styles.textInputAndSeparatorLineView}>
              <TextInput
                autoCorrect={false}
                placeholder="Confirm new password"
                placeholderTextColor={"rgba(22, 27, 47,0.6)"}
                style={styles.textInput}
                secureTextEntry={secureEntryConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <View style={styles.separatorLine}></View>
            </View>
            <Pressable
              onPress={() => setSecureEntryConfirm(!secureEntryConfirm)}
            >
              {secureEntryConfirm ? (
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

          <Pressable
            // onPress={() => navigation.navigate("BottomTabNavigation")}
            onPress={validationHandler}
            style={styles.loginButton}
          >
            <Text style={styles.loginText}>Submit</Text>
            <Image
              resizeMode="contain"
              style={styles.arrowImage}
              source={require("../../assets/images/rightArrow.png")}
            />
          </Pressable>
        </View>
      </ScrollView>
      <Loader loader={loader} setLoader={setLoader} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    // width: wp(100),
    // flex: 1,
    backgroundColor: "white",
  },
  scrollViewContainer: {
    alignItems: "center",
    height: hp(100) - 25,
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
  backButtonView: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
    //   marginVertical: 5,
    top: 5,
  },
  backButtonImage: {
    width: 40,
    height: 40,
    // marginTop: hp(10),
    // marginBottom: 20,
  },
  backButtonHeadingText: {
    color: "#161B2F",
    fontSize: 18,
    fontFamily: "OpenSans-Bold",
  },
  resetImage: {
    width: wp(50),
    height: hp(20),
    marginTop: hp(5),
  },
  title: {
    alignSelf: "flex-start",
    fontSize: 28,
    fontFamily: "OpenSans-SemiBold",
    color: "#161B2F",
    marginVertical: hp(2),
  },
  subTitle: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
    color: "#7E7E7E",
    marginBottom: 20,
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
  forgotPasswordButton: {
    alignItems: "center",
    marginVertical: hp(12),
    // backgroundColor: 'red',
  },
  forgotPasswordText: {
    color: "#DD1B47",
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
  },
});
