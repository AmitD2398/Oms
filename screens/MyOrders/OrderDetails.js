import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import OrderTracking from "./OrderTracking";
import { fetchUrl } from "../../Utils/FetchHelper";
import { ALL_ORDERS_URL, ORDER_DETAILS_URL } from "../../Utils/ApiUrlConstants";
import Loader from "../../components/Common/LoaderModal";
import { showToastWithGravity } from "../../components/Common/SnackBar";
import { useSelector, useDispatch } from "react-redux";
import { unAuthorizedHandler } from "../../Utils/UnAuthorizedHandler";
import NoRecordFoundComponent from "../../components/Common/NoRecordFoundComponent";
import moment from "moment";
import { FontAwesome } from "@expo/vector-icons";

const bSheetRef = React.createRef();
export default function OrderDetails({ navigation, route: { params } }) {
  const { order_id, cart_id } = params;
  const { token } = useSelector((state) => state.tokenReducer);
  const { imageBaseUrl } = useSelector((state) => state.imageBaseUrlReducer);

  const dispatch = useDispatch();

  const [loader, setLoader] = useState(true);
  const [baseUrl, setBaseUrl] = useState("");
  const [productAllData, setProductAllData] = useState([]);
  const [productInfo, setProductInfo] = useState([]);
  // console.log("productInfo", productInfo?.pp_id);

  // console.log("cart_id", cart_id);
  useEffect(() => {
    OrderDetailsApi();
  }, []);

  const OrderDetailsApi = () => {
    fetchUrl({ order_id: order_id, cart_id: cart_id }, token, ORDER_DETAILS_URL)
      .then((resJson) => {
        ////////////////////
        setLoader(false);
        // console.log("ORDER_DETAILS_API_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          setProductAllData(resJson?.data);
          setProductInfo(resJson?.data?.details[0]);
          // setBaseUrl(resJson?.base_url);
          // showToastWithGravity(resJson?.message);
          // setProductListData(resJson?.listing);
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        } else if (resJson?.status == 404) {
          // showToastWithGravity(resJson?.message);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("ORDER_DETAILS_API_Error::", error);
      });
  };

  //{moment(productAllData?.order_date).format("ddd, DD MMM")}
  const momentFormatFunc = (date) => {
    return moment(date).format("ddd, DD MMM");
  };

  return (
    <ScreenWrapper>
      <OrderTracking bSheetRef={bSheetRef} />

      <View style={[styles.headerView]}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image
            resizeMode="contain"
            style={styles.backButton}
            source={require("../../assets/images/backArrow.png")}
          />
        </Pressable>
        <Text style={styles.headerText}>Order Details</Text>
      </View>
      {loader == false && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.viewIntoScrollView}>
            <View style={styles.productDetailsView}>
              <View style={styles.orderImageAndTextRow}>
                <Pressable
                  onPress={() =>
                    navigation.push("ProductDetails", {
                      productId: productInfo?.product_id,
                      productPriceId: productInfo?.pp_id,
                    })
                  }
                  style={styles.orderImageView}
                >
                  <Image
                    resizeMode="contain"
                    style={styles.orderImage}
                    // source={require("../../assets/images/orderDetail.png")}
                    source={{ uri: imageBaseUrl + productInfo?.image_1 }}
                  />
                </Pressable>
                <View style={styles.orderTextView}>
                  <Text numberOfLines={1} style={styles.orderTitle}>
                    {productInfo?.product_name}
                  </Text>
                  <Text numberOfLines={1} style={styles.orderDesc}>
                    {/* Blue & red stirps dress */}
                    {productInfo?.description}
                  </Text>
                  <Text style={styles.orderDesc}>
                    Size: {productInfo?.size}
                  </Text>

                  {/* 0->InCart,1->Booked, 2->Cancelled,3->Shipped,4->Delivered ,5->Processing  */}
                  {productInfo?.order_status == 2 && ( //=============
                    <Text style={[styles.orderDesc, { color: "#DD1B47" }]}>
                      Cancelled
                    </Text>
                  )}
                  {productInfo?.order_status != 2 &&
                    productInfo?.order_status != 4 && ( //=============
                      <Text style={[styles.orderDesc, { color: "green" }]}>
                        Delivery By:{" "}
                        {moment(productInfo?.delivery_date).format(
                          "ddd, DD MMM YYYY"
                        )}
                      </Text>
                    )}
                  {productInfo?.order_status == 4 && ( //=============
                    <Text style={[styles.orderDesc, { color: "green" }]}>
                      Delivered
                    </Text>
                  )}
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
                <Text style={styles.orderDetailValue}>
                  #{productAllData?.id}
                </Text>
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

              <View style={{ flexDirection: "row" }}>
                <View style={{ width: "65%" }}>
                  {/* {productInfo?.order_status != 2 && //=============
                    productInfo?.order_status != 4 && (
                      <Text
                        style={[
                          styles.orderStatusAllTextNew,
                          { color: "green" },
                        ]}
                      >
                        Arriving{" "}
                        {moment(productInfo?.delivery_date).format(
                          "ddd, DD MMM"
                        )}
                      </Text>
                    )} */}
                  <Text
                    style={[styles.orderStatusAllTextNew, { marginTop: 0 }]}
                  >
                    Order Status
                  </Text>
                  {productInfo?.order_status == 1 && ( //=============
                    <Text
                      style={[styles.orderStatusAllTextNew, { color: "green" }]}
                    >
                      Booked On {/* format("ddd, DD MMM") */}
                      {momentFormatFunc(productAllData?.order_date)}
                    </Text>
                  )}
                  {productInfo?.order_status == 2 && ( //=============
                    <Text
                      style={[
                        styles.orderStatusAllTextNew,
                        { color: "#DD1B47" },
                      ]}
                    >
                      Cancelled On {momentFormatFunc(productInfo?.status_date)}
                    </Text>
                  )}
                  {productInfo?.order_status == 3 && ( //=============
                    <Text
                      style={[styles.orderStatusAllTextNew, { color: "green" }]}
                    >
                      Shipped On {momentFormatFunc(productInfo?.status_date)}
                    </Text>
                  )}
                  {productInfo?.order_status == 4 && ( //=============
                    <Text
                      style={[styles.orderStatusAllTextNew, { color: "green" }]}
                    >
                      Delivered On {momentFormatFunc(productInfo?.status_date)}
                    </Text>
                  )}
                  {productInfo?.order_status == 5 && ( //=============
                    <Text
                      style={[styles.orderStatusAllTextNew, { color: "green" }]}
                    >
                      Processing
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    width: "35%",
                    alignItems: "flex-end",
                  }}
                >
                  {productInfo?.order_status == 0 ||
                  productInfo?.order_status == 1 ||
                  productInfo?.order_status == 5 ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        style={{
                          width: 10,
                          height: 10,
                          tintColor: "#DD1B47",
                          marginRight: 4,
                        }}
                        source={require("../../assets/images/cancelOrder.png")}
                      />
                      <Text
                        onPress={() =>
                          navigation.navigate("CancelOrder", {
                            order_id: order_id,
                            cart_id: cart_id,
                            productAllData: productAllData,
                            productInfo: productInfo,
                          })
                        }
                        style={[
                          styles.orderStatusAllTextNew,
                          { color: "#DD1B47", fontSize: 14 },
                        ]}
                      >
                        Cancel Order
                      </Text>
                    </View>
                  ) : null}
                </View>
              </View>

              {/* <>
              <Text style={styles.orderArrivingDateText}>
                Arriving{" "}
                {moment(productInfo?.delivery_date).format("ddd, DD MMM")}
              </Text>
              <View style={styles.orderStatusView}>
                <View style={styles.progressImagesView}>
                  <View style={styles.progressImagesWrapper}>
                    {true ? ( //Ordered>>>>>>>>>
                      <Image
                        resizeMode="contain"
                        style={{ height: 20, width: 20 }}
                        source={require("../../assets/images/greenCheck.png")}
                      />
                    ) : (
                      <Image
                        resizeMode="contain"
                        style={{ height: 20, width: 20 }}
                        source={require("../../assets/images/circleImage.png")}
                      />
                    )}
                    {true ? (
                      <Image
                        resizeMode="contain"
                        style={{ height: 25, width: 25, marginVertical: 2 }}
                        source={require("../../assets/images/progressActive.png")}
                      />
                    ) : (
                      <Image
                        resizeMode="contain"
                        style={{ height: 25, width: 25, marginVertical: 2 }}
                        source={require("../../assets/images/progressPassive.png")}
                      />
                    )}

                    {true ? ( //Shipped>>>>>>>>>>>>
                      <Image
                        resizeMode="contain"
                        style={{ height: 20, width: 20 }}
                        source={require("../../assets/images/greenCheck.png")}
                      />
                    ) : (
                      <Image
                        resizeMode="contain"
                        style={{ height: 20, width: 20 }}
                        source={require("../../assets/images/circleImage.png")}
                      />
                    )}
                    {true ? (
                      <Image
                        resizeMode="contain"
                        style={{ height: 25, width: 25, marginVertical: 2 }}
                        source={require("../../assets/images/progressActive.png")}
                      />
                    ) : (
                      <Image
                        resizeMode="contain"
                        style={{ height: 25, width: 25, marginVertical: 2 }}
                        source={require("../../assets/images/progressPassive.png")}
                      />
                    )}
                    {true ? ( //OutForDelivery>>>>>>>>
                      <Image
                        resizeMode="contain"
                        style={{ height: 20, width: 20 }}
                        source={require("../../assets/images/greenCheck.png")}
                      />
                    ) : (
                      <Image
                        resizeMode="contain"
                        style={{ height: 20, width: 20 }}
                        source={require("../../assets/images/circleImage.png")}
                      />
                    )}
                  </View>
                </View>
                <View style={styles.orderStatusTextView}>
                  <Text numberOfLines={1} style={styles.statusText}>
                    Ordered Sunday, 10 Jul
                  </Text>
                  <View
                    style={[styles.horizontalLine, { marginVertical: 0 }]}
                  ></View>
                  <View style={{}}>
                    <View style={styles.shippedStatusView}>
                      <Text numberOfLines={1} style={styles.statusText}>
                        Shipped Sunday, 10 Jul
                      </Text>
                      <Image
                        resizeMode="contain"
                        style={styles.rightArrowIcon}
                        source={require("../../assets/images/rightArrow.png")}
                      />
                    </View>
                    <Text numberOfLines={2} style={styles.statusSubText}>
                      Item shipped to nearest delivery center
                    </Text>
                  </View>
                  <View
                    style={[styles.horizontalLine, { marginVertical: 0 }]}
                  ></View>
                  <Text numberOfLines={1} style={styles.statusText}>
                    Out for delivery
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => bSheetRef.current.open()}
                // onPress={() => navigation.navigate('OrderTracking')}
                style={styles.trackButtonView}
              >
                <Text style={styles.trackButtonText}>Track</Text>
              </Pressable>
            </> */}
            </View>

            <View style={styles.deliveryAddressView}>
              <Text style={styles.deliveryAddressHeading}>
                Delivery Address
              </Text>
              <View
                style={[styles.horizontalLine, { marginVertical: 0 }]}
              ></View>
              <View style={{ padding: 10 }}>
                <View style={styles.nameAndMobileView}>
                  <Text style={styles.nameText}>
                    {productAllData?.add_name}
                  </Text>
                  <View style={styles.verticalLine}></View>
                  <Text style={styles.nameText}>
                    {productAllData?.add_mobile}
                  </Text>
                </View>
                <View style={styles.addressTextView}>
                  <Text style={styles.addressText}>
                    {productAllData?.address}, {productAllData?.add_town},{" "}
                    {productAllData?.add_city},{`\n`}
                    {productAllData?.state_name}-{productAllData?.add_pin}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.borderContainer, { marginBottom: 30 }]}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.headingText}>Total Order Price</Text>
                <Text style={styles.headingText}>
                  Rs. {productInfo?.cart_mrp}
                </Text>
              </View>
              <Text style={styles.textUnderHeading}>
                You saved Rs.{" "}
                {Number(productInfo?.cart_mrp) -
                  Number(productInfo?.cart_sale_price)}{" "}
                on this order
              </Text>
              <View
                style={{
                  alignSelf: "center",
                  backgroundColor: "rgba(22, 27, 47, 0.2)",
                  height: 0.6,
                  width: "100%",
                  marginVertical: 5,
                }}
              ></View>
              <View style={styles.textRowView}>
                <Text style={styles.rowTextStyle}>Item Total</Text>
                <Text style={styles.rowTextStyle}>
                  Rs. {productInfo?.car_final_price}
                </Text>
              </View>
              <View style={styles.textRowView}>
                <Text style={styles.rowTextStyle}>Discounted Price</Text>
                <Text style={styles.rowTextStyle}>
                  Rs.{" "}
                  {Number(productInfo?.cart_mrp) -
                    Number(productInfo?.cart_sale_price)}
                </Text>
              </View>
              {/* <View style={styles.textRowView}>
              <Text style={styles.rowTextStyle}>Coupon discount</Text>
              <Text style={styles.rowTextStyle}>Rs. 0.00</Text>
            </View> */}
              <View style={styles.textRowView}>
                <Text style={styles.rowTextStyle}>Delivery Charges</Text>
                <Text style={styles.rowTextStyle}>
                  {Number(productAllData?.delivery_charges) > 0
                    ? `Rs. ${productAllData?.delivery_charges}`
                    : "Free"}
                </Text>
              </View>
              <View style={styles.textRowView}>
                <Text style={styles.totalAmountText}>Total Paid</Text>
                <Text style={styles.totalAmountText}>
                  Rs. {productInfo?.total_paid}
                </Text>
              </View>
              <View style={styles.paymentMethodView}>
                <Image
                  resizeMode="contain"
                  style={styles.paymentMethodImage}
                  source={require("../../assets/images/paymentMethod.png")}
                />
                <Text style={styles.textUnderHeading}>
                  Payment Method : {productInfo?.payment_method}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
      <Loader loader={loader} setLoader={setLoader} />
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
  orderArrivingDateText: {
    color: "#161B2F",
    fontSize: 15,
    fontFamily: "OpenSans-SemiBold",
    marginTop: 10,
  },
  orderStatusView: {
    flexDirection: "row",
    // backgroundColor: 'red',
    paddingVertical: 5,
    marginVertical: 5,
    // height: 130,
  },
  progressImagesView: {
    width: "10%",
    alignItems: "flex-start",
    justifyContent: "space-between",
    //   backgroundColor: 'pink',
  },
  progressImagesWrapper: {
    alignItems: "center",
  },
  orderStatusTextView: {
    width: "90%",
    //   backgroundColor: 'yellow',
    justifyContent: "space-between",
  },
  statusText: {
    color: "#646464",
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
  },
  shippedStatusView: {
    flexDirection: "row",
    //   backgroundColor: 'red',
    alignItems: "center",
    justifyContent: "space-between",
  },
  rightArrowIcon: {
    height: 15,
    width: 15,
    tintColor: "#161B2F",
  },
  statusSubText: {
    color: "rgba(100, 100, 100, 0.7)",
    fontSize: 12,
    fontFamily: "OpenSans-Regular",
  },
  trackButtonView: {
    backgroundColor: "#DD1B47",
    height: 35,
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  trackButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
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
    //   backgroundColor: 'green',
    width: "85%",
  },
  nameText: {
    color: "#161B2F",
    fontSize: 14,
    fontFamily: "OpenSans-SemiBold",
  },
  verticalLine: {
    height: 18,
    width: 1,
    backgroundColor: "rgba(22, 27, 47, 0.2)",
    marginHorizontal: 10,
  },
  addressTextView: {
    width: "85%",
    marginTop: 4,
  },
  addressText: {
    color: "#646464",
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
  },

  ///////////
  borderContainer: {
    borderWidth: 1,
    borderColor: "rgba(22, 27, 47, 0.2)",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headingText: {
    fontSize: 15,
    fontFamily: "OpenSans-SemiBold",
    color: "#161B2F",
  },
  textUnderHeading: {
    width: "90%",
    fontSize: 12,
    fontFamily: "OpenSans-Regular",
    color: "rgba(100, 100, 100, 0.7)",
  },
  textRowView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowTextStyle: {
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    color: "#646464",
    marginVertical: 2,
  },
  couponCodeView: {
    width: "100%",
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0,0.05)",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    flexDirection: "row",
    marginVertical: 4,
  },
  textInputStyle: {
    width: "80%",
    paddingHorizontal: 10,
    color: "#161B2F",
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
  },
  couponCodeText: {
    fontFamily: "OpenSans-Light",
    fontSize: 14,
    color: "#646464",
  },
  totalAmountText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 14,
    color: "#161B2F",
    marginVertical: 2,
  },
  paymentMethodView: {
    backgroundColor: "#F2F5F6",
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 5,
  },
  paymentMethodImage: {
    height: 20,
    width: 20,
    marginRight: 10,
  },
});
