import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    Image,
    Pressable,
    Dimensions,
    ImageBackground,
    Alert,
  } from "react-native";
  import { useState, useEffect } from "react";
  import ScreenWrapper from "../../components/ScreenWrapper";
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from "react-native-responsive-screen";
  import { fetchUrl } from "../../Utils/FetchHelper";
  import {
    ALL_ADDRESS_URL,
    DELETE_ADDRESS_URL,
  } from "../../Utils/ApiUrlConstants";
  import Loader from "../../components/Common/LoaderModal";
  import { showToastWithGravity } from "../../components/Common/SnackBar";
  import { useSelector, useDispatch } from "react-redux";
  import { unAuthorizedHandler } from "../../Utils/UnAuthorizedHandler";
  import NoRecordFoundComponent from "../../components/Common/NoRecordFoundComponent";
  
  const { width, height } = Dimensions.get("window");
  
  export default function Cards({ navigation, route: { params } }) {
    const { token } = useSelector((state) => state.tokenReducer);
  
    const dispatch = useDispatch();
  
    const [loader, setLoader] = useState(true);
    const [addressesArray, setAddressesArray] = useState([]);
  
    useEffect(() => {
      allAddressesApi();
    }, []);
  
    const allAddressesApi = () => {
      fetchUrl({}, token, ALL_ADDRESS_URL)
        .then((resJson) => {
          ////////////////////
          setLoader(false);
          // console.log("ALL_ADDRESS_API_result =====", resJson);
          // showToastWithGravity(resJson?.message);
          if (resJson?.status == 200) {
            setAddressesArray(resJson?.data);
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
          console.log("ALL_ADDRESS_API_Error::", error);
        });
    };
  
    const deleteAddressApi = (addressId) => {
      setLoader(true);
      // console.log("ProductDetailsParams", productDetailsParams);
      fetchUrl({ address_id: addressId }, token, DELETE_ADDRESS_URL)
        .then((resJson) => {
          ////////////////////
          setLoader(false);
          console.log("DELETE_ADDRESS_API_result =====", resJson);
          // setAddresesArray();
          // showToastWithGravity(resJson?.message);
          if (resJson?.status == 200) {
            showToastWithGravity(resJson?.data);
            allAddressesApi();
          } else if (resJson?.status == 603) {
            unAuthorizedHandler(resJson, navigation, dispatch);
          } else if (resJson?.status == 404) {
            showToastWithGravity(resJson?.data);
          }
        })
        .catch((error) => {
          setLoader(false);
          console.log("DELETE_ADDRESS_API_Error::", error);
        });
    };
  
    return (
      <ScreenWrapper>
        <View style={[styles.headerView]}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              resizeMode="contain"
              style={styles.backButton}
              source={require("../../assets/images/backArrow2.png")}
            />
          </Pressable>
          <Text style={styles.headerText}>Cards</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width: width, height: height }}
          contentContainerStyle={{ alignItems: "center" }}
        >
          <View style={styles.viewIntoScrollView}>
            <Pressable
              onPress={() =>
                navigation.navigate("AddCards", {
                  edit: false,
                })
              }
              style={styles.addAddressButtonView}
            >
              <View style={{ flexDirection: "row", alignItems: "center", }}>
                <Image
                  resizeMode="contain"
                  style={[styles.plusIcon]}
                  source={require("../../assets/images/addAddressIcon.png")}
                />
                <Text style={styles.addAddressButtonText}>Add new card</Text>
              </View>
              <Image
                resizeMode="contain"
                style={[styles.arrowIcon, { tintColor: "#0E1525" }]}
                source={require("../../assets/images/rightArrow.png")}
              />
            </Pressable>
            <Text style={styles.fieldHeadingText}>All saved addresses</Text>
  
            {addressesArray?.map((item, index) => {
              return (
                <View key={item?.id} style={styles.addressesView}>
                
                  <View style={styles.itemView}>
                    <View style={styles.itemTextView}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',}}>
                <Image
                          resizeMode="contain"
                          style={[styles.cardLogo]}
                          source={require("../../assets/images/cardLogo.png")}
                        />
                <Image
                          resizeMode="contain"
                          style={[styles.itemImage]}
                          source={require("../../assets/images/cardType.png")}
                        />
                </View>
                    <Text
                        numberOfLines={1}
                        style={[styles.itemSubTitle, { marginTop: 5 }]}
                      >
                        Card Number
                      </Text>
                      <Text numberOfLines={1} style={styles.itemTitle}>
                        {item?.mobile}
                      </Text>
                      {/* <Text numberOfLines={2} style={styles.itemSubTitle}>
                        {item?.address}, {item?.town}, {item?.city},{item?.state}-
                        {item?.pin}
                      </Text> */}
                      <Text
                        numberOfLines={1}
                        style={[styles.itemSubTitle, { marginTop: 5 }]}
                      >
                        Name on card
                      </Text>
                      <Text style={styles.itemTitle}> {item?.name}</Text>
                    </View>
                    <View style={styles.itemImageView}>
                      <Pressable
                        style={styles.editDeleteButtonView}
                        onPress={() =>
                          navigation.navigate("AddAddress", {
                            edit: true,
                            addressId: item?.id,
                            name: item?.name,
                            mobile: item?.mobile,
                            pincode: item?.pin,
                            flat: item?.address,
                            area: item?.town,
                            city: item?.city,
                            state: item?.state,
                            landmark: item?.landmark,
                            // lat:30.333,
                            // lng:76.333,
                            // default_address:0
                          })
                        }
                      >
                        <Image
                          resizeMode="contain"
                          style={styles.itemImage}
                          source={require("../../assets/images/profileEditTag.png")}
                        />
                      </Pressable>
                      <Pressable
                        style={styles.editDeleteButtonView}
                        onPress={() =>
                          Alert.alert(
                            "Delete Address",
                            "Your address will be removed permanently",
                            [
                              {
                                text: "Cancel",
                                onPress: () => {},
                                style: "cancel",
                              },
                              {
                                text: "Delete",
                                onPress: () => {
                                  deleteAddressApi(item?.id);
                                },
                              },
                            ]
                          )
                        }
                      >
                        <Image
                          resizeMode="contain"
                          style={styles.itemImage}
                          source={require("../../assets/images/deleteRed.png")}
                        />
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            })}
            {addressesArray?.length == 0 && loader == false ? (
              <View
                style={{
                  height: "100%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <NoRecordFoundComponent
                  contentText={"Sorry ! No saved addresses found"}
                />
              </View>
            ) : null}
          </View>
        </ScrollView>
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
      paddingHorizontal: 15,
      // backgroundColor: 'red',
      marginTop: 5,
    },
    backButton: {
      height: 20,
      width: 20,
      marginRight: 10,
    },
    headerText: {
      fontSize: 18,
      fontFamily: "OpenSans-Bold",
      color: "#161B2F",
    },
    ///
    viewIntoScrollView: {
      paddingTop: 15,
      paddingHorizontal: 15,
      alignItems: "center",
      width: "100%",
    },
    addAddressButtonView: {
      backgroundColor: "#F2F5F6",
      height: 45,
      width: "100%",
      borderRadius: 5,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 10,
      paddingVertical: 2,
      marginTop: 10,
      marginBottom: 5,
    },
    addAddressButtonText: {
      color: "#0E1525",
      marginLeft: 5,
      fontSize: 14,
      fontFamily: "OpenSans-Regular",
    },
    plusIcon: {
      width: 22,
      height: 22,
    },
    arrowIcon: {
      width: 15,
      height: 15,
    },
    ///
  
    fieldHeadingText: {
      fontSize: 15,
      color: "rgba(22, 27, 47, 1)",
      fontFamily: "OpenSans-SemiBold",
      alignSelf: "flex-start",
      marginVertical: 15,
    },
    addressesView: {
      width: "100%",
      alignItems: "center",
      marginBottom: 15,
    },
    itemView: {
      backgroundColor: "#F2F5F6",
      width: "100%",
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 8,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    itemTextView: {
      width: "78%",
      height: "100%",
      paddingRight: 25,
      // backgroundColor: "red",
    },
    itemImageView: {
      width: "16%",
      height: "100%",
      paddingTop: 2,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
    },
    itemImage: {
      height: 22,
      width: 22,
      // right: 4,
    },
    itemTitle: {
      fontSize: 14,
      fontFamily: "OpenSans-Medium",
      color: "#161B2F",
      marginVertical: 1,
    },
    itemSubTitle: {
      fontSize: 14,
      fontFamily: "OpenSans-Regular",
      color: "#646464",
      marginVertical: 1,
    },
    editDeleteButtonView: {
      width: 27,
      height: 27,
      alignItems: "center",
      justifyContent: "center",
    },
    cardLogo:{
      width:60,
      height:30
    }
  });
  