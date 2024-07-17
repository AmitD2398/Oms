import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Pressable,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function KnockOutDealsComponent({
  navigation,
  data,
  product_type,
  baseUrl,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  let ListData = data;
  // console.log("topDealArray",ListData);

  const renderItem = ({ item, index }) => {
    // console.log("item>>>", item);
    return (
      <Pressable
        key={item?.id}
        onPress={() =>
          navigation.navigate("ProductDetails", {
            productId: item?.id,
            productPriceId: item?.pp_id,
          })
        }
        style={styles.renderItemView}
      >
        <View style={styles.itemImageView}>
          <Image
            onLoad={() => setImageLoaded(true)}
            resizeMode="contain" // contain
            style={[styles.itemImage, {}]}
            // source={require('../../assets/images/nowOrNeverList.png')}
            source={{ uri: baseUrl + item?.image_1 }}
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
          <View style={styles.itemBottomView}></View>
        </View>
        <View style={styles.itemAbsoluteView}>
          <View style={styles.itemAbsoluteTextView}>
            <Text numberOfLines={1} style={styles.itemTitleText}>
              {item?.product_name}
            </Text>
            <Text style={styles.itemDiscountText}>{item?.percentage}% Off</Text>
          </View>
        </View>
      </Pressable>
    );
  };
  const ItemSeparatorComponent = () => {
    return (
      <View
        style={{
          //   height: 10,
          width: 7,
          //   width: '100%',
          // backgroundColor: 'white',
        }}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.headingText}>Knockout Deals</Text>
      <Pressable
        onPress={() =>
          navigation.navigate("ProductList", {
            from: "Dashboard",
            categoryName: product_type,
            product_type: product_type,
          })
        }
        style={styles.shopNowAndIconView}
      >
        <Text style={styles.shopNowText}>Shop now</Text>
        <Image
          resizeMode="contain"
          style={styles.rightArrrowIcon}
          source={require("../../assets/images/rightArrow.png")}
        />
      </Pressable>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={ListData}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        style={{
          //  backgroundColor: 'red',
          width: wp(100),
        }}
        contentContainerStyle={{
          paddingRight: 20,
          //   paddingLeft: 10,
          // backgroundColor: 'green'
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    // height: hp(70),
    // flex: 1,
    // backgroundColor: 'green',
  },
  headingText: {
    fontSize: 22,
    color: "#24AAE3",
    fontFamily: "PlayfairDisplay-SemiBold",
    // marginBottom: 10,
  },
  shopNowAndIconView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "35%",
  },
  shopNowText: {
    fontSize: 15,
    color: "#7E7E7E",
    fontFamily: "OpenSans-Regular",
    marginBottom: 10,
  },
  rightArrrowIcon: {
    width: 15,
    height: 15,
    tintColor: "#0E1525",
  },
  //<<<<<<<<<<<<<renderItem style>>>>>>>>>>>>>>>
  renderItemView: {
    // backgroundColor: 'red',
    height: 200,
    width: wp(42),
    justifyContent: "space-between",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    marginTop: 5,
    borderRadius: 5,
    // borderWidth: 1,
    borderColor: "#F2F5F6",
  },
  itemImageView: {
    height: "100%",
    width: "100%",
    // backgroundColor: "red",
    alignItems: "center",
  },
  itemImage: {
    width: "100%",
    height: "86%",
  },
  itemBottomView: {
    width: "100%",
    height: "14%",
    // backgroundColor: "#DD1B47",
    backgroundColor: "#1A97CC",
  },
  itemAbsoluteView: {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    // backgroundColor: 'yellow',
    flexDirection: "row",
    alignItems: "center",
  },
  itemAbsoluteTextView: {
    backgroundColor: "#F3F3F3",
    alignSelf: "flex-end",
    height: "22%",
    width: "90%",
    marginBottom: "5%",
    borderTopEndRadius: 15,
    padding: 5,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  itemTitleText: {
    color: "#161B2F",
    fontSize: 14,
    fontFamily: "TimesNewRoman-Regular",
  },
  itemDiscountText: {
    color: "#161B2F",
    fontSize: 14,
    fontFamily: "TimesNewRoman-Bold",
  },
});
