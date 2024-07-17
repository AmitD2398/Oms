import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ImageBackground,
  Pressable,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function BestOfHAndMDeals({ navigation, data }) {
  let ListData = data;

  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => navigation.navigate("ProductDetails")}
        style={styles.renderItemView}
      >
        <View style={styles.itemImageView}>
          <Image
            resizeMode="stretch"
            style={styles.itemImage}
            // source={require('../../assets/images/nowOrNeverList.png')}
            source={item?.image}
          />
        </View>
        <View style={styles.itemTextView}>
          <Text numberOfLines={1} style={styles.itemHeading}>
            Vero Moda
          </Text>
          <Text numberOfLines={1} style={styles.itemDesc}>
            Blue & red stirps dress
          </Text>
          <Text numberOfLines={1} style={styles.itemPrice}>
            Rs. 1519 <Text style={styles.itemCrossPrice}>Rs. 3799</Text>
          </Text>
          <Text numberOfLines={1} style={styles.itemOffPercent}>
            (60% OFF)
          </Text>
        </View>
        {/* <View style={styles.pagingIndicatorLineView}>
          {ListData?.map((item, ind) => {
            return (
              <View
                key={item?.id?.toString()}
                style={{
                  height: 4,
                  backgroundColor: index == ind ? '#DD1B47' : 'green',
                  //   backgroundColor: 'green',
                  width: wp(100 / (ListData?.length - 1)),
                  //   width: 20,
                }}
              ></View>
            )
          })}
        </View> */}
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
      <Pressable onPress={() => navigation.navigate("ProductList")}>
        <Image
          resizeMode="stretch"
          style={styles.bannerImage}
          // source={require("../../assets/images/NowOrNever.png")}
        />
      </Pressable>
      <Text style={styles.headingText}>Best of H&M Deals</Text>
      <Pressable
        onPress={() => navigation.navigate("ProductList")}
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
          // backgroundColor: 'green'
        }}
        // pagingEnabled
        // scrollIndicatorInsets={{ right: 1 }}
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
    color: "#DD1B47",
    fontFamily: "PlayfairDisplay-SemiBold",
    marginTop: 10,
  },
  shopNowAndIconView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "35%",
  },
  shopNowText: {
    fontSize: 15,
    color: "#0E1525",
    fontFamily: "OpenSans-Regular",
  },
  rightArrrowIcon: {
    width: 15,
    height: 15,
    tintColor: "#0E1525",
  },
  bannerImage: {
    width: "100%",
    height: 200,
    alignSelf: "center",
    //   backgroundColor: 'green',
    marginTop: 10,
    marginBottom: 2,
  },
  //<<<<<<<<<<<<<renderItem style>>>>>>>>>>>>>>>
  renderItemView: {
    // backgroundColor: 'red',
    height: 230,
    width: wp(35),
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 2,
    marginTop: 5,
  },
  itemImageView: {
    height: "70%",
    width: "100%",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemTextView: {
    width: "100%",
    height: "30%",
    paddingRight: 2,
    paddingVertical: 2,
    // backgroundColor: 'yellow',
  },
  itemHeading: {
    fontSize: 14,
    color: "#161B2F",
    fontFamily: "OpenSans-Medium",
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
