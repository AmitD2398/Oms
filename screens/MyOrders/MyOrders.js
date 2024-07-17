import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
// import { Rating } from "react-native-ratings";
import { fetchUrl } from "../../Utils/FetchHelper";
import { ALL_ORDERS_URL } from "../../Utils/ApiUrlConstants";
import Loader from "../../components/Common/LoaderModal";
import { showToastWithGravity } from "../../components/Common/SnackBar";
import { useSelector, useDispatch } from "react-redux";
import { unAuthorizedHandler } from "../../Utils/UnAuthorizedHandler";
import NoRecordFoundComponent from "../../components/Common/NoRecordFoundComponent";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";

export default function MyOrders({ navigation }) {
  const { token } = useSelector((state) => state.tokenReducer);

  const dispatch = useDispatch();

  const [loader, setLoader] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");
  const [finalOrders, setFinalOrders] = useState([]);
  const [renderFinalOrders, setRenderFinalOrders] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredDataArray, setFilteredDataArray] = useState([]);

  // useEffect(() => {
  //   myOrdersApi();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      myOrdersApi();
    }, [])
  );

  const myOrdersApi = () => {
    setLoader(true);
    fetchUrl({}, token, ALL_ORDERS_URL)
      .then((resJson) => {
        ////////////////////
        setLoader(false);
        // console.log("ALL_ORDERS_API_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          let tempArray = [];
          resJson?.orders_data?.map((item, index) => {
            item?.details?.map((itm, ind) => {
              tempArray.push(itm);
            });
          });
          setFinalOrders(tempArray);
          setRenderFinalOrders(tempArray);
          setBaseUrl(resJson?.base_url);
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
        console.log("ALL_ORDERS_API_Error::", error);
      });
  };

  const onChangeSearch = (textString) => {
    let text = textString.trimStart();
    // console.log("text", text);
    try {
      setSearchText(text);
      const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      const containSplChar = specialChars.test(text);
      if (text.length === 0) {
        // fetch();
        setRenderFinalOrders(finalOrders);
      } else {
        if (containSplChar) {
          setRenderFinalOrders([]);
        } else {
          const filteredData = filterItems(text);
          // console.log("filteredItem", filteredData);
          setRenderFinalOrders(filteredData);
        }
      }
    } catch (error) {
      console.log("Error in onchangesearch in AllProducts::", error);
    }
  };

  const filterItems = (searchTerm) => {
    try {
      const filteredItems = [];
      finalOrders?.forEach((item) => {
        const regex = new RegExp(`\\b${searchTerm}`, "gi");
        if (regex.exec(item?.product_name)) {
          filteredItems.push(item);
        }
      });

      return filteredItems;
    } catch (error) {
      console.log("filter error:::", error);
    }
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
        <Text style={styles.headerText}>Purchase Orders</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchBarView}>
          <View style={styles.TextInputView}>
            <View style={styles.textInputAndIconView}>
              <TextInput
                // onPress={() => alert('')}
                placeholder="Search.."
                style={styles.textInput}
                onChangeText={onChangeSearch}
                value={searchText}
              />

              {/* <Pressable style={styles.searchIconView}>
                <Image
                  resizeMode="contain"
                  style={styles.searchIcon}
                  source={require("../../assets/images/searchIcon.png")}
                />
              </Pressable> */}
            </View>
          </View>
          {/* <View style={styles.filterView}>
            <Image
              resizeMode="contain"
              style={styles.filterIcon}
              source={require("../../assets/images/filter.png")}
            />
            <Text style={styles.filterText}>Filter</Text>
          </View> */}
        </View>
        {/* <View style={styles.recentOrdersContainer}>
          <Text style={styles.fieldHeading}>Recent Orders</Text>
          {RecentOrders.map((item, i) => {
            return (
              <Pressable
                onPress={() => navigation.navigate("OrderDetails")}
                key={item?.id}
                style={styles.recentItemView}
              >
                <View
                  style={{
                    // backgroundColor: 'red',
                    height: 90,
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <View style={styles.recentImageView}>
                    <Image
                      resizeMode="contain"
                      style={styles.recentImage}
                      source={require("../../assets/images/checkItOut.png")}
                    />
                  </View>
                  <View style={styles.recentItemMiddleView}>
                    <Text numberOfLines={1} style={styles.recentTitleText}>
                      Vero Moda
                    </Text>
                    <Text numberOfLines={1} style={styles.recentDescText}>
                      Blue & red stirps dress
                    </Text>
                    <Text style={styles.sizeText}>Size: M</Text>
                  </View>
                  <View style={styles.recentEndView}>
                    <View style={styles.recentEndViewFlexEndWrapper}>
                      <View style={styles.shippedRowView}>
                        <Image
                          resizeMode="contain"
                          style={styles.deliveryGreeenIcon}
                          source={require("../../assets/images/DeliveryVanGreen.png")}
                        />
                        <Text style={styles.shippedText}>Shipped</Text>
                      </View>
                      <Text style={styles.arrivingDateText}>
                        Arriving Wed, 20 Jul
                      </Text>
                    </View>
                    <Image
                      resizeMode="contain"
                      style={styles.recentItemArrowImage}
                      source={require("../../assets/images/rightArrow.png")}
                    />
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View> */}

        <View style={styles.allOrdersContainer}>
          <Text style={styles.fieldHeading}>All Orders</Text>
          {renderFinalOrders?.length == 0 && loader == false ? (
            <View style={{ height: 200 }}>
              <NoRecordFoundComponent />
            </View>
          ) : (
            // ordersArray?.map((item, i) => {
            // return item?.details?.map((itm, ind) => {
            renderFinalOrders?.map((itm, ind) => {
              return (
                <Pressable
                  // onPress={() => navigation.navigate("OrderRefund")}
                  onPress={() =>
                    navigation.navigate("OrderDetails", {
                      order_id: itm?.order_id,
                      cart_id: itm?.cart_id,
                    })
                  }
                  key={itm?.cart_id}
                  style={[styles.allOrdersItemView]}
                >
                  <View
                    style={{
                      // backgroundColor: 'red',
                      height: 90,
                      alignItems: "center",
                      flexDirection: "row",
                    }}
                  >
                    <View style={styles.recentImageView2}>
                      <Image
                        resizeMode="contain"
                        style={styles.recentImage2}
                        // source={require("../../assets/images/MyOrder.png")}
                        source={{ uri: baseUrl + itm?.image_1 }}
                      />
                    </View>
                    <View style={styles.recentItemMiddleView2}>
                      <Text numberOfLines={1} style={styles.recentTitleText2}>
                        {itm?.product_name}
                      </Text>
                      <Text numberOfLines={1} style={styles.recentDescText2}>
                        {/* Blue & red stirps dress */}
                        {itm?.description}
                      </Text>
                      <Text style={styles.sizeText2}>Size: {itm?.size}</Text>
                    </View>
                    <View style={styles.recentEndView2}>
                      <View style={styles.recentEndViewFlexEndWrapper2}>
                        {itm?.order_status == 3 ? (
                          <>
                            <View style={styles.shippedRowView2}>
                              <Image
                                resizeMode="contain"
                                style={styles.deliveryGreeenIcon2}
                                source={require("../../assets/images/DeliveryVanGreen.png")}
                              />
                              <Text style={styles.shippedText2}>Shipped</Text>
                            </View>
                            <Text style={styles.deliveredDateText2}>
                              {/* On Tue, 12 Jul */}
                              Arriving{" "}
                              {moment(itm?.modified_date).format("ddd, DD MMM")}
                            </Text>
                          </>
                        ) : (
                          <>
                            <View style={styles.shippedRowView2}>
                              {itm?.order_status == 1 ? (
                                <Image
                                resizeMode="contain"
                                style={styles.deliveryGreeenIcon2}
                                source={require("../../assets/images/DeliveryVanGreen.png")}
                              />
                              ) : null}
                              {itm?.order_status == 2 ? (
                                <Image
                                resizeMode="contain"
                                style={styles.deliveryGreeenIcon2}
                                source={require("../../assets/images/orderCancelled.png")}
                              />
                              ) : null}
                              {itm?.order_status == 4 ? (
                                <Image
                                resizeMode="contain"
                                style={styles.deliveryGreeenIcon2}
                                source={require("../../assets/images/DeliveryVanGreen.png")}
                              />
                              ) : null}
                              {itm?.order_status == 5 ? (
                                <Image
                                resizeMode="contain"
                                style={styles.deliveryGreeenIcon2}
                                source={require("../../assets/images/refundProcess.png")}
                              />
                              ) : null}

                              {itm?.order_status == 0 ? (
                                <Text style={styles.cancelText}>In Cart</Text>
                              ) : null}
                              {itm?.order_status == 1 ? (
                                <Text style={styles.cancelText}>Booked</Text>
                              ) : null}
                              {itm?.order_status == 2 ? (
                                <Text style={styles.cancelText}>Cancelled</Text>
                              ) : null}
                              {itm?.order_status == 4 ? (
                                <Text style={styles.shippedText2}>
                                  Delivered
                                </Text>
                              ) : null}
                              {itm?.order_status == 5 ? (
                                <Text style={styles.shippedText2}>
                                  Processing
                                </Text>
                              ) : null}
                            </View>
                            <Text style={styles.deliveredDateText2}>
                              {/* On Tue, 12 Jul */}
                              On{" "}
                              {moment(itm?.modified_date).format("ddd, DD MMM")}
                            </Text>
                          </>
                        )}
                      </View>
                      <Image
                        resizeMode="contain"
                        style={styles.recentItemArrowImage2}
                        source={require("../../assets/images/rightArrow.png")}
                        // source={{ uri: baseUrl + itm?.image_1 }}
                      />
                    </View>
                  </View>
                  {/* {true ? (
                    <View
                      style={{
                        alignSelf: "center",
                        backgroundColor: "rgba(22, 27, 47, 0.15)",
                        height: 1,
                        width: "98%",
                        marginVertical: 5,
                        // marginBottom: 50,
                      }}
                    ></View>
                  ) : null} */}

                  {/* {true ? (
                    <View style={styles.exchangereturnView}>
                      <Pressable style={styles.exchangeReturnButtonView}>
                        <Text style={styles.exchangeReturnButtonText}>
                          Exchange
                        </Text>
                      </Pressable>
                      <Pressable style={styles.exchangeReturnButtonView}>
                        <Text style={styles.exchangeReturnButtonText}>
                          Return
                        </Text>
                      </Pressable>
                    </View>
                  ) : null} */}

                  {/* {true ? (
                    <View style={styles.ratingRowView}>
                      <Text style={styles.rateProductText}>Rate Product</Text>
                      <View
                        style={{
                          // backgroundColor: 'pink',
                          height: "100%",
                          width: "35%",
                          // alignItems: 'center',
                          justifyContent: "center",
                          alignItems: "flex-start",
                        }}
                      >
                        <Rating
                          type="star"
                          ratingCount={5}
                          imageSize={16}
                          // showRating
                          // onFinishRating={(res) => console.log('ratings>>>', res)}
                        />
                      </View>
                    </View>
                  ) : null} */}

                  {/* {true ? (
                    <View style={styles.detailsView}>
                      <Text style={styles.detailsText}>
                        Give your TextInput a position: absolute styling and
                        change its position using the height returned by the
                        keyboardDidShow and keyboardDidHide events.
                      </Text>
                      <Pressable style={styles.viewDetailsRow}>
                        <Text style={styles.viewDetailText}>View Details</Text>
                        <Image
                          resizeMode="contain"
                          style={styles.viewDetailArrow}
                          source={require("../../assets/images/rightArrow.png")}
                        />
                      </Pressable>
                    </View>
                  ) : null} */}
                </Pressable>
              );
            })
            // });
            // })
          )}
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
  paymentRow: {
    marginVertical: 2,
    height: 45,
    justifyContent: "center",
    width: "100%",
  },
  paymentRowView: {
    alignItems: "center",
    height: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  ImageTextView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paymentOptionImage: {
    hight: 22,
    width: 22,
    marginRight: 8,
  },
  nameText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 14,
    color: "#161B2F",
  },
  arrowIcon: {
    width: 18,
    height: 18,
  },
  searchBarView: {
    paddingHorizontal: 10,
    flexDirection: "row",
  },
  TextInputView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: 'pink',
    // paddingVertical: 10,
    width: "100%",
  },
  textInputAndIconView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F5F6",
    borderRadius: 10,
  },
  textInput: {
    height: 40,
    width: "100%",
    // backgroundColor: '#F2F5F6',
    // borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    // paddingRight: 5,
    // backgroundColor: 'red',
  },
  searchIconView: {
    width: "15%",
    // backgroundColor: 'red',
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: "#161B2F",
  },
  filterView: {
    flexDirection: "row",
    alignItems: "center",
    //   backgroundColor: 'red',
    width: "17%",
    justifyContent: "flex-end",
  },
  filterIcon: {
    width: 15,
    height: 15,
    tintColor: "#161B2F",
  },
  filterText: {
    marginHorizontal: 2,
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
    color: "#646464",
  },
  //////////////////////////recent orders //////////////
  recentOrdersContainer: {
    marginHorizontal: 10,
  },
  fieldHeading: {
    color: "#161B2F",
    fontSize: 16,
    fontFamily: "OpenSans-SemiBold",
    marginTop: 20,
    marginBottom: 10,
  },
  recentItemView: {
    backgroundColor: "#F2F5F6",
    // height: 90,
    marginBottom: 10,
    borderRadius: 5,
    paddingBottom: 5, ///////
  },
  recentImageView: {
    width: "24%",
    // backgroundColor: 'yellow',
    height: "100%",
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  recentImage: {
    width: 65,
    height: 65,
  },
  recentItemMiddleView: {
    width: "46%",
    // backgroundColor: 'pink',
    height: "100%",
    padding: 5,
    paddingTop: 10,
    // justifyContent: 'center',
    // alignItems: 'flex-start',
  },
  recentTitleText: {
    color: "#161B2F",
    fontSize: 14,
    fontFamily: "OpenSans-Medium",
  },
  recentDescText: {
    color: "#646464",
    fontSize: 12,
    fontFamily: "OpenSans-Medium",
    marginVertical: 2,
  },
  sizeText: {
    color: "#646464",
    fontSize: 12,
    fontFamily: "OpenSans-Medium",
  },
  recentEndView: {
    width: "30%",
    // backgroundColor: 'orange',
    height: "100%",
    padding: 5,
    paddingTop: 10,
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  recentEndViewFlexEndWrapper: {
    alignItems: "flex-end",
  },
  shippedRowView: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    // backgroundColor: 'red',
  },
  deliveryGreeenIcon: {
    width: 22,
    height: 22,
    marginRight: 5,
    alignSelf: "flex-start",
  },
  shippedText: {
    color: "#1AA235",
    fontFamily: "OpenSans-SemiBold",
    fontSize: 14,
  },
  arrivingDateText: {
    color: "#646464",
    fontFamily: "OpenSans-Regular",
    fontSize: 10,
    marginVertical: 2,
  },
  deliveredDateText: {
    color: "#646464",
    fontFamily: "OpenSans-Regular",
    fontSize: 10,
    marginVertical: 2,
  },
  recentItemArrowImage: {
    width: 16,
    height: 16,
    tintColor: "#0E1525",
    alignSelf: "flex-end",
  },
  //////////////////////////all orders //////////////
  allOrdersContainer: {
    marginHorizontal: 10,
  },
  recentImageView2: {
    width: "24%",
    // backgroundColor: 'yellow',
    height: "100%",
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  recentImage2: {
    width: 65,
    height: 65,
    // backgroundColor: 'red',
  },
  recentItemMiddleView2: {
    width: "45%",
    // backgroundColor: 'pink',
    height: "100%",
    padding: 5,
    paddingTop: 10,
    // justifyContent: 'center',
    // alignItems: 'flex-start',
  },
  recentTitleText2: {
    color: "#161B2F",
    fontSize: 14,
    fontFamily: "OpenSans-Medium",
  },
  recentDescText2: {
    color: "#646464",
    fontSize: 12,
    fontFamily: "OpenSans-Medium",
    marginVertical: 2,
  },
  sizeText2: {
    color: "#646464",
    fontSize: 12,
    fontFamily: "OpenSans-Medium",
  },
  recentEndView2: {
    width: "30%",
    // backgroundColor: 'orange',
    height: "100%",
    padding: 5,
    paddingTop: 10,
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  recentEndViewFlexEndWrapper2: {
    alignItems: "flex-end",
  },
  shippedRowView2: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    // backgroundColor: 'red',
  },
  deliveryGreeenIcon2: {
    width: 22,
    height: 22,
    marginRight: 5,
    alignSelf: "flex-start",
  },
  shippedText2: {
    color: "#1AA235",
    fontFamily: "OpenSans-SemiBold",
    fontSize: 14,
  },
  cancelText: {
    color: "#646464",
    fontFamily: "OpenSans-SemiBold",
    fontSize: 14,
  },
  arrivingDateText2: {
    color: "#646464",
    fontFamily: "OpenSans-Regular",
    fontSize: 10,
    marginVertical: 2,
  },
  deliveredDateText2: {
    color: "#646464",
    fontFamily: "OpenSans-Regular",
    fontSize: 10,
  },
  recentItemArrowImage2: {
    width: 16,
    height: 16,
    tintColor: "#0E1525",
    alignSelf: "flex-end",
  },
  allOrdersItemView: {
    backgroundColor: "#F2F5F6",
    // height: 90,
    marginBottom: 10,
    borderRadius: 5,
    paddingVertical: 5,
    paddingBottom: 5, ///////
    paddingHorizontal: 4,
  },
  exchangereturnView: {
    height: 32,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    marginVertical: 5,
  },
  exchangeReturnButtonView: {
    width: "49%",
    height: "100%",
    backgroundColor: "#E0E3E3",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  exchangeReturnButtonText: {
    color: "#646464",
    fontSize: 14,
    fontFamily: "OpenSans-Medium",
  },
  ratingRowView: {
    alignSelf: "center",
    height: 25,
    width: "97%",
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: 10,
    paddingHorizontal: 5,
    //   marginVertical: 5,
    // backgroundColor: 'skyblue',
  },
  rateProductText: {
    fontSize: 12,
    fontFamily: "OpenSans-Regular",
    color: "#646464",
    marginRight: 10,
  },
  detailsView: {
    marginVertical: 5,
    marginHorizontal: 5,
    paddingHorizontal: 5,
  },
  detailsText: {
    fontSize: 12,
    color: "#646464",
    fontFamily: "OpenSans-Regular",
  },
  viewDetailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewDetailText: {
    color: "#DD1B47",
    fontFamily: "OpenSans-Regular",
    fontSize: 12,
    marginRight: 5,
    marginTop: 5,
  },
  viewDetailArrow: {
    width: 12,
    height: 12,
    tintColor: "#DD1B47",
    marginTop: 2,
  },
});
