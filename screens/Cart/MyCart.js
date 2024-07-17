import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  FlatList,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import SelectorModal from "../../Utils/SizeQuantityList";
import { useSelector, useDispatch } from "react-redux";
import {
  VIEW_CART_URL,
  DELETE_FROM_CART_URL,
  ADD_TO_CART_URL,
  ALL_ADDRESS_URL,
  PAYMENT_CHECKOUT_URL,
} from "../../Utils/ApiUrlConstants";
import { fetchUrl } from "../../Utils/FetchHelper";
import { showToastWithGravity } from "../../components/Common/SnackBar";
import { unAuthorizedHandler } from "../../Utils/UnAuthorizedHandler";
import { useFocusEffect } from "@react-navigation/native";
import {
  getObjectFromStorage,
  setObjectInStorage,
} from "../../Utils/AsyncStorageHelper";
import Loader from "../../components/Common/LoaderModal";
import NoRecordFoundComponent from "../../components/Common/NoRecordFoundComponent";
import { cartItemCountAction } from "../../redux/Actions/CartItemsCountAction";
import { colorSizeAction } from "../../redux/Actions/colorSizeAction";
import { clientId } from "../../constants/Constant";

export default function MyCart({ navigation, route: { params } }) {
  const { token } = useSelector((state) => state.tokenReducer);
  const { imageBaseUrl } = useSelector((state) => state.imageBaseUrlReducer);
  // console.log("token>>>>>>>>>>>>>>>>>>>>>>>cart", token);

  const dispatch = useDispatch();

  const [loader, setLoader] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [sizeModal, setSizeModal] = useState(false);
  const [quantityModal, setQuantityModal] = useState(false);
  const [quantityArray, setQuantityArray] = useState([]);
  const [cartAllData, setCartAllData] = useState([]);
  const [cartListDataArray, setCartListDataArray] = useState([]);
  const [cartListItemsCount, setCartListItemsCount] = useState("");
  const [size, setSize] = useState("N.A"); //"M"
  const [QtyOfCurrentItem, setQtyOfCurrentItem] = useState({});

  // console.log("deliveryAddress", deliveryAddress?.id);

  useFocusEffect(
    React.useCallback(() => {
      // console.log("carttttttttttttttt", token);
      getObjectFromStorage("_cartArray").then((result) => {
        // console.log("_cartArray", result);
        if (result && result?.length != 0) {
          // console.log("resultFromStorage", result); //result is an array of objects
          addToCartApi({
            request: JSON.stringify(result),
          });
        } else {
          token && viewCartApi();
        }
      });
      // return () => console.log("cartUnmounted>>>");
    }, [token])
  );

  const checkoutApi =()=>{
    fetchUrl({request_type: "cart",client_id:clientId},token,PAYMENT_CHECKOUT_URL)
    .then((resJson) => {
      ////////////////////
      setLoader(false);
      if (resJson?.status == 200) {
          if (deliveryAddress) {
                  navigation.navigate("Payment", {
                    selectedAddressId: deliveryAddress?.id,
                  });
                } else {
                  showToastWithGravity(
                    "Please add delivery address to continue"
                  );
                }
      } else if (resJson?.status == 400) {
        showToastWithGravity(resJson?.message);
        setObjectInStorage("_cartArray", []); // clearing cartData from LocalStorag after adding to Database
        viewCartApi();
      } else if (resJson?.status == 603) {
        unAuthorizedHandler(resJson, navigation, dispatch);
      }
    })
    .catch((error) => {
      setLoader(false);
      console.log("ADDTO_CART_Error::", error);
    });
  }

  const addToCartApi = (addToCartParams) => {
    /////////////>>>>>API
    // console.log("addToCartParamsXXXXXXXX", addToCartParams);
    setLoader(true);
    fetchUrl(addToCartParams, token, ADD_TO_CART_URL)
      .then((resJson) => {
        ////////////////////
        setLoader(false);
        // console.log("ADDTO_CART_result2 =====", resJson);
        showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          // showToastWithGravity(resJson?.message);
          // setTotalItemsCount(resJson?.total_items)
          setObjectInStorage("_cartArray", []); // clearing cartData from LocalStorag after adding to Database
          // setTimeout(() => {
          viewCartApi();
          // }, 200);
        } else if (resJson?.status == 400) {
          showToastWithGravity(resJson?.message);
          setObjectInStorage("_cartArray", []); // clearing cartData from LocalStorag after adding to Database
          viewCartApi();
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("ADDTO_CART_BULK_Error", error);
      });
  };

  let viewCartApiParams = {
    vendor_id: "4",
    client_id:clientId,
  };
  const viewCartApi = () => {
    ////////////////////>>>>>>API
    // loader == false ? setLoader(true) : null;
    setLoader(true);
    fetchUrl(viewCartApiParams, token, VIEW_CART_URL)
      .then((resJson) => {
        ////////////////////
        setLoader(false);
        setIsContentLoading(false);
        // console.log("VIEWCART_result2 =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          setCartAllData(resJson?.data);
          // console.log('asdfgh',resJson?.data?.cartlst)
          setCartListDataArray(resJson?.data?.cartlst);
          ///////////////////
          setCartListItemsCount(resJson?.data.cartlst?.length);
          dispatch(cartItemCountAction(resJson?.data.cartlst?.length));
          dispatch(colorSizeAction(resJson?.data?.cartlst));

          if (resJson?.data.cartlst?.length > 0) {
            getDefaultDeliveryAddressApi();
          }
        } else if (resJson?.status == 400) {
          showToastWithGravity(resJson?.message);
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        }
      })
      .catch((error) => {
        setLoader(false);
        setIsContentLoading(false);
        console.log("VIEWCART_Error::", error);
      });
  };

  // let deleteFromCartApiParams = {
  //   cart_id: "1638",
  // };
  const deleteFromCartApi = (deleteFromCartApiParams) => {
    ////////////////////>>>>>>API
    loader == false && setLoader(true);
    fetchUrl(deleteFromCartApiParams, token, DELETE_FROM_CART_URL)
      .then((resJson) => {
        ////////////////////
        // setLoader(false);
        // console.log("DELETEFROMCART_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          showToastWithGravity(resJson?.message);
          // console.log("accessToken", resJson?.data?.login_token?.token);
          setTimeout(() => {
            viewCartApi();
          }, 200);
        } else if (resJson?.status == 400) {
          showToastWithGravity(resJson?.message);
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("DELETEFROMCART_Error::", error);
      });
  };
  const quantityArrayCalculate = (allQtyValue) => {
    let allQtyInNumber = Number(allQtyValue);
    let qtyArray = [];
    for (let i = 1; i <= allQtyInNumber; i++) {
      qtyArray.push(i);
    }
    setQuantityArray(qtyArray);
    // return qtyArray;
  };
  const onChangeQuantity = (quantity) => {
    let itemToBeChangedQty = [
      {
        id: QtyOfCurrentItem?.p_id, //product_id
        pp_id: QtyOfCurrentItem?.pp_id, //product_price_id
        vendor_id: QtyOfCurrentItem?.vendor_id,
        selectedQuantity: quantity,
        client_id:clientId,
        // selectedQuantity: "10",
        // color: "Default",
        // size: "No Size",
        // color: "Black",
        // size: "XL",
        color: QtyOfCurrentItem?.color,
        size: QtyOfCurrentItem?.size,
        // id: "6065",
        // selectedQuantity: "2",
        // pp_id: "20898",
        // vendor_id: "4",
      },
    ];
    
    // console.log("itemToBeChangedQty", itemToBeChangedQty);
    addToCartApi({ request: JSON.stringify(itemToBeChangedQty) });
  };
  const getDefaultDeliveryAddressApi = () => {
    ////////////////////>>>>>>API
    // loader == false && setLoader(true);
    fetchUrl({}, token, ALL_ADDRESS_URL)
      .then((resJson) => {
        ////////////////////
        // setLoader(false);
        // console.log("ALL_ADDRESS_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          // showToastWithGravity(resJson?.message);
          // console.log("accessToken", resJson?.data?.login_token?.token);
          let defaultAddress = resJson?.data?.find(
            (item) => item?.default_address == 1
          );
          // console.log("apiData>>>>", defaultAddress);
          setDeliveryAddress(defaultAddress ? defaultAddress : null);
        } else if (resJson?.status == 400) {
          //  showToastWithGravity(resJson?.message);
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("ALL_ADDRESS_Error::", error);
      });
  };

  const renderItem = ({ item, index }) => {
    // console.log("itmmmmuu", item);
    return (
      <View style={{ width: "100%" }}>
        <View style={styles.itemView}>
          <Pressable
            onPress={() =>
              navigation.navigate("ProductDetails", {
                productId: item?.product_id,
                productPriceId: item?.pp_id,
              })
            }
            style={styles.itemImageView}
          >
            <Image
              resizeMode="contain"
              style={styles.itemImage}
              source={{ uri: imageBaseUrl ? imageBaseUrl + item?.image_1 : "" }}
            />
          </Pressable>
          <View style={styles.itemTextView}>
            <View style={styles.headingRow}>
              <Text numberOfLines={1} style={styles.itemTitle}>
                {item?.brand_name}
              </Text>
              <Pressable
                onPress={() => deleteFromCartApi({ cart_id: item?.cart_id })}
                style={styles.deleteIconView}
              >
                <Image
                  resizeMode="contain"
                  style={styles.deleteIcon}
                  source={require("../../assets/images/deleteIcon.png")}
                ></Image>
              </Pressable>
            </View>
            <Text numberOfLines={1} style={styles.itemDesc}>
              {item?.product_name}
            </Text>
            <View style={styles.sizeQuantityView}>
              <View style={styles.sizeView}>
                <Text style={styles.SizeQtyText}>Size:</Text>
                {/* <Pressable
                  // onPress={() => setSizeModal(true)}
                  style={styles.dropDownButtonViewSize}
                >
                  <Text style={styles.sizeQuantityText}>{size}</Text>
                  <Image
                    resizeMode="contain"
                    style={styles.dropDownIcon}
                    source={require("../../assets/images/dropdownIcon.png")}
                  ></Image>
                </Pressable> */}
                <Text style={[styles.sizeQuantityText, { color: "green" }]}>
                  {item?.size}
                </Text>
              </View>
              <View style={styles.quantityView}>
                <Text style={styles.SizeQtyText}>Qty:</Text>
                <Pressable
                  onPress={() => {
                    quantityArrayCalculate(item?.allqty);
                    setQtyOfCurrentItem({
                      p_id: item?.product_id,
                      pp_id: item?.pp_id,
                      vendor_id: item?.vendor_id,
                      color: item?.color,
                      size: item?.size,
                    });
                    setQuantityModal(true);
                  }}
                  style={styles.dropDownButtonView}
                >
                  <Text style={styles.sizeQuantityText}>{item?.qty}</Text>
                  <Image
                    resizeMode="contain"
                    style={styles.dropDownIcon}
                    source={require("../../assets/images/dropdownIcon.png")}
                  ></Image>
                </Pressable>
              </View>
            </View>
            <View style={[styles.priceView, { marginVertical: 2 }]}>
              <Text style={styles.itemPrice}>
                Rs. {item?.total_sale_price}{" "}
              </Text>
              <Text style={styles.itemCrossPrice}> Rs. {item?.total_mrp}</Text>
              <Text style={styles.itemOffPercent}>
                {" "}
                ({item?.percentage}% OFF)
              </Text>
            </View>
            <View style={styles.deliveryDateRow}>
              <Image
                resizeMode="contain"
                style={styles.deliveryImage}
                source={require("../../assets/images/InfoDelivery.png")}
              />
              <Text style={styles.DeliveryText}>Delivery by 20 Jul 2022</Text>
            </View>
          </View>
        </View>
        {cartListDataArray?.length == 1 ||
        cartListDataArray?.length - 1 == index ? null : (
          <View
            style={{
              alignSelf: "center",
              backgroundColor: "rgba(22, 27, 47, 0.2)",
              height: 1,
              width: "100%",
              marginVertical: 15,
            }}
          ></View>
        )}
      </View>
    );
  };

  return (
    <ScreenWrapper>
      <View style={[styles.headerView]}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {params?.stackScreen ? (
            <Pressable onPress={() => navigation.goBack()}>
              <Image
                resizeMode="contain"
                style={styles.backButton}
                source={require("../../assets/images/backArrow.png")}
              />
            </Pressable>
          ) : null}
          <Text style={styles.headerText}>My Bag</Text>
        </View>
        <Text style={styles.itemsCountText}>
          {`${cartListItemsCount} item(s)`}
        </Text>
      </View>
      {cartListItemsCount == 0 && isContentLoading == false ? (
        <NoRecordFoundComponent contentText={"Sorry! No Items In Bag"} />
      ) : isContentLoading == false ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
            {/* <View style={styles.availableOffersSectionView}>
              <View style={styles.offerImageView}>
                <Image
                  resizeMode="stretch"
                  style={styles.offerImage}
                  source={require("../../assets/images/mycartOfferImage.png")}
                />
              </View>
              <View style={styles.offerTextView}>
                <Text style={styles.availableOfferText}>Available Offers</Text>
                <View style={styles.offerRowsContainer}>
                  <View style={styles.rowView}>
                    <Text style={styles.offText}>Rs. 100 OFF</Text>
                    <Text style={styles.offTextDesc}>
                      for orders above Rs. 1000
                    </Text>
                  </View>
                  <View style={styles.verticalSeparatorLine}></View>
                  <View style={[styles.rowView, { alignItems: "center" }]}>
                    <Text style={styles.codeText}>CODE</Text>
                    <Text style={styles.codeValueText}>JULY2022</Text>
                  </View>
                </View>
                <View style={styles.offerRowsContainer}>
                  <View style={styles.rowView}>
                    <Text style={styles.offText}>Rs. 500 OFF</Text>
                    <Text style={styles.offTextDesc}>
                      for orders above Rs. 5999
                    </Text>
                  </View>
                  <View style={styles.verticalSeparatorLine}></View>
                  <View style={[styles.rowView, { alignItems: "center" }]}>
                    <Text style={styles.codeText}>CODE</Text>
                    <Text style={styles.codeValueText}>JULYDEALS</Text>
                  </View>
                </View>
              </View>
            </View> */}
            {/* <View style={styles.freeShippingView}>
              <View style={styles.freeShipImageView}>
                <Image
                  resizeMode="contain"
                  style={styles.freeShipImage}
                  source={require("../../assets/images/InfoDelivery.png")}
                />
              </View>
              <View style={styles.freeShipTextView}>
                <Text style={styles.freeShipText}>
                  Free shipping available on this orders
                </Text>
              </View>
            </View> */}

            <View style={[styles.itemsContainer, { marginVertical: 10 }]}>
              <Text style={styles.headingText}>Deliver to:</Text>
              <View
                style={{
                  alignSelf: "center",
                  backgroundColor: "rgba(22, 27, 47, 0.4)",
                  height: 0.6,
                  width: "100%",
                  marginVertical: 5,
                }}
              ></View>

              {deliveryAddress ? (
                <View style={{ flexDirection: "row" }}>
                  <View style={{ width: "80%" }}>
                    <Text style={styles.totalAmountText}>
                      {deliveryAddress?.name}
                    </Text>
                    <Text style={styles.rowTextStyle}>
                      {deliveryAddress?.address},{deliveryAddress?.town},{" "}
                      {deliveryAddress?.city}, {deliveryAddress?.state}-
                      {deliveryAddress?.pin}
                    </Text>
                    <Text style={styles.rowTextStyle}>
                      Mobile no-
                      <Text style={styles.totalAmountText}>
                        {deliveryAddress?.mobile}
                      </Text>
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "20%",
                      alignItems: "flex-end",
                    }}
                  >
                    <Text
                      onPress={() =>
                        navigation.navigate("CheckoutAddress", {
                          defaultAddressId: deliveryAddress?.id
                            ? deliveryAddress?.id
                            : null,
                        })
                      }
                      style={{ color: "#E1385E" }}
                    >
                      Change
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={{ width: "100%" }}>
                  <Text
                    onPress={() =>
                      navigation.navigate("CheckoutAddress", {
                        defaultAddressId: deliveryAddress?.id
                          ? deliveryAddress?.id
                          : null,
                      })
                    }
                    style={{ color: "#E1385E" }}
                  >
                    Add Address
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.itemsContainer}>
              <ScrollView
                horizontal
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  // backgroundColor: 'green',
                  width: "100%",
                }}
                // style={{ height: hp(100) - 70 }}
              >
                <FlatList
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                  data={cartListDataArray}
                  renderItem={renderItem}
                />
              </ScrollView>
            </View>

            <View style={[styles.itemsContainer, { marginVertical: 10 }]}>
              <Text style={styles.headingText}>Price Details</Text>
              <View
                style={{
                  alignSelf: "center",
                  backgroundColor: "rgba(22, 27, 47, 0.4)",
                  height: 0.6,
                  width: "100%",
                  marginVertical: 5,
                }}
              ></View>
              <View style={styles.textRowView}>
                <Text style={styles.rowTextStyle}>Total MRP</Text>
                <Text style={styles.rowTextStyle}>
                  Rs. {cartAllData?.total_mrp}
                </Text>
              </View>
              <View style={styles.textRowView}>
                <Text style={styles.rowTextStyle}>Discounted Price</Text>
                <Text style={styles.rowTextStyle}>
                  Rs.{" "}
                  {Number(cartAllData?.total_mrp) -
                    Number(cartAllData?.total_saleprice)}
                </Text>
              </View>
              {/* <View style={styles.textRowView}>
              <Text style={styles.rowTextStyle}>Coupon discount</Text>
              <Text style={styles.rowTextStyle}>- -</Text>
            </View>

            <View style={[styles.couponCodeView]}>
              <TextInput
                autoCorrect={false}
                placeholder="Have coupon code?"
                style={styles.textInputStyle}
              />
              <Text
                onPress={() => alert("apply")}
                style={[styles.rowTextStyle, { color: "#CB3535" }]}
              >
                Apply
              </Text>
            </View> */}

              <View style={styles.textRowView}>
                <Text style={styles.rowTextStyle}>Delivery fee</Text>
                <Text style={[styles.rowTextStyle, { color: "#1AA235" }]}>
                  {Number(cartAllData?.delivery_charges) == 0
                    ? "Free"
                    : "Rs." + " " + cartAllData?.delivery_charges}
                </Text>
              </View>
              <View
                style={{
                  alignSelf: "center",
                  backgroundColor: "rgba(22, 27, 47, 0.4)",
                  height: 0.6,
                  width: "100%",
                  marginVertical: 8,
                }}
              ></View>
              <View style={styles.textRowView}>
                <Text style={styles.totalAmountText}>Total Amount</Text>
                <Text style={styles.totalAmountText}>
                  Rs. {cartAllData?.total_payable}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => {
                if (deliveryAddress) {
                  checkoutApi()
                } else {
                  showToastWithGravity(
                    "Please add delivery address to continue"
                  );
                }
              }}
              // onPress={checkoutApi}
              style={styles.continueButtonView}
            >
              <Text style={styles.buttonText}>Continue</Text>
              <Image
                resizeMode="contain"
                style={styles.arrowIcon}
                source={require("../../assets/images/rightArrow.png")}
              />
            </Pressable>
          </View>
        </ScrollView>
      ) : null}
      {/* {sizeModal && (
        <SelectorModal
          modalName="Select Size"
          dataList={sizeArray}
          onChangeValue={(itm) => setSize(itm)}
          isModal={sizeModal}
          setIsModal={setSizeModal}
        />
      )} */}
      {quantityModal && (
        <SelectorModal
          modalName="Select Quantity"
          dataList={quantityArray}
          onChangeValue={(itm) => onChangeQuantity(itm)}
          isModal={quantityModal}
          setIsModal={setQuantityModal}
        />
      )}
      <Loader loader={loader} setLoader={setLoader} />
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
    paddingVertical: 5,
    // backgroundColor: "green",
    // marginTop: 5,
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
  itemsCountText: {
    fontSize: 13,
    color: "#646464",
    fontFamily: "OpenSans-Regular",
  },
  availableOffersSectionView: {
    backgroundColor: "#EEF8FF",
    width: "100%",
    height: 150,
    marginVertical: 10,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
  },
  offerImageView: {
    width: "35%",
    alignItems: "center",
    justifyContent: "center",
  },
  offerImage: {
    height: 110,
    width: 110,
  },
  offerTextView: {
    width: "65%",
    //   backgroundColor: 'yellow',
    height: 150,
    padding: 5,
  },
  availableOfferText: {
    fontSize: 15,
    color: "#161B2F",
    fontFamily: "OpenSans-Medium",
    marginVertical: 5,
  },
  offerRowsContainer: {
    // backgroundColor: 'pink',
    width: "98%",
    height: "35%",
    marginBottom: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(22, 27, 47, 0.4)",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  rowView: {
    width: "48%",
  },
  offText: {
    fontSize: 12,
    fontFamily: "OpenSans-Bold",
    color: "#161B2F",
  },
  offTextDesc: {
    fontSize: 8,
    fontFamily: "OpenSans-Regular",
    color: "#646464",
  },
  verticalSeparatorLine: {
    height: "90%",
    width: 0.8,
    backgroundColor: "rgba(22, 27, 47, 0.7)",
    alignSelf: "center",
  },
  codeText: {
    fontSize: 8,
    fontFamily: "OpenSans-Regular",
    color: "#646464",
  },
  codeValueText: {
    fontSize: 12,
    fontFamily: "OpenSans-Bold",
    color: "#161B2F",
  },
  //////////
  freeShippingView: {
    backgroundColor: "rgba(255, 243, 212, 1)",
    width: "100%",
    height: 45,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  freeShipImageView: {
    width: "10%",
  },
  freeShipImage: {
    width: 28,
    height: 28,
  },
  freeShipTextView: {
    width: "90%",
  },
  freeShipText: {
    color: "#646464",
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
    paddingLeft: 10,
  },
  /////
  itemsContainer: {
    borderWidth: 1,
    borderColor: "rgba(22, 27, 47, 0.2)",
    // height: 300,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  itemView: {
    height: 130,
    //   backgroundColor: 'yellow',
    flexDirection: "row",
  },
  itemImageView: {
    width: "30%",
    height: "100%",
    // backgroundColor: 'pink',
    alignItems: "center",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    // backgroundColor: "red",
  },
  itemTextView: {
    width: "70%",
    height: "100%",
    // backgroundColor: 'violet',
    paddingLeft: 10,
  },
  headingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 2,
  },
  itemTitle: {
    fontSize: 15,
    fontFamily: "OpenSans-Medium",
    color: "#161B2F",
    width: "85%",
  },
  deleteIconView: {
    // backgroundColor: 'yellow',
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIcon: {
    height: 15,
    width: 15,
  },
  itemDesc: {
    fontSize: 13,
    fontFamily: "OpenSans-Regular",
    color: "#646464",
    marginVertical: 2,
    width: "85%",
  },
  sizeQuantityView: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginVertical: 2,
  },
  sizeView: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    // width: "48%",
    // paddingRight: 5,
    // backgroundColor: "red",
    marginRight: 5,
  },
  SizeQtyText: {
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
    color: "#646464",
    marginRight: 5,
  },
  dropDownButtonViewSize: {
    height: 25,
    width: 60,
    borderWidth: 1,
    borderColor: "rgba(112, 112, 112, 0.4)",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  dropDownButtonView: {
    height: 25,
    width: 48,
    borderWidth: 1,
    borderColor: "rgba(112, 112, 112, 0.4)",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 2,
  },
  sizeQuantityText: {
    color: "#646464",
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
  },
  dropDownIcon: {
    height: 8,
    width: 8,
    tintColor: "rgba(112, 112, 112, 0.7)",
  },
  quantityView: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    // width: "48%",
    paddingRight: 5,
  },
  priceView: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: 'red',
    width: "90%",
  },
  itemPrice: {
    fontSize: 14,
    color: "#161B2F",
    fontFamily: "OpenSans-Medium",
  },
  itemCrossPrice: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    fontSize: 13,
    color: "#646464",
    fontFamily: "OpenSans-Light",
  },
  itemOffPercent: {
    fontSize: 13,
    color: "#CB3535",
    fontFamily: "OpenSans-Regular",
  },
  deliveryDateRow: {
    width: "85%",
    alignItems: "center",
    flexDirection: "row",
    // justifyContent: 'center',
    marginVertical: 2,
  },
  deliveryImage: {
    width: 20,
    height: 20,
  },
  DeliveryText: {
    color: "#646464",
    fontSize: 12,
    fontFamily: "OpenSans-Regular",
    marginLeft: 10,
  },
  headingText: {
    fontSize: 15,
    fontFamily: "OpenSans-SemiBold",
    color: "#161B2F",
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
    // backgroundColor: 'red',
    // height: '100%',
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
  continueButtonView: {
    backgroundColor: "#1A97CC",
    height: 50,
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
});
