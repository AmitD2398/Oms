import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector, useDispatch } from "react-redux";
import { NOTIFICATIONS_URL } from "../../Utils/ApiUrlConstants";
import { fetchUrl } from "../../Utils/FetchHelper";
import { useFocusEffect } from "@react-navigation/native";
import { unAuthorizedHandler } from "../../Utils/UnAuthorizedHandler";
import moment from "moment";
import Loader from "../../components/Common/LoaderModal";
import { showToastWithGravity } from "../../components/Common/SnackBar";
import NoRecordFoundComponent from "../../components/Common/NoRecordFoundComponent";

export default function Notifications({ navigation }) {
  const { token } = useSelector((state) => state.tokenReducer);
  const { imageBaseUrl } = useSelector((state) => state.imageBaseUrlReducer);
  // console.log("token>>>>>>>>>>>>>>>>>>>>>>>Notifications", token);

  const dispatch = useDispatch();

  const [loader, setLoader] = useState();
  // const [NewNotifications, setNewNotifications] = useState([]);
  // const [EarlierNotifications, setEarlierNotifications] = useState([]);
  const [Notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      notificationsApi();
    }, [token])
  );

  const notificationsApi = () => {
    setLoader(true);
    fetchUrl({}, token, NOTIFICATIONS_URL)
      .then((resJson) => {
        ////////////////////
        setLoader(false);
        // console.log("NOTIFICATIONSAPI_result =====", resJson);
        // showToastWithGravity(resJson?.messa ge);
        if (resJson?.status == 200) {
          setNotifications(resJson?.data);
          setUnreadCount(resJson?.unread);
        } else if (resJson?.status == 400) {
          showToastWithGravity(resJson?.message);
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("NOTIFICATIONSAPI_Error::", error);
      });
  };

  const renderItem = (item, index) => {
    return (
      <TouchableOpacity
        // onPress={() => navigation.navigate("NotificationsDetail")}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate("NotificationsDetail", {
            notificationId: item?.id,
            subject: item?.subject,
            desc: item?.body,
            imageUrl: item?.image,
            // date: formatDate(new Date(item?.create_date)),
            // time: formatTime(new Date(item?.create_date))
            date: moment(item?.create_date).format("DD-MM-YYYY"),
            time: moment(item?.create_date).format("hh:mm a"),
            // date: "24-10-2022",
            // time: "12:05 PM",
          })
        }
        key={item?.id}
        style={[
          styles.notificationItemViewContainer,
          {
            // borderBottomWidth:
            //   Notifications?.length != 1 && Notifications?.length - 1 != index
            //     ? 0.5
            //     : 0,
            borderBottomWidth: 1,
            borderBottomColor: "rgba(22, 27, 47, 0.08)",
          },
        ]}
      >
        <View
          style={{
            width: "15%",
            alignItems: "flex-start",
            justifyContent: "center",
            // backgroundColor: "red",
          }}
        >
          {item?.image ? (
            <Image
              // resizeMode="cover"
              // source={require("../../assets/images/InfoDelivery.png")}
              // source={require("../../assets/images/notificationImage.png")}
              source={{ uri: imageBaseUrl + item?.image }}
              style={{
                height: 48,
                width: 48,
                borderRadius: 48 / 2,
              }}
            />
          ) : (
            <Image
              // resizeMode="cover"
              // source={require("../../assets/images/InfoDelivery.png")}
              source={require("../../assets/images/notificationImage.png")}
              style={{
                height: 48,
                width: 48,
                borderRadius: 48 / 2,
              }}
            />
          )}
        </View>
        <View
          style={{
            width: "65%",
            justifyContent: "center",
            alignItems: "flex-start",
            padding: 5,
            // backgroundColor: "red",
          }}
        >
          <Text
            numberOfLines={2}
            style={{
              fontSize: 14,
              width: "95%",
              fontFamily: "OpenSans-Regular",
              color: "#646464",
              // alignItems: "flex-start",
            }}
          >
            {item?.subject}
          </Text>
        </View>
        <View
          style={{
            width: "22%",
            justifyContent: "center",
            padding: 5,
            // alignItems: "flex-start",
          }}
        >
          <Text
            style={{
              fontSize: 13,
              color: "#646464",
              fontFamily: "OpenSans-Regular",
              alignSelf: "flex-end",
              marginBottom: 4,
            }}
          >
            {/* {calculateDfferenceTimeHours("2022-11-17 12:36:55")} */}
            {/* {moment(item?.create_date).format("DD MMM hh:mm a")} */}

            {/* {moment(item?.create_date).format("DD MMM")} */}
            {/* {moment("2022-12-07 12:51:10").fromNow()} */}
            {moment(item?.create_date).fromNow()}

            {/* {moment(item?.create_date).format("DD MMM")}
            {moment(item?.create_date).format("hh:mm a")} */}
          </Text>
          {item?.status == "0" ? (
            <View
              style={{
                justifyContent: "flex-start",
                height: 13,
              }}
            >
              <View
                style={{
                  // backgroundColor: item?.status == "0" ? "red" : "transparent",
                  backgroundColor: "#000000",
                  width: 9,
                  height: 9,
                  borderRadius: 9 / 2,
                  alignSelf: "flex-end",
                }}
              ></View>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper>
      <>
        <View style={[styles.headerView]}>
          <Text style={styles.headerText}>Inbox</Text>
          {unreadCount != 0 ? (
            <View style={styles.countView}>
              <Text style={styles.countText}>{unreadCount}</Text>
            </View>
          ) : null}
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* <View style={styles.viewIntoScrollView}>
              <View style={styles.newHeaderView}>
                <Text style={styles.newHeaderText}>New</Text>
                <View style={styles.countView}>
                  <Text style={styles.countText}>{unreadCount}</Text>
                </View>
              </View>
              <View>
                {NewNotifications?.map((item, index) => {
                  return renderItem(item, index, false);
                })}
              </View>
              <View style={styles.sectionSeperatorView}></View>
              <View style={styles.earlierHeaderView}>
                <Text style={styles.earlierText}>Earlier</Text>
                <View style={styles.countView}>
                  <Text style={styles.countText}>{unreadCount}</Text>
                </View>
              </View>
              <View>
                {EarlierNotifications?.map((item, index) => {
                  return renderItem(item, index, true);
                })}
              </View>
            </View>
             */}

          {loader == false && (
            <View style={{ marginTop: 15 }}>
              {Notifications?.map((item, index) => {
                return renderItem(item, index, true);
              })}
            </View>
          )}
          {Notifications?.length == 0 && loader == false && (
            <View style={{ height: 200 }}>
              <NoRecordFoundComponent
                contentText={"Sorry ! No Notifications Found"}
              />
            </View>
          )}
        </ScrollView>
      </>
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
    paddingHorizontal: 10,
    // paddingVertical: 5,
    // backgroundColor: 'red',
    marginTop: 5,
  },
  headerText: {
    fontSize: 18,
    color: "#161B2F",
    fontFamily: "OpenSans-Bold",
  },
  viewIntoScrollView: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  newHeaderView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  newHeaderText: {
    color: "#161B2F",
    fontSize: 15,
    fontFamily: "OpenSans-SemiBold",
    marginRight: 4,
  },
  countView: {
    backgroundColor: "#24AAE3",
    height: 18,
    borderRadius: 15,
    alignItems: "center",
    padding: 1,
    paddingHorizontal: 5,
    justifyContent: "center",
    marginLeft: 5,
  },
  countText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "OpenSans-SemiBold",
  },
  //////
  sectionSeperatorView: {
    backgroundColor: "#F2F2F2",
    height: 3,
    width: wp(100),
    alignSelf: "center",
    marginVertical: 5,
  },
  ////////
  earlierHeaderView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  earlierText: {
    color: "#161B2F",
    fontSize: 15,
    fontFamily: "OpenSans-SemiBold",
    marginRight: 4,
  },
  ////////
  notificationItemViewContainer: {
    width: "94%",
    height: 80,
    flexDirection: "row",
    // backgroundColor: "yellow",
    alignSelf: "center",
    justifyContent: "space-between",
    // paddingHorizontal: 5,
  },
});
