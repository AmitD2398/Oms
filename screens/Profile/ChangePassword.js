import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import { useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function ChangePassword({ navigation }) {
  const [secureEntry, setSecureEntry] = useState(true);
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
            <Text style={styles.backButtonHeadingText}>Change Password</Text>
          </View>
          <Image
            resizeMode="contain"
            style={styles.changePasswordImage}
            source={require("../../assets/images/changePasswordImage.png")}
          />
          <Text style={styles.title}>Enter email address</Text>
          <Text style={styles.subTitle}>
            Please enter the address associated with your account.
          </Text>
          <View style={styles.textInputView}>
            <Image
              source={require("../../assets/images/atRateImage.png")}
              resizeMode="contain"
              style={styles.textInputImage}
            />
            <View style={styles.textInputAndSeparatorLineView}>
              <TextInput
                autoCorrect={false}
                underlineColorAndroid="transparent"
                placeholder="Email ID"
                placeholderTextColor={"rgba(22, 27, 47,0.6)"}
                style={styles.textInput}
              />
              <View style={styles.separatorLine}></View>
            </View>
            <Image
              source={require("../../assets/images/atRateImage.png")}
              resizeMode="contain"
              style={[styles.textInputImage, { opacity: 0, marginRight: 10 }]}
            />
          </View>

          <Pressable
            onPress={() => navigation.navigate("ChangePasswordOTP")}
            style={styles.loginButton}
          >
            <Text style={styles.loginText}>Verify</Text>
            <Image
              resizeMode="contain"
              style={styles.arrowImage}
              source={require("../../assets/images/rightArrow.png")}
            />
          </Pressable>
        </View>
      </ScrollView>
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
  ViewIntoScrollView: {
    alignSelf: "center",
    alignItems: "center",
    width: wp(100),
    paddingHorizontal: 20,
    // paddingVertical: 15,
  },
  changePasswordImage: {
    width: wp(50),
    height: hp(20),
    marginTop: hp(5),
    marginBottom: hp(5),
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
