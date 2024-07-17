import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useSelector, useDispatch } from "react-redux";
import {
  SHOW_NOTIFICATION_URL,
  DELETE_NOTIFICATION_URL,
} from "../../Utils/ApiUrlConstants";
import { fetchUrl } from "../../Utils/FetchHelper";
import Loader from "../../components/Common/LoaderModal";
import { showToastWithGravity } from "../../components/Common/SnackBar";
import { unAuthorizedHandler } from "../../Utils/UnAuthorizedHandler";

const { width, height } = Dimensions.get("window");

export default function NotificationsDetail({ navigation, route: { params } }) {
  const { token } = useSelector((state) => state.tokenReducer);
  const { imageBaseUrl } = useSelector((state) => state.imageBaseUrlReducer);
  const { notificationId, subject, desc, date, time, imageUrl } = params;

  const dispatch = useDispatch();
  // console.log("imageUrl", imageUrl);

  const [loader, setLoader] = useState(false);

  useEffect(() => {
    readNotificationApi();
  }, []);

  const readNotificationApi = () => {
    fetchUrl({ notification_id: notificationId }, token, SHOW_NOTIFICATION_URL)
      .then((resJson) => {
        ////////////////////
        // setLoader(false);
        // console.log("READ_NOTIFICATION_API_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          // console.log("accessToken", resJson?.data?.login_token?.token);
        }
      })
      .catch((error) => {
        // setLoader(false);
        console.log("READ_NOTIFICATION_API_Error::", error);
      });
  };
  const deleteNotificationApi = () => {
    fetchUrl(
      { notification_id: notificationId },
      token,
      DELETE_NOTIFICATION_URL
    )
      .then((resJson) => {
        ////////////////////
        setLoader(false);
        // console.log("DELETE_NOTIFICATION_API_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          showToastWithGravity(resJson?.message);
          navigation.goBack();
        } else if (resJson?.status == 400) {
          showToastWithGravity(resJson?.message);
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("DELETE_NOTIFICATION_API_Error::", error);
      });
  };

  return (
    <ScreenWrapper>
      <View style={[styles.headerView]}>
        {/* <Text style={styles.headerText}>Inbox</Text> */}
        <Pressable onPress={() => navigation.goBack()}>
          <Image
            resizeMode="contain"
            style={styles.backButtonImage}
            source={require("../../assets/images/backArrow2.png")}
          />
        </Pressable>
        <Pressable
          style={{ marginRight: 10 }}
          onPress={() => deleteNotificationApi()}
        >
          <Image
            resizeMode="contain"
            style={styles.deleteIcon}
            source={require("../../assets/images/deleteIcon.png")}
          />
        </Pressable>
      </View>
      {loader == false ? (
        <ScrollView
          showsVerticalScrollIndicator={true}
          style={{ width: width, height: height }}
          contentContainerStyle={{ alignItems: "center" }}
        >
          <View style={{ width: "90%", marginTop: 15 }}>
            <View style={styles.notificationImageView}>
              {imageUrl ? (
                <Image
                  resizeMode="stretch"
                  // source={{ uri: imageUrl }}
                  source={{ uri: imageBaseUrl + imageUrl }}
                  style={styles.notificationImageStyle}
                />
              ) : (
                <Image
                  resizeMode="stretch"
                  source={require("../../assets/images/notificationDetailImage.png")}
                  style={styles.notificationImageStyle}
                />
              )}
            </View>
            <Text style={styles.notifSubject}>{subject}</Text>
            <View style={styles.notifDateTimeView}>
              <Text style={styles.notifDateText}>{date}</Text>
              <Text style={styles.notifDateText}>|</Text>
              <Text style={styles.notifDateText}>{time}</Text>
            </View>
          </View>
          {/* <View style={styles.horizontalLine}></View> */}
          <View style={styles.descView}>
            <Text style={styles.notifDesc}>{desc}</Text>
          </View>
        </ScrollView>
      ) : (
        <Loader loader={loader} setLoader={setLoader} />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    paddingBottom: 5,
    // backgroundColor: 'red',
    marginTop: 5,
  },
  backButtonImage: {
    height: 19,
    width: 19,
    marginLeft: 10,
  },
  deleteIcon: {
    height: 16,
    width: 16,
    tintColor: "#161B2F",
  },
  notificationImageView: {
    // width: "100%",
    backgroundColor: "white",
    height: 150,
  },
  notificationImageStyle: {
    alignSelf: "center",
    width: "100%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D8DDEB",
  },
  notifSubject: {
    width: "95%",
    fontSize: 15,
    fontFamily: "OpenSans-Bold",
    color: "#161B2F",
    marginTop: 10,
  },
  notifDateTimeView: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "45%",
  },
  notifDateText: {
    alignSelf: "center",
    fontSize: 13,
    fontFamily: "OpenSans-Regular",
    color: "#646464",
  },
  descView: {
    width: "90%",
    marginBottom: 30,
    marginTop: 20,
    paddingHorizontal: 4,
  },
  notifDesc: {
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
    color: "#646464",
    lineHeight: 20,
    textAlign: "left",
  },
  horizontalLine: {
    backgroundColor: "#D8DDEB",
    width: "92%",
    height: 1,
    marginVertical: 15,
  },
});
