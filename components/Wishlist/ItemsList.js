import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Pressable,
  Image,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useSelector, useDispatch } from "react-redux";

export default function ItemsList({
  navigation,
  listData,
  removeFromWishlistApi,
  // checkAlreadyInAsyncStore,
  // addCartProductsInAsyncStorage,
}) {
  //   const [currentIndex, setCurrentIndex] = useState(0)
  const { imageBaseUrl } = useSelector((state) => state.imageBaseUrlReducer);

  const [imageLoaded, setImageLoaded] = useState(false);

  const renderItemFlexWrap = ({ item, index }) => {
    // console.log("item<333>", item);
    return (
      <Pressable
        key={item?.id?.toString()}
        onPress={() => {
          navigation.push("ProductDetails", {
            productId: item?.product_id,
            productPriceId: item?.pp_id,
          });
        }}
        style={[styles.renderItemView]}
      >
        <View style={styles.itemImageView}>
          <Image
            onLoad={() => setImageLoaded(true)}
            resizeMode="contain"
            style={styles.itemImage}
            source={{ uri: imageBaseUrl + item?.image_1 }}
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

          <Pressable
            style={{
              position: "absolute",
              alignSelf: "flex-end",
              // backgroundColor: "red",
              height: 35,
              width: 35,
              alignItems: "flex-end",
            }}
            onPress={() =>
              removeFromWishlistApi({
                //To Remove
                request: 0, //0-REMOVE, 1-ADD
                product_id: item?.product_id,
                product_price_id: item?.pp_id,
                vendor_id: item?.vendor_id,
              })
            }
          >
            <Image
              resizeMode="contain"
              style={{
                height: 20,
                width: 20,
              }}
              source={require("../../assets/images/removeCross.png")}
            />
          </Pressable>
        </View>
        <View style={styles.itemTextView}>
          <Text numberOfLines={1} style={styles.itemHeading}>
            {item?.product_name}
          </Text>
          <View style={styles.priceView}>
            <Text numberOfLines={1} style={styles.itemPrice}>
              {`Rs. ${item?.sale_price} `}
            </Text>
            <Text
              numberOfLines={1}
              style={styles.itemCrossPrice}
            >{`Rs. ${item?.mrp} `}</Text>
          </View>
          <Text
            style={styles.itemOffPercent}
          >{`(${item?.percentage}% OFF)`}</Text>
          {/* {checkAlreadyInAsyncStore(item) || item?.cart_status == 1 ? (
            <Pressable
              onPress={() => navigation.navigate("MyCart")}
              style={styles.buttonView}
            >
              <Text style={styles.buttonText}>Go to bag</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => addCartProductsInAsyncStorage(item)}
              style={styles.buttonView}
            >
              <Text style={styles.buttonText}>Add to bag</Text>
            </Pressable>
          )} */}
        </View>
      </Pressable>
    );
  };
  const DividerFlexWrap = () => {
    return <View style={{ width: 0 }} />;
  };

  return (
    <View style={styles.mainContainer}>
      <View style={{ paddingHorizontal: 10 }}>
        <FlatList //flatlist for flexWrap elements list
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={listData}
          renderItem={renderItemFlexWrap}
          ItemSeparatorComponent={DividerFlexWrap}
          keyExtractor={(item) => item?.id?.toString()}
          style={{ width: "100%" }}
          contentContainerStyle={{ paddingVertical: 10 }}
          // onScrollToIndexFailed={(e) => console.log()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  //<<<<<<<<<<<<<renderItemFlexWrap style>>>>>>>>>>>>>>>
  renderItemView: {
    // backgroundColor: "red",
    // height: 340,
    // height: 320,
    height: 250,
    width: "49%",
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 4,
    // borderWidth: 1,
    // borderColor: "#F2F5F6",
    margin: 2,

    // paddingVertical: 2,
    // marginTop: 5,
  },
  itemImageView: {
    // backgroundColor: "green",
    height: "70%",
    width: "100%",
  },
  itemImage: {
    // backgroundColor: 'green',
    width: "100%",
    height: "100%",
  },
  itemTextView: {
    width: "100%",
    height: "30%",
    paddingHorizontal: 4,
    paddingVertical: 2,
    // backgroundColor: 'yellow',
  },
  itemHeading: {
    fontSize: 15,
    color: "#161B2F",
    fontFamily: "OpenSans-Medium",
  },
  priceView: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "red",
    width: "99%",
  },
  itemPrice: {
    fontSize: 12,
    color: "#161B2F",
    fontFamily: "OpenSans-Medium",
    width: "50%",
    // backgroundColor: "yellow",
  },
  itemCrossPrice: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    fontSize: 11,
    color: "#646464",
    fontFamily: "OpenSans-Regular",
    width: "50%",
    // backgroundColor: "green",
  },
  itemOffPercent: {
    fontSize: 11,
    color: "#CB3535",
    fontFamily: "OpenSans-Regular",
  },
  buttonView: {
    backgroundColor: "#161B2F",
    height: 30,
    width: wp(22),
    alignSelf: "center",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "OpenSans-Medium",
  },
});
