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
  Platform
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import OTPTextInput from "react-native-otp-textinput";
import { getDeviceToken } from "../../Utils/DeviceTokenHelper";
import { FORGOTOTPVERIFY_URL, RESENDOTP_URL, VERIFYACCOUNT_URL } from "../../Utils/ApiUrlConstants";
import { showToastWithGravity } from "../../components/Common/SnackBar";
import Loader from "../../components/Common/LoaderModal";
import { fetchUrl } from "../../Utils/FetchHelper";
import { setTokenAction } from "../../redux/Actions/SetTokenAction";
import { setItemInStorage } from "../../Utils/AsyncStorageHelper";
import { useDispatch } from "react-redux";
import { setRegisteredEmailAction, setVerifyEmailAction } from "../../redux/Actions/UserProfileActions";

export default function ForgotPasswordOTP({ navigation,route }) {
  const [OTP, setOTP] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [showMessage, setShowMessage] = useState(false);
  const [deviceToken, setDeviceToken] = useState(null);
  const [loader, setLoader] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const dispatch = useDispatch();
    useEffect(() => {
      if(route?.params?.email) setUserEmail(route?.params?.email)
    }, [route]);
  useEffect(() => {
    if(countdown > 0){
    const interval = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);
  
    return () => clearInterval(interval)
  }else{
      setShowMessage(true)
    }
  }, [countdown]);

  
  const DeviceToken = async () => {
    var DeviceTokenN = await getDeviceToken();
    setDeviceToken(DeviceTokenN);
  };
  //Device token
  deviceToken == null && DeviceToken();

  //forgot api params
  const forgotPasswordUrl = FORGOTOTPVERIFY_URL;
  let forgotParams = {
    email: userEmail, 
    otp:OTP?.trim(),
  };

  const checkValidation = () => {
    let validationErrorMessage = null;
    if (OTP.length < 4)
      return (validationErrorMessage = "Enter Valid OTP");
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
      // console.log(forgotParams);
      setLoader(true);
      fetchUrl(forgotParams, "", forgotPasswordUrl)
        .then((resJson) => {
          ////////////////////
          setLoader(false);
          // console.log("SignIn-result =====", resJson);
          showToastWithGravity(resJson?.message);
          if (resJson?.status == 200) {
            navigation.navigate("ResetPassword",{email: route?.params?.email });
          }
        })
        .catch((error) => {
          setLoader(false);
          console.log("forgotError::", error);
        });
    }
  };


  //resendOTP api params
  const resedOtpUrl = RESENDOTP_URL;
  let resendOtpParams = {
    email: userEmail, 
  };

  const resendOTP = () => {
    let valMsg = null;

    if (valMsg) {
      //if not valid
      showToastWithGravity(valMsg);
    } else {
      //if no validation error
      //Api call >>>> then Navigate on success>>
      // console.log(forgotParams);
      setLoader(true);
      fetchUrl(resendOtpParams, "", resedOtpUrl)
        .then((resJson) => {
          ////////////////////
          setLoader(false);
          // console.log("SignIn-result =====", resJson);
          showToastWithGravity(resJson?.message);
          if (resJson?.status == 200) {
            setCountdown(60)
          }
        })
        .catch((error) => {
          setLoader(false);
          console.log("resendError::", error);
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
              onPress={() => navigation.goBack()}
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
            style={styles.forgotPasswordImage}
            source={require("../../assets/images/forgotPasswordOtpImage.png")}
          />
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subTitle}>
            A 4 digit code has been sent to your registered email address {userEmail}
          </Text>

          <OTPTextInput
            keyboardType="numeric"
            handleTextChange={(text) => setOTP(text)}
            // defaultValue=""
            // inputCount="4"
            tintColor="transparent"
            offTintColor="transparent"
            // inputCellLength: 1,
            autoCorrect={false}
            containerStyle={{ alignSelf: "flex-start", marginVertical: 10 }}
            textInputStyle={{
              backgroundColor: "#F2F5F6",
              borderRadius: 10,
              height: 65,
              width: 45,
              color: "#161B2F",
            }}
            // handleTextChange: () => {},
          />

          <Pressable
            // onPress={() => navigation.navigate("ResetPassword")}
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
          {countdown > 0? <Text
            style={{
              alignSelf: "flex-start",
              color: "rgba(22, 27, 47,0.6)",
              fontFamily: "OpenSans-Medium",
              marginVertical: 10,
            }}
          >
            Resend OTP again in
            <Text style={{ color: "#DD1B47" }}> {countdown} seconds</Text>
            {/* {showMessage &&  <Text onPress={resendOTP} style={{ color: "#DD1B47" }}> Resend OTP</Text> } */}
          </Text>:<Pressable onPress={resendOTP}>
          <Text  style={{ color: "#DD1B47" }}> Resend OTP</Text>
          </Pressable>}
         
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
  forgotPasswordImage: {
    width: wp(70),
    height: hp(30),
    marginTop: hp(5),
  },
  title: {
    alignSelf: "flex-start",
    fontSize: 28,
    fontFamily: "OpenSans-SemiBold",
    color: "#000000",
    marginVertical: hp(2),
  },
  subTitle: {
    alignSelf: "flex-start",
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
    color: "#161B2F",
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
