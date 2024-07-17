import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { fetchUrl } from "../../Utils/FetchHelper";
import {
  ALL_ADDRESS_URL,
  CHOOSE_ADDRESS_URL,
} from "../../Utils/ApiUrlConstants";
import Loader from "../../components/Common/LoaderModal";
import { showToastWithGravity } from "../../components/Common/SnackBar";
import { useSelector, useDispatch } from "react-redux";
import { unAuthorizedHandler } from "../../Utils/UnAuthorizedHandler";
import NoRecordFoundComponent from "../../components/Common/NoRecordFoundComponent";
import { useFocusEffect } from "@react-navigation/native";

// const ItemsData = [
//   {
//     id: 1,
//     image: require("../../assets/images/NowOrNever.png"),
//   },
//   {
//     id: 2,
//     image: require("../../assets/images/NowOrNever.png"),
//   },
// ];

export default function CheckoutAddress({ navigation, route: { params } }) {
  // const { defaultAddressId } = params;
  const { token } = useSelector((state) => state.tokenReducer);

  const dispatch = useDispatch();

  const [loader, setLoader] = useState(true);
  const [addressesArray, setAddressesArray] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(
    params?.defaultAddressId
  );

  // console.log(
  //   "params?.defaultAddressId",
  //   params,
  //   params?.defaultAddressId,
  //   selectedAddressId
  // );
  useFocusEffect(
    React.useCallback(() => {
      // selectedAddressId
      // setSelectedAddressId(defaultAddressId); ///

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
    }, [])
  );

  const chooseAddressApi = (addressId) => {
    setLoader(true);
    fetchUrl({ address_id: addressId }, token, CHOOSE_ADDRESS_URL)
      .then((resJson) => {
        ////////////////////
        setLoader(false);
        // console.log("CHOOSE_ADDRESS_API_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          showToastWithGravity(resJson?.data);
          // setSelectedAddressId(addressId);
          navigation.goBack();
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        } else if (resJson?.status == 404) {
          showToastWithGravity(resJson?.data);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("CHOOSE_ADDRESS_API_Error::", error);
      });
  };

  // const renderItem = ({ item, index }) => {
  //   return (
  //     <View>
  //       <View style={{ flexDirection: "row", alignItems: "center" }}>
  //         <Image
  //           resizeMode="contain"
  //           style={{ height: 45, width: 35 }}
  //           // source={require("../../assets/images/nowOrNeverList.png")}
  //         />
  //         <Text
  //           style={{
  //             fontSize: 14,
  //             fontFamily: "OpenSans-Regular",
  //             color: "#646464",
  //             marginLeft: 10,
  //           }}
  //         >
  //           Estimated Delivery by
  //         </Text>
  //         <Text
  //           style={{
  //             fontSize: 14,
  //             fontFamily: "OpenSans-SemiBold",
  //             color: "##161B2F",
  //           }}
  //         >
  //           {" "}
  //           20 Jul 2022
  //         </Text>
  //       </View>

  //       {ItemsData?.length == 1 || ItemsData?.length - 1 == index ? null : (
  //         <View
  //           style={{
  //             alignSelf: "flex-end",
  //             backgroundColor: "rgba(22, 27, 47, 0.1)",
  //             height: 1,
  //             width: "86%",
  //             marginVertical: 5,
  //           }}
  //         ></View>
  //       )}
  //     </View>
  //   );
  // };
  const renderItemAddresses = ({ item, index }) => {
    // console.log("itemAddress", item?.default_address);
    return (
      <View>
        <Pressable
          onPress={() => {
            setSelectedAddressId(item?.id);
          }}
          style={styles.addressTextView}
        >
          <View style={styles.checkboxBorderView}>
            <View
              style={[
                styles.checkboxDotView,
                {
                  backgroundColor:
                    selectedAddressId == item?.id ? "#161B2F" : "#FFFFFF",
                },
              ]}
            ></View>
          </View>
          <View style={[styles.addressView]}>
            <Text style={styles.nameText}>{item?.name}</Text>
            <Text adjustsFontSizeToFit={true} style={styles.addressText}>
              {/* House no 53, Sector 8 , Panchkula, Haryana-134109 */}
              {item?.address},{item?.town}, {item?.city}, {item?.state}-
              {item?.pin}
            </Text>
            <Text style={styles.addressText}>
              Mobile no- <Text style={styles.nameText}>{item?.mobile}</Text>
            </Text>
          </View>
          {selectedAddressId == item?.id ? (
            <View style={styles.editAddressTagContainer}>
              <Pressable
                onPress={() =>
                  navigation.navigate("AddAddress", {
                    fromPath: "CheckoutAddress",
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
                style={styles.editTagView}
              >
                <Image
                  style={styles.editTag}
                  source={require("../../assets/images/editTag.png")}
                />
              </Pressable>
            </View>
          ) : null}
        </Pressable>

        {/* {selectedAddressId == item?.id ? (
          <Pressable style={styles.deliverToButtonView}>
            <Text style={styles.deliverToButtonText}>
              Deliver to this address
            </Text>
          </Pressable>
        ) : null} */}

        {addressesArray?.length == 1 ||
        addressesArray?.length - 1 == index ? null : (
          <View
            style={{
              alignSelf: "center",
              backgroundColor: "rgba(22, 27, 47, 0.2)",
              height: 1,
              width: "100%",
              marginVertical: 8,
            }}
          ></View>
        )}
      </View>
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
        <Text style={styles.headerText}>My Address</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
          {addressesArray?.length != 0 ? (
            <View style={[styles.addressesContainer]}>
              <ScrollView
                horizontal
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ width: "100%" }}
              >
                <FlatList
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                  data={addressesArray}
                  renderItem={renderItemAddresses}
                />
              </ScrollView>
            </View>
          ) : loader == false ? (
            <View style={styles.noRecordView}>
              <NoRecordFoundComponent
                contentText={"Sorry ! No saved addresses found"}
              />
            </View>
          ) : null}

          <Pressable
            onPress={() =>
              navigation.navigate("AddAddress", {
                fromPath: "CheckoutAddress",
                edit: false,
              })
            }
            style={[styles.addAddressButtonView]}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                resizeMode="contain"
                style={[styles.plusIcon]}
                source={require("../../assets/images/addAddressIcon.png")}
              />
              <Text style={styles.addAddressButtonText}>Add new address</Text>
            </View>
            <Image
              resizeMode="contain"
              style={[styles.arrowIcon, { tintColor: "#0E1525" }]}
              source={require("../../assets/images/rightArrow.png")}
            />
          </Pressable>

          {/* <Pressable
            onPress={() => {
              selectedAddressId != null
                ? navigation.navigate("Payment", {
                    selectedAddressId: selectedAddressId,
                  })
                : showToastWithGravity("Select Address For Delivery");
            }}
            style={styles.continueButtonView}
          >
            <Text style={styles.buttonText}>Deliver to this address</Text>
            <Image
              resizeMode="contain"
              style={styles.arrowIcon}
              source={require("../../assets/images/rightArrow.png")}
            />
          </Pressable> */}
          {selectedAddressId != null ? (
            <Pressable
              onPress={() => chooseAddressApi(selectedAddressId)}
              style={styles.deliverToButtonView}
            >
              <Text style={styles.deliverToButtonText}>
                Deliver to this address
              </Text>
            </Pressable>
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
    alignSelf: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    // paddingVertical: 5,
    // backgroundColor: 'red',
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
  estimateddeliveryViewContainer: {
    backgroundColor: "#F2F5F6",
    borderRadius: 10,
    padding: 10,
  },
  addressesContainer: {
    borderWidth: 1,
    borderColor: "rgba(22, 27, 47, 0.2)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginVertical: 15,
  },
  addressTextView: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: 'pink',
    width: "80%",
  },
  checkboxBorderView: {
    marginVertical: 5,
    marginRight: 5,
    alignSelf: "flex-start",
    height: 15,
    width: 15,
    borderRadius: 15 / 2,
    borderWidth: 1,
    borderColor: "#707070",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDotView: {
    // backgroundColor: '#161B2F',
    height: 8,
    width: 8,
    borderRadius: 8 / 2,
  },
  addressView: {
    // backgroundColor: 'red',
    width: "95%",
  },
  nameText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 14,
    color: "#161B2F",
    marginVertical: 3,
  },
  addressText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 14,
    color: "#646464",
    marginVertical: 3,
  },
  editAddressTagContainer: {
    width: "20%",
    height: "100%",
    alignItems: "flex-end",
    paddingTop: 4,
  },
  editTagView: {
    height: 25,
    width: 25,
    alignItems: "flex-end",
  },
  editTag: {
    width: 20,
    height: 20,
  },
  deliverToButtonView: {
    alignSelf: "center",
    backgroundColor: "#24AAE3",
    height: 45,
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  deliverToButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "OpenSans-Medium",
  },
  addAddressButtonView: {
    backgroundColor: "#F2F5F6",
    height: 40,
    width: "100%",
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 30,
  },
  addAddressButtonText: {
    color: "#0E1525",
    marginLeft: 5,
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
  },
  continueButtonView: {
    backgroundColor: "#161B2F",
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
  plusIcon: {
    width: 22,
    height: 22,
  },
  arrowIcon: {
    width: 20,
    height: 20,
  },
  noRecordView: {
    width: "100%",
    height: 300,
  },
});
