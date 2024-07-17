import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Pressable,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ImagesSlider from "../../components/ProductDetails/ImagesSlider";
import ColorTabsComponent from "../../components/ProductDetails/ColorTabsComponent";
import SizeTabsComponent from "../../components/ProductDetails/SizeTabsComponent";
import SimilarProducts from "../../components/ProductDetails/SimilarProducts";
import {
  SINGLE_PRODUCT_DETAILS_URL,
  ADD_TO_WISHLIST_URL,
  ADD_TO_CART_URL,
  CHECK_PRODUCT_URL,
} from "../../Utils/ApiUrlConstants";
import { useDispatch, useSelector } from "react-redux";
import { fetchUrl } from "../../Utils/FetchHelper";
import { unAuthorizedHandler } from "../../Utils/UnAuthorizedHandler";
import { showToastWithGravity } from "../../components/Common/SnackBar";
import Loader from "../../components/Common/LoaderModal";
import InViewPort from "@coffeebeanslabs/react-native-inviewport";
import {
  setObjectInStorage,
  getObjectFromStorage,
} from "../../Utils/AsyncStorageHelper";
import { useFocusEffect } from "@react-navigation/native";
import { cartItemCountAction } from "../../redux/Actions/CartItemsCountAction";
import { log } from "react-native-reanimated";
import { clientId } from "../../constants/Constant";

export default function ProductDetails({ navigation, route: { params } }) {
  const { productId, productPriceId } = params;
  // console.log("ProductDetailsParams", productId, productPriceId);
  const { token } = useSelector((state) => state.tokenReducer);
  const { imageBaseUrl } = useSelector((state) => state.imageBaseUrlReducer);
  const { cartItemCount } = useSelector((state) => state.cartItemsCountReducer);

  const dispatch = useDispatch();

  const [secureEntry, setSecureEntry] = useState(true);
  const [loader, setLoader] = useState(true);
  const [loadingComponent, setloadingComponent] = useState(false);
  const [productImagesArr, setProductImagesArr] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [sizesAndColors, setSizesAndColors] = useState([]);
  const [colorsAvailableBySize, setColorsAvailableBySize] = useState([]);
  const [specificationvalues, setSpecificationvalues] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [buttonsShow, setButtonsShow] = useState(true);
  const [wishlistState, setWishlistState] = useState(false);
  const [addToCartState, setAddToCartState] = useState(false);
  const [noSizeFlag, setNoSizeFlag] = useState(false);
  const [finalSelectedSize, setFinalSelectedSize] = useState("");
  const [finalSelectedColor, setFinalSelectedColor] = useState("");
  const [cartStatus, setCartStatus] = useState("");
  const [
    AvlQtyInSelectedSizeColorCombination,
    setAvlQtyInSelectedSizeColorCombination,
  ] = useState(0);

  const [fromAsyncCart, setFromAsyncCart] = useState([]);
  let checkItemFromAsyncStorage = fromAsyncCart?.find(
    (item) =>
      item.id == productDetails?.id &&
      item.pp_id == productDetails?.pp_id &&
      item?.vendor_id == productDetails?.vendor_id
  );

  // console.log('finalSelectedColor',finalSelectedColor)
  // console.log('finalSelectedSize',finalSelectedSize)

  // console.log(
  //   "AAABBBBB>>",
  //   JSON.stringify(person2) === JSON.stringify(person3)
  // );
// console.log('cartStatus???',cartStatus);

  useFocusEffect(
    React.useCallback(() => {
      // console.log("yuwyuwdwdwedgwey");
      setAddToCartState(false);
      setSizesAndColors([]); //
      setColorsAvailableBySize([]); //
      setLoader(true);
      productDetailsApi(productDetailsParams);
      getObjectFromStorage("_cartArray").then((result) => {
        if (result) {
          // console.log("resultFromStorage", result);
          setFromAsyncCart(result);
        }
      });
    }, [])
  );
  // const onRefresh = React.useCallback(() => {
  //   // setloadingComponent(true);
  //   setRefreshing(true);
  //   setSizesAndColors([]); //
  //   setColorsAvailableBySize([]); //
  //   setLoader(true);
  //   productDetailsApi(productDetailsParams);
  //   getObjectFromStorage("_cartArray").then((result) => {
  //     if (result) {
  //       // console.log("resultFromStorage", result);
  //       setFromAsyncCart(result);
  //     }
  //   });
  //   // setTimeout(() => {
  //   //   setloadingComponent(false);
  //   // }, 3000);
  // }, []);
  // useEffect(() => {
  //   productDetailsApi(productDetailsParams);
  //   getObjectFromStorage("_cartArray").then((result) => {
  //     if (result) {
  //       console.log("resultFromStorage", result);
  //       setFromAsyncCart(result);
  //     }
  //   });
  // }, []);

  let productDetailsParams = {
    ////////--------------->>>>>>>>
    product_id: productId, //productId, //6065,//6075(No size) //6079( with details)//6066
    pp_id: productPriceId, //productPriceId, //20898,//20908(No Size) // 20912(with details)//20899
  };
  const productDetailsApi = (productDetailsParams) => {
    // setLoader(true);
    // console.log("ProductDetailsParams", productDetailsParams);
    fetchUrl(
      productDetailsParams,
      token ? token : "",
      SINGLE_PRODUCT_DETAILS_URL
    )
      .then((resJson) => {
        ////////////////////
        setLoader(false);
        // console.log("SINGLE_PRODUCTDETAILS_API_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          // setProductListData(resJson?.listing);
          setProductImagesArr(resJson?.product_detail?.productdels?.images);
          setProductDetails(resJson?.product_detail?.productdels);
          setSpecificationvalues(resJson?.product_detail?.specifications_arr);
          setWishlistState(false); ///////////////
          setCartStatus(resJson?.product_detail.productdels)
          //////////
          // let TempArr =
          //   resJson?.product_detail?.productdels?.s_description?.split("\r\n");
          // calculationForDesKeyValues(TempArr);
          /// when no size available
          if (resJson?.product_detail?.sizesarr[0]?.size == "No size") {
            setNoSizeFlag(true);
            setColorsAvailableBySize(
              resJson?.product_detail?.sizesarr[0].color
            );
          } else {
            setSizesAndColors(resJson?.product_detail?.sizesarr);
          }
          //similar products
          setSimilarProducts(resJson?.product_detail?.similar_products);
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        } else if (resJson?.status == 404) {
          showToastWithGravity(resJson?.message);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("SINGLE_PRODUCTDETAILS_API_Error::", error);
      });
  };
  const onPressSizeTab = (item) => {
    setColorsAvailableBySize(item?.color); //set availableColors according to size
    // setAvailableQuantity(Number(item?.availqty)); //set available Quantity according to size
  };

  ////////////////////
  
  const wishlistParams = {
    //To Add
    request: 1, //0-REMOVE, 1-ADD
    product_id: productDetails?.id,
    product_price_id: productDetails?.pp_id,
    vendor_id: productDetails?.vendor_id,
  };
  const addToWishlistApi = () => {
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
          setWishlistState(true);
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
  ///////////////////

  ///////////////////// add to cart
  let CartArrayToBeStoredParams = [
    {
      id: productDetails?.id, //product_id
      pp_id: productDetails?.pp_id, //product price id
      vendor_id: productDetails?.vendor_id,
      selectedQuantity: "1",
      color: finalSelectedColor,
      size: finalSelectedSize,
    },
  ];
  let CartArrayToBeStoredParamsWithNoSize = [
    {
      id: productDetails?.id, //product_id
      pp_id: productDetails?.pp_id, //product price id
      vendor_id: productDetails?.vendor_id,
      selectedQuantity: "1",
      color: finalSelectedColor,
    },
  ];
//////////
// console.log('add Color<><',finalSelectedColor ==''?'None':finalSelectedColor);
// console.log('add Color<><',finalSelectedSize ==''?'No size':finalSelectedSize);
const onChangeQuantity = () => {
  let itemToBeChangedQty = [
    {
      id: productDetails?.id, //product_id
      pp_id: productDetails?.pp_id, //product price id
      vendor_id: productDetails?.vendor_id,
      selectedQuantity: "1",
      color: finalSelectedColor ==''?'None':finalSelectedColor,
      size: finalSelectedSize ==''?'No size':finalSelectedSize,
      client_id:clientId,
    },
  ];
  // console.log("itemToBeChangedQty", itemToBeChangedQty);
  addToCartApi({ request: JSON.stringify(itemToBeChangedQty) });
};
const addToCartApi = (addToCartParams) => {
  /////////////>>>>>API
  // console.log("addToCartParamsXXXXXXXX", addToCartParams);
  setLoader(true);
  fetchUrl(addToCartParams, token, ADD_TO_CART_URL)
    .then((resJson) => {
      ////////////////////
      setLoader(false);
      // console.log("ADDTO_CART_result =====", resJson);
      // showToastWithGravity(resJson?.message);
      if (resJson?.status == 200) {
        setObjectInStorage("_cartArray", []);
      productDetailsApi(productDetailsParams)
      } else if (resJson?.status == 400) {
        setObjectInStorage("_cartArray", []);
        showToastWithGravity(resJson?.message);
      } else if (resJson?.status == 603) {
        unAuthorizedHandler(resJson, navigation, dispatch);
      }
    })
    .catch((error) => {
      setLoader(false);
      console.log("ADDTO_CART_BULK_Error", error);
    });
};
//////////
const checkProductParams = {
  p_id: productDetails?.id, //0-REMOVE, 1-ADD
  color: finalSelectedColor,
  size: finalSelectedSize,
};
const checkProductApi = () => {
  // console.log("wishlistParams>>", wishlistParams);
  // setLoader(true);
  fetchUrl(checkProductParams, token, CHECK_PRODUCT_URL)
    .then((resJson) => {
      ////////////////////
      // setLoader(false);
      // console.log("ADDTOWISHLIST_result =====", resJson);
      // showToastWithGravity(resJson?.message);
      if (resJson?.status == 200) {
        showToastWithGravity(resJson?.message);
      } else if (resJson?.status == 400) {
        showToastWithGravity(resJson?.message);
      } else if (resJson?.status == 603) {
        unAuthorizedHandler(resJson, navigation, dispatch);
      }
    })
    .catch((error) => {
      setLoader(false);
      console.log("CHECK_PRODUCT_Error::", error);
    });
};
////////
let selectedSize = cartStatus?.selected_p_size
let selectedColor = cartStatus?.selected_p_color
let sizes = selectedSize?.includes(finalSelectedSize)
let colors = selectedColor?.includes(finalSelectedColor)

// console.log('size',sizes);
// console.log('color',colors);
///////////
  const addCartProductsInAsyncStorage = () => {
    const valueCartArrayToBeStoredParams = CartArrayToBeStoredParams.map(item => {
      if (item.color === "") {
        return {
          ...item,
          color: "None"
        };
      }
      return item;
    });
    onChangeQuantity()
    let CartArrayToBeStored =
      noSizeFlag == true
        ? CartArrayToBeStoredParamsWithNoSize
        : CartArrayToBeStoredParams[0]?.color === '' ? valueCartArrayToBeStoredParams : CartArrayToBeStoredParams; /////////////////
    if (finalSelectedSize == "" && noSizeFlag == false) {
      showToastWithGravity("Please select available size");
    } else if ((finalSelectedColor == "" && productDetails?.colors?.length != 0)&& colorsAvailableBySize[0]?.color !== 'None' ) {
      showToastWithGravity("Please select available color");
    } else if ((AvlQtyInSelectedSizeColorCombination <= 0 && colorsAvailableBySize[0]?.color !== 'None')) {
      showToastWithGravity("This item is currently out of stock");
    } else {
      ////////
      let alreadyExist = false;
      fromAsyncCart?.map((item, index) => {
        let checkItem;
        checkItem =
          JSON.stringify(item) === JSON.stringify(CartArrayToBeStored[0]);
        if (checkItem) {
          alreadyExist = true;
        }
      });
      ////////

      if (alreadyExist) {
        console.log("productExist===");
        showToastWithGravity("Added to cart"); //when already exist
        setAddToCartState(true);
      } else {
        ///
        let toBeStoredArray = [...fromAsyncCart, ...CartArrayToBeStored];

        const isStored = setObjectInStorage("_cartArray", toBeStoredArray);
        setFromAsyncCart(toBeStoredArray);
        // console.log("llllllllllllll");
        if (isStored) {
          showToastWithGravity("Added to cart");
          setAddToCartState(true);
          dispatch(
            cartItemCountAction(cartItemCount + 1) ////////////
          );
          // console.log("kkkkkk");
          // onRefresh();
        }
      }
    }
  };
  //////////////////////
  const addToCartAddToWishlistButtonsRender = () => {
    return (
      <View
        style={[
          styles.AddToButtonsView,
          { height: 55, alignItems: "flex-start" },
        ]}
      >
        <View style={styles.leftButtonView}>
          {productDetails?.wishlist_status == 1 || wishlistState ? (
            <Pressable
              onPress={() => navigation.navigate("WishList")}
              style={styles.buttonRowView}
            >
              <Image
                resizeMode="contain"
                style={[
                  styles.favoritrAndBagIconStyle,
                  { tintColor: "#DD1B47" },
                ]}
                source={require("../../assets/images/redHeart.png")}
              />
              <Text style={styles.addToWishText}>Wishlisted</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() =>
                token ? addToWishlistApi() : navigation.push("Login")
              }
              style={styles.buttonRowView}
            >
              <Image
                resizeMode="contain"
                style={styles.favoritrAndBagIconStyle}
                source={require("../../assets/images/favouriteIcon.png")}
              />
              <Text style={styles.addToWishText}>Add to Wishlist</Text>
            </Pressable>
          )}
        </View>
        <View style={styles.rightButtonView}>
          {
            // productDetails?.cart_status == 1 ||
            //  checkItemFromAsyncStorage ||
            addToCartState ? (
              <Pressable
                onPress={() =>
                  token
                    ? navigation.navigate("MyCart", { stackScreen: true })
                    : navigation.push("Login")
                }
                style={styles.rightButtonRowView}
              >
                <Image
                  resizeMode="contain"
                  style={[
                    styles.favoritrAndBagIconStyle,
                    { tintColor: "#FFFFFF" },
                  ]}
                  source={require("../../assets/images/bagIconTab.png")}
                />
                <Text style={styles.AddToBagText}>Go to Bag</Text>
              </Pressable>
            ) : (
              sizes && colors?
              <Pressable
                onPress={() =>
                  token
                    ? navigation.navigate("MyCart", { stackScreen: true })
                    : navigation.push("Login")
                }
                style={styles.rightButtonRowView}
              >
                <Image
                  resizeMode="contain"
                  style={[
                    styles.favoritrAndBagIconStyle,
                    { tintColor: "#FFFFFF" },
                  ]}
                  source={require("../../assets/images/bagIconTab.png")}
                />
                <Text style={styles.AddToBagText}>Go to Bag</Text>
              </Pressable>
              :
              <Pressable
                onPress={() =>
                  token
                    ? addCartProductsInAsyncStorage()
                    : navigation.push("Login")
                }
                style={styles.rightButtonRowView}
              >
                <Image
                  resizeMode="contain"
                  style={[
                    styles.favoritrAndBagIconStyle,
                    { tintColor: "#FFFFFF" },
                  ]}
                  source={require("../../assets/images/bagIconTab.png")}
                />
                <Text style={styles.AddToBagText}>Add to Bag</Text>
              </Pressable>
            )
          }
        </View>
      </View>
    );
  };

  if (loadingComponent) return <Loader loader={true} setLoader={setLoader} />;
  else
    return (
      <ScreenWrapper>
        {/* {loader == false ? ( */}
        <ScrollView
          style={[styles.scrollView]}
          contentContainerStyle={[styles.scrollViewContainer]}
          showsVerticalScrollIndicator={false}
          // onScrollBeginDrag={() => setButtonsShow(false)}
          // onScrollEndDrag={() => setButtonsShow(true)}
          // onMomentumScrollBegin={() => setButtonsShow(false)}
          // onMomentumScrollEnd={() =>
          //   setTimeout(() => {
          //     buttonsShow == false ? setButtonsShow(true) : null;
          //     buttonsShow == false ? console.log("wtuewwwwwwwwwwwwwwwy") : null;
          //   }, 700)
          // }
        >
          <View style={styles.ViewIntoScrollView}>
            <View style={{ height: hp(60) + 4 }}>
              {/* {productImagesArr ? ( */}
              <ImagesSlider
                data={productImagesArr}
                imageBaseUrl={imageBaseUrl}
              />
              {/* ) : null} */}
            </View>
            <View style={styles.topIconsView}>
              <Pressable
                onPress={() => navigation.goBack()}
                style={styles.eachIconView}
              >
                <Image
                  resizeMode="contain"
                  style={styles.eachIconStyle}
                  source={require("../../assets/images/backArrow2.png")}
                />
              </Pressable>
              <View style={{ flexDirection: "row" }}>
                {/* <Pressable
                  style={styles.eachIconView}
                  // onPress={() => navigation.goBack()}
                >
                  <Image
                    resizeMode="contain"
                    style={styles.eachIconStyle}
                    source={require("../../assets/images/shareIcon.png")}
                  />
                </Pressable> */}
                <Pressable
                  onPress={() =>
                    token
                      ? navigation.navigate("WishList")
                      : navigation.push("Login")
                  }
                  style={[styles.eachIconView, { marginHorizontal: 5 }]}
                >
                  <Image
                    resizeMode="contain"
                    style={styles.eachIconStyle}
                    source={require("../../assets/images/favouriteIcon.png")}
                  />
                </Pressable>
                <Pressable
                  style={styles.eachIconView}
                  onPress={() =>
                    token
                      ? navigation.navigate("MyCart", { stackScreen: true })
                      : navigation.push("Login")
                  }
                >
                  <Image
                    resizeMode="contain"
                    style={styles.eachIconStyle}
                    source={require("../../assets/images/bagIconTab.png")}
                  />
                  {token && cartItemCount != 0 ? (
                    <View style={styles.itemCountBadgeView}>
                      <Text style={styles.itemBadgeCountText}>
                        {cartItemCount}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              </View>
            </View>
            <View style={styles.productTopDetailView}>
              <Text style={styles.productHeading}>
                {productDetails?.brand_name}
              </Text>
              <Text style={styles.productSubHeading}>
                {productDetails?.product_name}
              </Text>
              <Text numberOfLines={1} style={[styles.productPrice, {}]}>
                Rs. {productDetails?.sale_price}{" "}
                <Text
                  numberOfLines={1}
                  style={[
                    styles.productPrice,
                    {
                      fontFamily: "OpenSans-Regular",
                      textDecorationLine: "line-through",
                    },
                  ]}
                >
                  {/* Rs. {productDetails?.mrp} */}
                </Text>
              </Text>
              {/* <Text style={styles.percentageOff}>
                ( {productDetails?.percentage}% OFF)
              </Text> */}
              <Text style={styles.inclusiceTaxes}>Inclusive all taxes</Text>
            </View>
            <View style={styles.componentSeparatorView}></View>
            <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
              {/* {productDetails?.sizes?.length == 0 ? ( */}
              {!noSizeFlag && (
                <>
                  <Text style={styles.sizeText}>Size</Text>
                  <SizeTabsComponent
                    TabsData={sizesAndColors}
                    onPressSizeTab={onPressSizeTab}
                    setFinalSelectedSize={setFinalSelectedSize}
                    setAddToCartState={setAddToCartState}
                  />
                </>
              )}
              
              { productDetails?.colors?.length != 0 ? (
              <>
              {colorsAvailableBySize[0]?.color !== 'None' &&
                <Text style={styles.availableColorsText}>Available Colors</Text>}
                <ColorTabsComponent
                  TabsData={colorsAvailableBySize}
                  finalSelectedSize={finalSelectedSize}
                  setFinalSelectedColor={setFinalSelectedColor}
                  setAvlQtyInSelectedSizeColorCombination={
                    setAvlQtyInSelectedSizeColorCombination
                  }
                  setAddToCartState={setAddToCartState}
                />
              </>
              ) :null}
              {finalSelectedSize != "" &&
              finalSelectedColor != "" &&
              // AvlQtyInSelectedSizeColorCombination != null &&
              AvlQtyInSelectedSizeColorCombination <= 0 ? (
                <Text
                  style={[
                    styles.availableColorsText,
                    {
                      color: "red",
                      fontFamily: "OpenSans-Bold",
                    },
                  ]}
                >
                  This Combination Is Out Of Stock
                </Text>
              ) : null}
            </View>
            {/* <Text>{AvlQtyInSelectedSizeColorCombination}</Text> */}
            <View style={styles.componentSeparatorView}></View>

            <View style={{ padding: 10 }}>
              <View style={styles.productDetailBox}>
                <Text style={styles.productDetailsHeading}>
                  Product Details
                </Text>
                <View style={styles.horizontalLightLine}></View>
                <View style={styles.detailRowView}>
                  {/* {descriptionKeyValuesFinal?.map((item, index) => {
                  return (
                    <View style={styles.leftRightRowView}>
                      <Text style={[styles.detailKeyText]}>{item[0]}</Text>
                      <Text style={[styles.detailValueText]}>{item[1]}</Text>
                    </View>
                  );
                })} */}
                  {specificationvalues?.map((item, index) => {
                    return (
                      <View key={item?.key} style={styles.leftRightRowView}>
                        <Text style={[styles.detailKeyText]}>{item?.key}</Text>
                        <Text style={[styles.detailValueText]}>
                          {item?.value}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                <Text style={[styles.detailKeyText]}>Description</Text>
                <Text style={[styles.detailValueText, { marginTop: 2 }]}>
                  {productDetails?.s_description}
                </Text>

                <Text style={[styles.detailKeyText, { marginTop: 10 }]}>
                  Material & Care
                </Text>
                <Text style={styles.detailValueText}>
                  {productDetails?.description}
                </Text>
              </View>
            </View>

            <View style={{ padding: 10, paddingTop: 0 }}>
              <View style={styles.deliveryInfoBox}>
                <Text style={styles.deliveryInfoHeading}>Delivery Info</Text>
                <View style={styles.horizontalLightLine}></View>

                {/* <View style={styles.otpAndButtonView}>
                <Text style={styles.optText}>134108</Text>
                <View style={styles.changeButtonView}>
                  <Text style={styles.changeButtonText}>Change</Text>
                </View>
              </View>

              <View style={styles.extraLightHorixzontalLine}></View>
              <Text style={styles.infoCommonTextStyle}>
                Please enter PIN code to check delivery time
              </Text> */}

                <View style={styles.InfoRowView}>
                  <View style={styles.leftViewInfoRow}>
                    <Image
                      style={styles.infoImagesStyle}
                      source={require("../../assets/images/InfoDelivery.png")}
                    />
                    <Text style={styles.infoCommonTextStyle}>
                      {/* Get it by Sat, 16 July */}
                      Quick Delivery
                    </Text>
                  </View>
                  <View style={styles.rightViewInfoRow}>
                    <Image
                      style={styles.infoImagesStyle}
                      source={require("../../assets/images/InfoOriginal.png")}
                    />
                    <Text style={styles.infoCommonTextStyle}>
                      100% Original Products
                    </Text>
                  </View>
                </View>
                <View style={[styles.InfoRowView, { marginTop: 15 }]}>
                  <View style={styles.leftViewInfoRow}>
                    <Image
                      style={styles.infoImagesStyle}
                      source={require("../../assets/images/InfoReturn.png")}
                    />
                    <Text style={styles.infoCommonTextStyle}>
                      30 days Return
                    </Text>
                  </View>
                  <View style={styles.rightViewInfoRow}>
                    <Image
                      style={styles.infoImagesStyle}
                      source={require("../../assets/images/InfoFreeShipping.png")}
                    />
                    <Text style={styles.infoCommonTextStyle}>
                      Shipping Charge {productDetails?.logistics}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ padding: 10, paddingTop: 0 }}>
              <View style={styles.deliveryInfoBox}>
                <Text style={styles.deliveryInfoHeading}>Model Stats</Text>
                <View style={styles.horizontalLightLine}></View>

                <View style={styles.InfoRowView}>
                  <View
                    style={{
                      width: "22%",
                      flexDirection: "row",
                      alignItems: "center",
                      // backgroundColor: "red",
                      paddingRight: 10,
                    }}
                  >
                    <Image
                      resizeMode="center"
                      style={{ height: 65, width: 65 }}
                      source={{
                        uri:
                          productDetails?.image_1 != ""
                            ? imageBaseUrl + productDetails?.image_1
                            : "",
                      }}
                    />
                  </View>
                  <View
                    style={{
                      width: "78%",
                      flexDirection: "row",
                      alignItems: "center",
                      // backgroundColor: "red",
                      paddingRight: 10,
                    }}
                  >
                    <View
                      style={{ alignSelf: "flex-start", flexDirection: "row" }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "OpenSans-SemiBold",
                          color: "#161B2F",
                        }}
                      >
                        {productDetails?.brand_name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "OpenSans-SemiBold",
                          color: "#161B2F",
                          marginHorizontal: 3,
                        }}
                      >
                        |
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: "OpenSans-SemiBold",
                          color: "#161B2F",
                        }}
                      >
                        {finalSelectedSize == "" ? "" : 'Fitting :'} {finalSelectedSize ? finalSelectedSize : ""}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <InViewPort onChange={(isVisible) => setButtonsShow(!isVisible)}>
              {addToCartAddToWishlistButtonsRender()}
            </InViewPort>
            <SimilarProducts
              listData={similarProducts}
              imageBaseUrl={imageBaseUrl}
              navigation={navigation}
              productDetailsApi={productDetailsApi}
            />
          </View>
        </ScrollView>
        {/* ) : null} */}
        {buttonsShow ? addToCartAddToWishlistButtonsRender() : null}
        <Loader loader={loader} setLoader={setLoader} />
      </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
  componentSeparatorView: {
    backgroundColor: "#F2F2F2",
    height: 4,
    width: wp(100),
    marginVertical: 10,
  },
  scrollView: {
    // width: wp(100),
    // flex: 1,
    // backgroundColor: 'green',
  },
  scrollViewContainer: {
    // alignItems: 'center',
    // flex: 1
    // width: '100%',
    // backgroundColor: 'green',
  },
  topIconsView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
    //   marginVertical: 5,
    // top: 0,
    width: wp(94),
    height: 50,
    // backgroundColor: "yellow",
    // zIndex: 999,
    position: "absolute",
  },
  eachIconView: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    // backgroundColor: "rgba(0,0,0,0.2)",
    backgroundColor: "rgba(255,255,255,1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "gray",
  },
  eachIconStyle: {
    width: 16,
    height: 16,
    // marginTop: hp(10),
    // marginBottom: 20,
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
  backButtonHeadingText: {
    color: "#161B2F",
    fontSize: 18,
    fontFamily: "OpenSans-Bold",
  },
  ViewIntoScrollView: {
    // alignSelf: 'center',
    // alignItems: 'center',
    // width: wp(100),
    // paddingHorizontal: 20,
    // paddingVertical: 15,
  },
  productTopDetailView: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  productHeading: {
    fontSize: 18,
    fontFamily: "OpenSans-Medium",
    color: "#161B2F",
    marginVertical: 2,
  },
  productSubHeading: {
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
    color: "#646464",
    marginVertical: 2,
  },
  productPrice: {
    fontSize: 20,
    fontFamily: "OpenSans-Bold",
    color: "#161B2F",
    marginVertical: 2,
  },
  percentageOff: {
    fontSize: 15,
    fontFamily: "OpenSans-Bold",
    color: "#DD1B47",
    marginVertical: 2,
  },
  inclusiceTaxes: {
    fontSize: 10,
    fontFamily: "OpenSans-Regular",
    color: "#1AA235",
  },
  sizeText: {
    fontSize: 17,
    fontFamily: "OpenSans-Regular",
    color: "#646464",
    // marginTop: 8,
    marginBottom: 5,
  },
  availableColorsText: {
    fontSize: 17,
    fontFamily: "OpenSans-Regular",
    color: "#646464",
    marginTop: 8,
    marginBottom: 5,
  },
  productDetailBox: {
    borderWidth: 1,
    borderColor: "rgba(22, 27, 47,0.2)",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  productDetailsHeading: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 16,
    color: "#161B2F",
  },
  horizontalLightLine: {
    height: 0.5,
    backgroundColor: "rgba(22, 27, 47, 0.3)",
    marginVertical: 5,
  },
  detailRowView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    flexWrap: "wrap",
  },
  leftView: {
    width: "50%",
  },
  detailKeyText: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 14,
    color: "#161B2F",
  },
  detailValueText: {
    fontFamily: "OpenSans-Regular",
    fontSize: 14,
    color: "#646464",
  },
  leftRightRowView: {
    width: "50%",
    marginBottom: 5,
  },
  //info
  deliveryInfoBox: {
    borderWidth: 1,
    borderColor: "rgba(22, 27, 47,0.2)",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  deliveryInfoHeading: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: 16,
    color: "#161B2F",
  },
  otpAndButtonView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },
  optText: {
    fontSize: 14,
    color: "#161B2F",
    fontFamily: "OpenSans-SemiBold",
  },
  changeButtonView: {
    backgroundColor: "#161B2F",
    borderRadius: 5,
    width: 70,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  changeButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "OpenSans-SemiBold",
  },
  extraLightHorixzontalLine: {
    alignSelf: "center",
    height: 0.5,
    backgroundColor: "rgba(22, 27, 47, 0.2)",
    marginVertical: 5,
    width: "98%",
  },
  infoCommonTextStyle: {
    fontSize: 11,
    color: "#646464",
    fontFamily: "OpenSans-Regular",
    textAlign: "left",
  },
  InfoRowView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  leftViewInfoRow: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingRight: 10,
  },
  rightViewInfoRow: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingRight: 10,
  },
  infoImagesStyle: {
    height: 20,
    width: 20,
    marginRight: 5,
  },
  AddToButtonsView: {
    backgroundColor: "white",
    height: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  leftButtonView: {
    backgroundColor: "white",
    height: 45,
    width: "48.5%",
    borderWidth: 1,
    borderColor: "rgba(22, 27, 47, 0.2)",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonRowView: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  favoritrAndBagIconStyle: {
    height: 18,
    width: 18,
    tintColor: "gray",
    marginRight: 6,
  },
  addToWishText: {
    color: "#646464",
    fontSize: 15,
    fontFamily: "OpenSans-Medium",
  },
  rightButtonView: {
    backgroundColor: "#1A97CC",
    height: 45,
    width: "48.5%",
    // borderWidth: 1,
    // borderColor: "rgba(22, 27, 47, 0.05)",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  rightButtonRowView: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  AddToBagText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "OpenSans-Medium",
  },
});
