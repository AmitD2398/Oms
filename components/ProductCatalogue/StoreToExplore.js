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

export default function StoreToExplore({ navigation, data }) {
  let ListData = data;

  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => navigation.navigate("ProductDetails")}
        style={styles.renderItemView}
      >
        <View style={styles.itemImageView}>
          <Image
            resizeMode="stretch" // contain
            style={[styles.itemImage]}
            // source={require('../../assets/images/nowOrNeverList.png')}
            source={item?.image}
          />
        </View>
        <View style={styles.itemAbsoluteView}>
          <View style={styles.itemAbsoluteTextView}>
            <Text style={styles.itemTitleText}>Festive Stores</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.itemSubTitleText}>Explore Now</Text>
              <Image
                resizeMode="contain"
                style={styles.rightArrow}
                source={require("../../assets/images/rightArrow.png")}
                // source={item?.image}
              />
            </View>
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
          width: 12,
          //   width: '100%',
          // backgroundColor: 'white',
        }}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.headingText}>Stores to Explore</Text>
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
    color: "#DD1B47",
    fontFamily: "PlayfairDisplay-SemiBold",
    marginBottom: 10,
  },
  //<<<<<<<<<<<<<renderItem style>>>>>>>>>>>>>>>
  renderItemView: {
    // backgroundColor: 'red',
    height: 310,
    width: wp(72),
    justifyContent: "space-between",
    alignItems: "center",
    justifyContent: "center",
    // paddingVertical: 2,
    marginTop: 5,
  },
  itemImageView: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    // backgroundColor: 'yellow',
  },
  itemAbsoluteView: {
    position: "absolute",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    // backgroundColor: "yellow",
    flexDirection: "row",
    alignItems: "center",
  },
  itemAbsoluteTextView: {
    // backgroundColor: "red",
    alignSelf: "flex-end",
    height: "17%",
    width: "80%",
    marginBottom: "5%",
    padding: 10,
    alignItems: "center",
    // flexDirection: "row",
    justifyContent: "center",
  },
  itemTitleText: {
    // alignSelf: "center",
    color: "#FFFFFF",
    fontSize: 22,
    fontFamily: "TimesNewRoman-Bold",
  },
  itemSubTitleText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "TimesNewRoman-Regular",
    marginRight: 5,
  },
  rightArrow: {
    width: 17,
    height: 17,
  },
});
