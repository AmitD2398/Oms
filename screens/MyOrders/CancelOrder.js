import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  Keyboard,
} from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import OrderTracking from "./OrderTracking";
import { fetchUrl } from "../../Utils/FetchHelper";
import { CANCEL_ORDER_URL } from "../../Utils/ApiUrlConstants";
import Loader from "../../components/Common/LoaderModal";
import { showToastWithGravity } from "../../components/Common/SnackBar";
import { useSelector, useDispatch } from "react-redux";
import { unAuthorizedHandler } from "../../Utils/UnAuthorizedHandler";
import NoRecordFoundComponent from "../../components/Common/NoRecordFoundComponent";
import moment from "moment";
import SelectorModal from "../../Utils/SizeQuantityList";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { clientId } from "../../constants/Constant";

const bSheetRef = React.createRef();
export default function CancelOrder({ navigation, route: { params } }) {
  const { order_id, cart_id, productAllData, productInfo } = params;
  const { token } = useSelector((state) => state.tokenReducer);
  const { imageBaseUrl } = useSelector((state) => state.imageBaseUrlReducer);

  const dispatch = useDispatch();

  const [loader, setLoader] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [remarkValue, setRemarkValue] = useState("");

  let orderCancelApiParams = {
    order_id: order_id,
    cart_id: cart_id,
    cancel_reason: cancelReason,
    cancel_remarks: remarkValue,
    client_id:clientId,
  };
  // console.log("orderCancelApiParams", orderCancelApiParams);
  const orderCancelApi = () => {
    setLoader(true);
    fetchUrl(orderCancelApiParams, token, CANCEL_ORDER_URL)
      .then((resJson) => {
        ////////////////////
        setLoader(false);
        // console.log("ORDER_CANCEL_API_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          // showToastWithGravity(resJson?.message);
          navigation.navigate("OrderPlacedSuccessfully", {
            screenHeading: "Order Cancelled",
            heading: "Cancellation Successful!",
            content:
              "We're sorry this order didn't workout for you, but we hope we'll see you again.",
            button: "Home",
            fromPath: "CancelOrder",
          });
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        } else if (resJson?.status == 400) {
          showToastWithGravity(resJson?.message);
        }else if (resJson?.status == 404) {
          showToastWithGravity(resJson?.message);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("ORDER_CANCEL_API_Error::", error);
      });
  };

  return (
    <ScreenWrapper>
      <View style={[styles.headerView]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image
            resizeMode="contain"
            style={styles.backButton}
            source={require("../../assets/images/backArrow.png")}
          />
        </Pressable>
        <Text style={styles.headerText}>Cancel Order</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.viewIntoScrollView}>
          <View style={{ flexDirection: "row" }}>
            <Text style={[styles.orderStatusAllTextNew, { marginTop: 0 }]}>
              {`Order ID  #${order_id}`}
            </Text>
            <Text
              style={[styles.orderStatusAllTextNew, { color: "green" }]}
            ></Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={[
                styles.orderStatusAllTextNew,
                {
                  marginTop: 0,
                  color: "#646464",
                  fontFamily: "OpenSans-Regular",
                },
              ]}
            >
              Order Status
            </Text>
            {productInfo?.order_status == 1 && ( //=============
              <Text style={[styles.orderStatusAllTextNew, { color: "green" }]}>
                {`  Booked`}
              </Text>
            )}
            {productInfo?.order_status == 5 && ( //=============
              <Text style={[styles.orderStatusAllTextNew, { color: "green" }]}>
                {`  Processing`}
              </Text>
            )}
          </View>
          <View style={styles.productDetailsView}>
            <View style={styles.orderImageAndTextRow}>
              <View style={styles.orderImageView}>
                <Image
                  resizeMode="contain"
                  style={styles.orderImage}
                  // source={require("../../assets/images/orderDetail.png")}
                  source={{ uri: imageBaseUrl + productInfo?.image_1 }}
                />
              </View>
              <View style={styles.orderTextView}>
                <Text numberOfLines={1} style={styles.orderTitle}>
                  {productInfo?.product_name}
                </Text>
                <Text numberOfLines={1} style={styles.orderDesc}>
                  {/* Blue & red stirps dress */}
                  {productInfo?.description}
                </Text>
                <Text style={styles.orderDesc}>Size: {productInfo?.size}</Text>
                {/* 0->InCart,1->Booked, 2->Cancelled,3->Shipped,4->Delivered ,5->Processing  */}
                <Text style={[styles.orderDesc, { color: "green" }]}>
                  Delivery By:{" "}
                  {moment(productInfo?.delivery_date).format(
                    "ddd, DD MMM YYYY"
                  )}
                </Text>
              </View>
            </View>
            <View style={styles.horizontalLine}></View>
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailKey}>Order date</Text>
              <Text style={styles.orderDetailValue}>
                {moment(productAllData?.order_date).format("DD MMM YYYY")}
              </Text>
            </View>
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailKey}>Order ID</Text>
              <Text style={styles.orderDetailValue}>#{order_id}</Text>
            </View>
            <View style={styles.orderDetailRow}>
              <Text style={styles.orderDetailKey}>Order Total</Text>
              <Text style={styles.orderDetailValue}>
                Rs. {productAllData?.total_payable} ({productInfo?.cart_qty}
                {"  "}
                {Number(productInfo?.cart_qty) > 1 ? "items" : "item"})
              </Text>
            </View>
            <View style={styles.horizontalLine}></View>
          </View>

          <View style={styles.deliveryAddressView}>
            <Text style={styles.deliveryAddressHeading}>
              Why you want to cancel this order?
            </Text>
            <View style={[styles.horizontalLine, { marginVertical: 0 }]}></View>
            <View style={{ padding: 10 }}>
              <Pressable
                onPress={() => setCancelModal(true)}
                style={[
                  styles.nameAndMobileView,
                  {
                    alignItems: "center",
                    justifyContent: "space-between",
                  },
                ]}
              >
                <Text numberOfLines={1} style={styles.nameText}>
                  {cancelReason ? cancelReason : "Choose Reason"}
                </Text>
                <Image
                  style={{ height: 10, width: 10, tintColor: "#161B2F" }}
                  source={require("../../assets/images/dropDown.png")}
                />
              </Pressable>
              <View
                style={[styles.horizontalLine, { marginVertical: 2 }]}
              ></View>
              <View style={styles.addressTextView}>
                <Text style={styles.addressText}></Text>
                <TextInput
                  value={remarkValue}
                  maxLength={150}
                  placeholder="Remarks (optional)"
                  placeholderTextColor={"#646464"}
                  autoCorrect={false}
                  multiline={true}
                  underlineColorAndroid="transparent"
                  style={{
                    fontSize: 14,
                    color: "#161B2F",
                    fontFamily: "OpenSans-Regular",
                    paddingRight: 10,
                  }}
                  returnKeyType="done"
                  blurOnSubmit={true}
                  onSubmitEditing={() => {
                    Keyboard.dismiss();
                  }}
                  onChangeText={setRemarkValue}
                />
              </View>
              <View
                style={[styles.horizontalLine, { marginVertical: 2 }]}
              ></View>
            </View>
          </View>

          <Pressable
            onPress={() => {
              if (cancelReason) orderCancelApi();
              else showToastWithGravity("Please select cancel reason");
            }}
            style={styles.trackButtonView}
          >
            <Text style={styles.trackButtonText}>Cancel Order</Text>
          </Pressable>
        </View>
      </ScrollView>
      <Loader loader={loader} setLoader={setLoader} />
      {cancelModal && (
        <SelectorModal
          modalName="Select Reason"
          dataList={productAllData?.cancel_reason}
          onChangeValue={(itm) => setCancelReason(itm)}
          isModal={cancelModal}
          setIsModal={setCancelModal}
          modelWraperCustomStyle={{ width: wp(75) }}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  horizontalLine: {
    alignSelf: "center",
    backgroundColor: "rgba(22, 27, 47, 0.15)",
    height: 1,
    width: "100%",
    marginVertical: 10,
    // marginBottom: 50,
  },
  headerView: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  backButton: {
    width: 40,
    height: 40,
  },
  headerText: {
    fontSize: 18,
    color: "#161B2F",
    fontFamily: "OpenSans-Bold",
  },
  viewIntoScrollView: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  productDetailsView: {
    backgroundColor: "#F2F5F6",
    borderRadius: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 15,
  },
  orderImageAndTextRow: {
    // backgroundColor: 'red',
    height: 110,
    alignItems: "center",
    flexDirection: "row",
  },
  orderImageView: {
    width: "25%",
    // backgroundColor: 'yellow',
    height: "100%",
    paddingTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  orderImage: {
    width: "100%",
    height: "100%",
    // backgroundColor: 'red',
  },
  orderTextView: {
    width: "75%",
    // backgroundColor: 'pink',
    height: "100%",
    padding: 5,
    paddingTop: 10,
    paddingLeft: 10,
    // justifyContent: 'center',
    // alignItems: 'flex-start',
  },
  orderTitle: {
    color: "#161B2F",
    fontSize: 15,
    fontFamily: "OpenSans-Medium",
    marginVertical: 1,
  },
  orderDesc: {
    color: "#646464",
    fontSize: 12,
    fontFamily: "OpenSans-Medium",
    marginVertical: 1,
  },
  orderDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "95%",
  },
  orderDetailKey: {
    fontSize: 13,
    color: "#161B2F",
    fontFamily: "OpenSans-SemiBold",
  },
  orderDetailValue: {
    fontSize: 13,
    color: "#646464",
    fontFamily: "OpenSans-Regular",
    width: "65%",
  },
  orderStatusAllTextNew: {
    color: "#161B2F",
    fontSize: 15,
    fontFamily: "OpenSans-SemiBold",
  },
  trackButtonView: {
    backgroundColor: "#DD1B47",
    height: 40,
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  trackButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "OpenSans-Medium",
  },
  //////////
  deliveryAddressView: {
    marginVertical: 15,
    borderWidth: 1,
    borderColor: "rgba(22, 27, 47, 0.2)",
    borderRadius: 5,
  },
  deliveryAddressHeading: {
    color: "#161B2F",
    fontSize: 14,
    fontFamily: "OpenSans-SemiBold",
    margin: 10,
  },
  nameAndMobileView: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "green",
    width: "100%",
    height: 30,
  },
  nameText: {
    color: "#161B2F",
    fontSize: 14,
    fontFamily: "OpenSans-SemiBold",
  },
  addressTextView: {
    width: "100%",
  },
  addressText: {
    color: "#646464",
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
  },
});
