import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  FlatList,
  TextInput
} from "react-native";
import { useState, useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { fetchUrl } from "../../Utils/FetchHelper";
import {
  PAYMENT_CHECKOUT_URL,
  PLACE_ORDER_URL,
} from "../../Utils/ApiUrlConstants";
import Loader from "../../components/Common/LoaderModal";
import { showToastWithGravity } from "../../components/Common/SnackBar";
import { useSelector, useDispatch } from "react-redux";
import { unAuthorizedHandler } from "../../Utils/UnAuthorizedHandler";
import base64 from "react-native-base64";
import { cartItemCountAction } from "../../redux/Actions/CartItemsCountAction";
import { RadioButton } from "react-native-paper";
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { clientId } from "../../constants/Constant";
const PaymentOptions = [
  {
    id: 1,
    name: "Cash on delivery",
  },
  {
    id: 2,
    name: "Credit/Debit card/UPI",
  },
  // {
  //   id: 3,
  //   name: "UPI",
  // },
  // {
  //   id: 4,
  //   name: "Paytm",
  // },
  // {
  //   id: 5,
  //   name: "Netbanking",
  // },
  {
    id: 3,
    name: "Wallet",
  },
];

export default function Payment({ navigation, route: { params } }) {
  const { selectedAddressId } = params;
  const { token } = useSelector((state) => state.tokenReducer);
  const [secureEntry, setSecureEntry] = useState(true);
  const [availableBalance, setAvailableBalance] = useState(false);
  const dispatch = useDispatch();
  const [value, setValue] = useState('Cash on delivery');
  const [visible, setVisible] = useState(false);
  const [loader, setLoader] = useState(false);
  const [paymentDetailsData, setPaymentDetailsData] = useState([]);
  // const [payableAmountObject, setPayableAmountObject] = useState(null);
  useEffect(() => {
    paymentAPi();
  }, []);
  const paymentAPi = () => {
    setLoader(true);
    fetchUrl(
      {
        request_type: "cart",
        client_id:clientId
        //buynow | cart
      },
      token,
      PAYMENT_CHECKOUT_URL
    )
      .then((resJson) => {
        ////////////////////
        setLoader(false);
        // console.log("PAYMENT_CHECKOUT_API_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          // showToastWithGravity(resJson?.message);
          setPaymentDetailsData(resJson?.data);
          // setPayableAmountObject(
          //   JSON.parse(resJson?.data?.payableAmountObject)
          // );
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        } else if (resJson?.status == 404) {
          showToastWithGravity(resJson?.message);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("PAYMENT_CHECKOUT_API_Error::", error);
      });
  };

  const placeOrderApi = () => {
    // console.log("rrrrrrrrrr", {
    //   payment_method: "COD",
    //   request_type: "cart",
    //   address_id: selectedAddressId,
    //   payId: "COD",
    //   tp: base64.encode(paymentDetailsData?.total_payable),
    //   paymentDetail: JSON.stringify(paymentDetailParams),
    // });
    let resData_total_payable;
    setLoader(true);
    fetchUrl(
      {
        request_type: "cart",
        client_id:clientId,
        //buynow | cart
      },
      token,
      PAYMENT_CHECKOUT_URL
    )
      .then((resJson) => {
        ////////////////////
        // setLoader(false);
        // console.log("PAYMENT_CHECKOUT_API_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          resData_total_payable = resJson?.data?.total_payable;
          const paymentDetailParams = {
            order_total_with_offer: 0,
            pro_order_total_with_offer: 0,
            order_total: resData_total_payable, //"379"
            pro_order_total: 0,
            extra_offer: 0,
            delivery_charges: 0,
            total_payable: resData_total_payable,
            pro_total_payable: 0,
            amount: resData_total_payable,
            cashback_extra_pay: 0,
            cashback_useTotal: 0,
            walletTotalBalance: 0,
            walletBalance2MW: 0,
            walletBalance2MWUsed: 0,
            totalPv: 0,
            voucher: "",
            voucher_pv: 0,
            voucher_amount: 0,
            vbi: 0,
            products: "0",
          };
          /////////////Place order API
          fetchUrl(
            {
              payment_method: "COD",
              request_type: "cart",
              address_id: selectedAddressId,
              payId: "COD",
              tp: base64.encode(resData_total_payable),
              paymentDetail: JSON.stringify(paymentDetailParams),
              client_id:clientId,
            },
            token,
            PLACE_ORDER_URL,
          )
            .then((resJson) => {
              ////////////////////
              setLoader(false);
              // showToastWithGravity(resJson?.message);
              if (resJson?.status == 200) {
                showToastWithGravity(resJson?.message);
                dispatch(cartItemCountAction(0)); //////
                navigation.navigate("OrderPlacedSuccessfully", {
                  screenHeading: "Order Placed",
                  heading: "Success !",
                  content: "Your Order placed successfully.",
                  button: "Home",
                  fromPath: "Payment",
                });
                setVisible(false)
              } else if (resJson?.status == 603) {
                unAuthorizedHandler(resJson, navigation, dispatch);
              } else if (resJson?.status == 400) {
                showToastWithGravity(resJson?.message);
              }else if (resJson?.status == 404) {
                showToastWithGravity(resJson?.message);
              }else if (resJson?.status == 0) {
                showToastWithGravity(resJson?.message);
              }
            })
            .catch((error) => {
              setLoader(false);
              console.log("PLACE_ORDER_API_Error::", error);
            });
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        } else if (resJson?.status == 400) {
          console.log(resJson?.message);
          showToastWithGravity(resJson?.message);
          setLoader(false);
          setVisible(false)
        }else if (resJson?.status == 404) {
          showToastWithGravity(resJson?.message);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("PAYMENT_CHECKOUT_API_Error::", error);
      });
  };
  

  const renderItem = ({ item, index }) => {
    return (
      <Pressable style={styles.paymentRow}>
        <View style={[styles.paymentRowView]}>
          <View style={styles.ImageTextView}>
          <RadioButton.Group onValueChange={newValue => setValue(newValue)} value={value} >
        <RadioButton.Item  value={item.name}  />
      </RadioButton.Group>
            <Image
              resizeMode="contain"
              style={styles.paymentOptionImage}
              source={require("../../assets/images/CODpayment.png")}
            />
            <Text style={styles.nameText}>{item?.name}</Text>
          </View>
          {/* <Image
            resizeMode="contain"
            style={[styles.arrowIcon, { tintColor: "#161B2F", marginRight: 5 }]}
            source={require("../../assets/images/rightArrow.png")}
          /> */}
        </View>
      </Pressable>
    );
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
        <Text style={styles.headerText}>Payment</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
          <View style={[styles.borderContainer]}>
            <Text style={styles.headingText}>Payment options</Text>
            <View
              style={{
                alignSelf: "center",
                backgroundColor: "rgba(22, 27, 47, 0.4)",
                height: 0.6,
                width: "100%",
                marginVertical: 5,
              }}
            ></View>
            <ScrollView
              horizontal
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ width: "100%" }}
            >
              <FlatList
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                data={PaymentOptions}
                renderItem={renderItem}
              />
            </ScrollView>
          </View>

          <View style={[styles.borderContainer, { marginVertical: 10 }]}>
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
                Rs. {paymentDetailsData?.total_mrp}
              </Text>
            </View>
            <View style={styles.textRowView}>
              <Text style={styles.rowTextStyle}>Discounted Price</Text>
              <Text style={styles.rowTextStyle}>
                {" "}
                Rs.{" "}
                {Number(paymentDetailsData?.total_mrp) -
                  Number(paymentDetailsData?.total_saleprice)}
              </Text>
            </View>
            {/* <View style={styles.textRowView}>
              <Text style={styles.rowTextStyle}>Coupon discount</Text>
              <Text style={styles.rowTextStyle}>- -</Text>
            </View> */}

            {/* <View style={[styles.couponCodeView]}>
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
                {Number(paymentDetailsData?.delivery_charges) == 0
                  ? "Free"
                  : "Rs." + " " + paymentDetailsData?.delivery_charges}
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
                {" "}
                Rs. {paymentDetailsData?.total_payable}
              </Text>
            </View>
          </View>
              {value === "Cash on delivery"?
              <Pressable
            // onPress={() => placeOrderApi()}
            style={styles.payButtonView}
          >
            <Text style={styles.buttonText}>Pay Now</Text>
            <Image
              resizeMode="contain"
              style={styles.arrowIcon}
              source={require("../../assets/images/rightArrow.png")}
            />
          </Pressable>
          :
          value === "Credit/Debit card/UPI"?
          showToastWithGravity('service not available'):
          <Pressable
            // onPress={() => placeOrderApi()}
            onPress={() =>  setVisible(true)}
            style={styles.payButtonView}
          >
            <Text style={styles.buttonText}>Pay Now</Text>
            <Image
              resizeMode="contain"
              style={styles.arrowIcon}
              source={require("../../assets/images/rightArrow.png")}
            />
          </Pressable>
              }
          

        </View>
      </ScrollView>
      <View>
      <Modal
        isVisible={visible}
        style={styles.modalContainer}
        swipeDirection={'down'}
        onSwipeDown={()=>  setVisible(false) }
        onBackButtonPress={() => {
          setVisible(false);
        }}>
        <ScrollView style={styles.btnSection}>
          <View style={{padding:wp(5)}}>
            <View
              style={{
                backgroundColor: '#E1E1E1',
                width: wp(30),
                height: wp(1),
                borderRadius: 10,
                alignSelf: 'center',
                marginBottom:wp(5)
              }}>
              </View>
              {availableBalance == false?
              <View>
                <Text style={styles.title}>Login to your wallet</Text>
                <Text style={styles.subTitle}>Lorem insput dolor sit amet,consectetur</Text>
           <View style={styles.textInputView}>
            <Image
              source={require("../../assets/images/user-filled.png")}
              resizeMode="contain"
              style={styles.textInputImage}
            />
            <View style={styles.textInputAndSeparatorLineView}>
              <TextInput
                maxLength={80}
                autoCorrect={false}
                underlineColorAndroid="transparent"
                placeholder="User Id"
                placeholderTextColor={"rgba(22, 27, 47,0.6)"}
                style={styles.textInput}
                // value={email}
                // onChangeText={setEmail}
              />
              <View style={styles.separatorLine}></View>
            </View>
            <Image
              source={require("../../assets/images/atRateImage.png")}
              resizeMode="contain"
              style={[styles.textInputImage, { opacity: 0, marginRight: 10 }]}
            />
          </View>
          <View style={styles.textInputView}>
            <Image
              source={require("../../assets/images/lock.png")}
              resizeMode="contain"
              style={styles.textInputImage}
            />
            <View style={styles.textInputAndSeparatorLineView}>
              <TextInput
                maxLength={30}
                autoCorrect={false}
                placeholder="Password"
                placeholderTextColor={"rgba(22, 27, 47,0.6)"}
                style={styles.textInput}
                secureTextEntry={secureEntry}
                // value={password}
                // onChangeText={setPassword}
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
          <Pressable
            // onPress={() => placeOrderApi()}
            onPress={() =>  setAvailableBalance(true)}
            style={styles.payButtonView}
          >
            <Text style={styles.buttonText}>Login</Text>
            <Image
              resizeMode="contain"
              style={styles.arrowIcon}
              source={require("../../assets/images/rightArrow.png")}
            />
          </Pressable>
              </View>
              :
              <View>
                <View style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
              <Image
              resizeMode="contain"
              style={{width:40,height:40,margin:5}}
              source={require("../../assets/images/wallet.png")}
            />
            <View>
            <Text style={styles.title}>Rs. 12000.00</Text>
            <Text style={styles.subTitle}>Available wallet balance</Text>
            </View>
                </View>
                <View style={styles.showAmountStyle}>
                  <Text style={styles.priceStyle}>Payment Amount</Text>
                  <Text style={[styles.priceStyle,{color:'#000000'}]}>Rs. 1518.00</Text>
                </View>
                <Pressable
            // onPress={() => placeOrderApi()}
            // onPress={() =>  setAvailableBalance(true)}
            style={styles.payButtonView}
          >
            <Text style={styles.buttonText}>Pay Now</Text>
            <Image
              resizeMode="contain"
              style={styles.arrowIcon}
              source={require("../../assets/images/rightArrow.png")}
            />
          </Pressable>
              </View>
              }
              </View>
            
        </ScrollView>
      </Modal> 
    </View>
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
  borderContainer: {
    borderWidth: 1,
    borderColor: "rgba(22, 27, 47, 0.2)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 15,
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
  payButtonView: {
    backgroundColor: "#1A97CC",
    height: 50,
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 30,
    marginBottom: 30,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "OpenSans-Medium",
  },
  plusIcon: {
    width: 22,
    height: 22,
  },
  arrowIcon: {
    width: 18,
    height: 18,
  },
  modalContainer: {
    width: '100%',
    marginLeft: 0,
    marginBottom: 0,
  },
  btnSection: {
    position: 'absolute',
    bottom: 0,
    height: 300,
    backgroundColor: '#fff',
    width: '100%',
    right: 0,
    left: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  title:{
    fontSize: 22,
    fontFamily: "OpenSans-SemiBold",
    color: "#161B2F",
  },
  subTitle:{
    fontFamily: "OpenSans-Medium",
    color: "#7E7E7E",
  },
  textInputView: {
    // backgroundColor: 'red',
    height: 45,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
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
  priceStyle:{
    color:'#7E7E7E',fontSize:16,fontFamily:'OpenSans-Medium'
  },
  showAmountStyle:{
    backgroundColor:'#F2F5F6',borderRadius:10,justifyContent:'center',alignItems:'center',height:wp(30)
  }
});
