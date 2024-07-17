import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Pressable,
  Image,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useSelector, useDispatch } from "react-redux";
import {
  VIEW_ALL_PRODUCTS_URL,
  ADD_TO_WISHLIST_URL,
  SUBCAT_ALLPRODUCTS_URL,
} from "../../Utils/ApiUrlConstants";
import { fetchUrl } from "../../Utils/FetchHelper";
import { unAuthorizedHandler } from "../../Utils/UnAuthorizedHandler";
import { showToastWithGravity } from "../../components/Common/SnackBar";
import Loader from "../../components/Common/LoaderModal";
import NoRecordFoundComponent from "../../components/Common/NoRecordFoundComponent";
import { useFocusEffect } from "@react-navigation/native";

export default function ProductList({ navigation, route: { params = {} } }) {
  const {
    //for viewAllProductsApi from Dashboard Components
    from = "", //Dashboard ,
    product_type = "",
    //needed for both
    categoryName = "",
    //for childApi from Category->subcategory
    categoryId = "",
    subCategoryId = "",
  } = params;
  // console.log("DDDDDDDDDDDDD", categoryName, categoryId, subCategoryId);

  const { token } = useSelector((state) => state.tokenReducer);
  const { imageBaseUrl } = useSelector((state) => state.imageBaseUrlReducer);
  const { cartItemCount } = useSelector((state) => state.cartItemsCountReducer);

  const dispatch = useDispatch();

  const [loader, setLoader] = useState(true);
  const [productListData, setProductListData] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);

  // useEffect(() => {
  //   // console.log("categoryName", categoryName, from, product_type);
  //   from == "Dashboard" ? viewAllProductsApi() : subCatAllProductsApi();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      from == "Dashboard" ? viewAllProductsApi() : subCatAllProductsApi();
    }, [])
  );

  let subCatAllProductsParams = {
    vendor_id: "4", //will have to set dynamically
    cat_id: categoryId, //"97"
    subcat_id: subCategoryId, //"110"
  };
  const subCatAllProductsApi = () => {
    setLoader(true);
    fetchUrl(
      subCatAllProductsParams,
      token ? token : "",
      SUBCAT_ALLPRODUCTS_URL
    )
      .then((resJson) => {
        ////////////////////
        setLoader(false);
        // console.log("SUBCAT_ALLPRODUCTS_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          setProductListData(resJson?.listing);
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("SUBCAT_ALLPRODUCTS_Error::", error);
      });
  };
  let viewAllProductsParams = {
    product_type: product_type, //Featured Products | New Products | On Sale
    // sort_type: "",
    // filter: "",
  };
  const viewAllProductsApi = () => {
    setLoader(true);
    fetchUrl(viewAllProductsParams, token ? token : "", VIEW_ALL_PRODUCTS_URL)
      .then((resJson) => {
        ////////////////////
        setLoader(false);
        // console.log("viewAllProductsApi_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          setProductListData(resJson?.data);
        } else if (resJson?.status == 400) {
          showToastWithGravity(resJson?.message);
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("viewAllProductsApi_Error::", error);
      });
  };

  const addToWishlistApi = (wishlistParams) => {
    // console.log("wishlistParams>>", wishlistParams);
    // setLoader(true);
    fetchUrl(wishlistParams, token, ADD_TO_WISHLIST_URL)
      .then((resJson) => {
        ////////////////////
        // setLoader(false);
        // console.log("ADDTOWISHLIST_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          showToastWithGravity(resJson?.message);
          from == "Dashboard" ? viewAllProductsApi() : subCatAllProductsApi();
        } else if (resJson?.status == 400) {
          showToastWithGravity(resJson?.message);
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("ADDTOWISHLIST_Error::", error);
      });
  };

  // console.log("productsDataList____", ListData);
  const renderItemFlexWrap = ({ item, index }) => {
    // console.log("itemgromListt", item, item?.id, item?.pp_id);
    return (
      <View
        style={[
          styles.renderItemView,
          // { backgroundColor: index == '0' ? 'green' : 'transparent' },
        ]}
      >
        <Pressable
          onPress={() =>
            navigation.navigate("ProductDetails", {
              productId: item?.id,
              productPriceId: item?.pp_id,
            })
          }
          style={styles.itemImageView}
        >
          <Image
            onLoad={() => setImageLoaded(true)}
            resizeMode="contain"
            style={styles.itemImage}
            // source={require("../../assets/images/bringItHomeListImage.png")}
            source={{
              uri:
                from == "Dashboard"
                  ? item?.image_1
                  : imageBaseUrl + item?.image_1,
            }}
          />
          {!imageLoaded && (
            <View
              style={[
                styles.itemImage,
                {
                  position: "absolute",
                  backgroundColor: "#E9E9E9",
                  alignItems: "center",
                  justifyContent: "center",
                },
              ]}
            >
              <Image
                resizeMode="contain"
                source={require("../../assets/images/logoForDetailImage.png")}
                style={{ width: 50, height: 50 }}
              />
            </View>
          )}
        </Pressable>
        <View style={styles.itemTextView}>
          <View style={styles.headingTextAndHeartIconView}>
            <Text numberOfLines={1} style={styles.itemHeading}>
              {item?.name}
            </Text>

            {token ? (
              item?.wishlist_status == 0 ? (
                <Pressable
                  onPress={() =>
                    addToWishlistApi({
                      //To Add
                      request: 1, //0-REMOVE, 1-ADD
                      product_id: item?.id,
                      product_price_id: item?.pp_id,
                      vendor_id: item?.vendor_id,
                    })
                  }
                  style={styles.heartIconView}
                >
                  <Image
                    resizeMode="contain"
                    style={styles.heartIcon}
                    source={require("../../assets/images/favouriteIcon.png")}
                  />
                </Pressable>
              ) : (
                <Pressable
                  onPress={() =>
                    addToWishlistApi({
                      //To remove
                      request: 0, //0-REMOVE, 1-ADD
                      product_id: item?.id,
                      product_price_id: item?.pp_id,
                      vendor_id: item?.vendor_id,
                    })
                  }
                  style={styles.heartIconView}
                >
                  <Image
                    resizeMode="contain"
                    style={styles.heartIcon}
                    source={require("../../assets/images/redHeart.png")}
                  />
                </Pressable>
              )
            ) : null}
          </View>
          <Text numberOfLines={1} style={styles.itemDesc}>
            {item?.product_name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              width: "98%",
              // backgroundColor: "red",
            }}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.itemPrice,
                // { width: "70%", backgroundColor: "red" },
              ]}
            >
              Rs. {item?.sale_price}{" "}
              <Text style={styles.itemCrossPrice}>Rs. {item?.mrp}</Text>
            </Text>
          </View>
          <Text numberOfLines={1} style={styles.itemOffPercent}>
            (62% OFF)
          </Text>
        </View>
      </View>
    );
  };
  const DividerFlexWrap = () => {
    return <View style={{ width: 0 }} />;
  };

  return (
    <ScreenWrapper style={styles.mainContainer}>
      <View style={styles.headerView}>
        <View style={styles.backbuttonAndTextView}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              source={require("../../assets/images/backArrow.png")}
              style={styles.backButton}
            />
          </Pressable>
          <View>
            <Text style={styles.headerText}>{categoryName}</Text>
            <Text style={styles.headerSubText}>
              {productListData?.length != 0
                ? productListData?.length == 1
                  ? "1 item"
                  : productListData?.length + " " + "Items"
                : 0 + " " + "item"}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Pressable onPress={() => navigation.navigate("SearchProducts")}>
            <Image
              resizeMode="contain"
              style={styles.searchIcon}
              source={require("../../assets/images/searchIcon.png")}
            />
          </Pressable>
          <Pressable
            style={{ marginHorizontal: 7 }}
            onPress={() =>
              token ? navigation.navigate("WishList") : navigation.push("Login")
            }
          >
            <Image
              resizeMode="contain"
              style={styles.favouriteIcon}
              source={require("../../assets/images/favouriteIcon.png")}
            />
          </Pressable>
          <Pressable
            onPress={() =>
              token
                ? navigation.navigate("MyCart", { stackScreen: true })
                : navigation.push("Login")
            }
          >
            <Image
              resizeMode="contain"
              style={styles.bagIcon}
              source={require("../../assets/images/bagIconTab.png")}
            />
            {token && cartItemCount != 0 ? (
              <View style={styles.itemCountBadgeView}>
                <Text style={styles.itemBadgeCountText}>{cartItemCount}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>
      <View style={{ paddingHorizontal: 10 }}>
        {productListData?.length == 0 && loader == false ? (
          <NoRecordFoundComponent />
        ) : (
          <FlatList //flatlist for flexWrap elements list
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={productListData}
            renderItem={renderItemFlexWrap}
            ItemSeparatorComponent={DividerFlexWrap}
            keyExtractor={(item) => item?.id}
            // style={{ width: "100%", backgroundColor: "red" }}
            contentContainerStyle={{
              // backgroundColor: "green",
              paddingTop: 10,
              paddingBottom: 80,
            }}
          />
        )}
      </View>
      <Loader loader={loader} setLoader={setLoader} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    // flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 2,
    width: "100%",
  },
  backbuttonAndTextView: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
  },
  headerText: {
    fontSize: 18,
    fontFamily: "OpenSans-SemiBold",
    color: "161B2F",
  },
  headerSubText: {
    fontSize: 10,
    fontFamily: "OpenSans-Regular",
    color: "161B2F",
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#161B2F",
  },
  favouriteIcon: {
    width: 22,
    height: 22,
    tintColor: "#161B2F",
  },
  bagIcon: {
    width: 20,
    height: 20,
    tintColor: "#161B2F",
  },
  itemCountBadgeView: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "#E1385E",
    height: 14,
    width: 14,
    borderRadius: 14 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  itemBadgeCountText: {
    color: "#FFFFFF",
    fontSize: 9,
  },
  //<<<<<<<<<<<<<renderItemFlexWrap style>>>>>>>>>>>>>>>
  renderItemView: {
    height: 260,
    width: "49%",
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "red",
    borderWidth: 1,
    borderColor: "#F2F5F6",
    padding: 5,
    margin: 2,
  },
  itemImageView: {
    height: "72%",
    width: "100%",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemTextView: {
    width: "100%",
    height: "28%",
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 5,
  },
  headingTextAndHeartIconView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemHeading: {
    fontSize: 14,
    color: "#161B2F",
    fontFamily: "OpenSans-Medium",
    width: "80%",
  },
  heartIconView: {
    alignItems: "center",
    justifyContent: "center",
  },
  heartIcon: {
    height: 15,
    width: 15,
    marginRight: 5,
  },
  itemDesc: {
    fontSize: 10,
    color: "#646464",
    fontFamily: "OpenSans-Regular",
  },
  itemPrice: {
    fontSize: 11,
    color: "#161B2F",
    fontFamily: "OpenSans-Medium",
  },
  itemCrossPrice: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    fontSize: 10,
    color: "#646464",
    fontFamily: "OpenSans-Light",
  },
  itemOffPercent: {
    fontSize: 10,
    color: "#CB3535",
    fontFamily: "OpenSans-Regular",
  },
});
