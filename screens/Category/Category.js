import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  ImageBackground,
} from "react-native";
import { useState, useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/Common/LoaderModal";
import { fetchUrl } from "../../Utils/FetchHelper";
import { CATEGORIES_URL } from "../../Utils/ApiUrlConstants";
import { unAuthorizedHandler } from "../../Utils/UnAuthorizedHandler";
import NoRecordFoundComponent from "../../components/Common/NoRecordFoundComponent";

export default function Category({ navigation }) {
  const { token } = useSelector((state) => state.tokenReducer);
  // console.log("token>>>>>>>>>>>>>>>>>>>>>>>Category", token);
  const { imageBaseUrl } = useSelector((state) => state.imageBaseUrlReducer);
  const { cartItemCount } = useSelector((state) => state.cartItemsCountReducer);
  const [imageLoaded, setImageLoaded] = useState(false);

  const dispatch = useDispatch();

  const [loader, setLoader] = useState(true);
  const [categoriesArray, setCategoriesArray] = useState([]);

  useEffect(() => {
    setLoader(true);
    fetchUrl({}, "", CATEGORIES_URL)
      .then((resJson) => {
        ////////////////////
        setLoader(false);
        // console.log("CATEGORIES_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          // console.log("accessToken", resJson?.data?.login_token?.token);
          setCategoriesArray(resJson?.data?.categories);
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("CATEGORIES_Error::", error);
      });
  }, []);

  const renderItem = ({ item, index }) => {
    // console.log("item", item);
    return (
      <Pressable
        key={item?.id}
        onPress={
          () =>
            // item?.subcategories?.length > 0
            // ?
            navigation.navigate("SubCategory", {
              categoryName: item?.name,
              subcategoryData: item?.subcategories,
            })
          // : navigation.navigate("ProductList")
        }
        style={styles.itemView}
      >
        <ImageBackground
          onLoad={() => setImageLoaded(true)}
          resizeMode="stretch"
          imageStyle={styles.itemBackgroundImageStyle}
          style={styles.itemBackgroundImage}
          // source={require('../../assets/images/nowOrNeverList.png')}
          source={{
            uri: imageBaseUrl + item?.image,
          }}
        >
          <View style={styles.itemTextView}>
            <Text numberOfLines={2} style={styles.itemHeadingText}>
              {item?.name}
            </Text>
            <Text numberOfLines={1} style={styles.itemDescText}>
              {item?.description}
            </Text>
          </View>
        </ImageBackground>
        {!imageLoaded && (
          <View
            style={[
              styles.itemBackgroundImage,
              styles.itemBackgroundImageStyle,
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
    );
  };

  const ItemSeparatorComponent = () => {
    return (
      <View
        style={{
          height: 10,
        }}
      />
    );
  };
  return loader ? (
    <Loader loader={loader} setLoader={setLoader} />
  ) : (
    <ScreenWrapper>
      <View style={styles.headerView}>
        <Text style={styles.headerText}>Categories</Text>
        <View style={styles.iconsView}>
          <Pressable
            style={styles.favouriteIconView}
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
              token ? navigation.navigate("MyCart") : navigation.push("Login")
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

      {loader == false && categoriesArray?.length == 0 ? (
        <NoRecordFoundComponent contentText={"Sorry ! No Record Found"} />
      ) : (
        <View style={styles.ViewIntoScrollView}>
          <FlatList
            data={categoriesArray}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            ItemSeparatorComponent={ItemSeparatorComponent}
            style={{
              width: "100%",
            }}
            contentContainerStyle={{
              paddingVertical: 10,
            }}
          />
        </View>
      )}
      <Loader loader={loader} setLoader={setLoader} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 5,
    paddingBottom: 10,
    width: "94%",
  },
  headerText: {
    fontSize: 18,
    color: "#161B2F",
    fontFamily: "OpenSans-Bold",
    width: "50%",
  },
  iconsView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "50%",
  },
  favouriteIconView: {
    marginHorizontal: 10,
  },
  ViewIntoScrollView: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
    width: wp(100),
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
  //renderItem style>>>>>>>>>>>>>>>
  itemView: {
    width: "94%",
    height: 150,
    alignSelf: "center",
  },
  itemBackgroundImageStyle: {
    borderRadius: 15,
    borderTopRightRadius: 70,
  },
  itemBackgroundImage: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  itemTextView: {
    alignSelf: "flex-end",
    backgroundColor: "#FFFFFF",
    width: "45%",
    height: "45%",
    borderTopLeftRadius: 60,
    overflow: "hidden",
    paddingTop: 15,
    paddingLeft: 20,
  },
  itemHeadingText: {
    alignSelf: "center",
    fontSize: 15,
    color: "#161B2F",
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    textTransform: 'lowercase'
  },
  itemDescText: {
    fontSize: 12,
    color: "#646464",
    fontFamily: "OpenSans-Regular",
    textAlign:'center'
  },
});
