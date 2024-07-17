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
import ScreenWrapper from "../components/ScreenWrapper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function SuccessScreen({ navigation, route: { params } }) {
  const { heading, content, subContent, button, fromPath } = params;
  const [secureEntry, setSecureEntry] = useState(true);
  const [secureEntryConfirm, setSecureEntryConfirm] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      //hardwareBackPress action
      const backAction = () => {
        fromPath && fromPath == "CheckoutAddress"
          ? navigation.navigate("CheckoutAddress")
          : navigation.navigate("BottomTabNavigation");
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );

  return (
    <ScreenWrapper>
      <View style={styles.ViewIntoScrollView}>
        <View style={styles.topView}>
          <View style={styles.backButtonView}>
            <Pressable
              style={{ left: -10 }}
              onPress={() =>
                fromPath && fromPath == "CheckoutAddress"
                  ? navigation.navigate("CheckoutAddress")
                  : navigation.navigate("BottomTabNavigation")
              }
            >
              <Image
                resizeMode="contain"
                style={styles.backButtonImage}
                source={require("../assets/images/backArrow.png")}
              />
            </Pressable>
            <Text style={styles.backButtonHeadingText}>{heading}</Text>
          </View>
        </View>
        <View style={styles.middleView}>
          <Image
            resizeMode="contain"
            style={styles.successImage}
            source={require("../assets/images/passwordSuccessImage.png")}
          />
          <Text style={styles.title}>{content}</Text>
          <Text style={styles.subTitle}>{subContent}</Text>
        </View>
        <View style={styles.bottomView}>
          <Pressable
            onPress={() =>
              fromPath && fromPath == "CheckoutAddress"
                ? navigation.navigate("CheckoutAddress")
                : navigation.navigate("BottomTabNavigation")
            }
            // onPress={() => navigation.navigate("CheckoutAddress")}
            // onPress={() => navigation.goBack()}
            style={styles.doneButton}
          >
            <Text style={styles.doneText}>{button}</Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  ViewIntoScrollView: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
    width: wp(100),
    paddingHorizontal: 20,
    // paddingVertical: 15,
  },
  topView: {
    flex: 0.6,
    width: "100%",
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
  middleView: {
    flex: 1.5,
    width: "100%",
    alignItems: "center",
    // justifyContent: '',
  },
  successImage: {
    width: wp(50),
    height: wp(50),
    // marginTop: hp(15),
    // marginBottom: hp(5),
  },
  title: {
    fontSize: 28,
    fontFamily: "OpenSans-SemiBold",
    color: "#161B2F",
    // marginVertical: hp(2),
  },
  subTitle: {
    textAlign: "center",
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
    color: "#7E7E7E",
    // marginBottom: 20,
  },
  bottomView: {
    flex: 0.7,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  doneButton: {
    // marginTop: hp(25),
    backgroundColor: "#1A97CC",
    borderRadius: 5,
    height: 45,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  doneText: {
    color: "white",
    fontSize: 15,
    fontFamily: "OpenSans-Medium",
  },
});
