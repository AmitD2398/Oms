import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ImageBackground,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function WintersChecklist({ navigation, listData }) {
  const renderItemFlexWrap = (item, index) => {
    return (
      <View key={index.toString()} style={[styles.renderItemView]}>
        <Pressable
          onPress={() => navigation.navigate("ProductDetails")}
          style={[styles.pressableStyle, {}]}
        >
          <Image
            resizeMode="cover"
            style={styles.itemImage}
            // source={require("../../assets/images/similarProductImage.png")} //.png
            // source={item?.image}
          />
          <Text numberOfLines={1} style={styles.itemHeading}>
            Jackets
          </Text>
          <Text numberOfLines={1} style={styles.itemSubText}>
            Min 40% OFF
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.headingText}>Winters Checklist</Text>
      <View style={styles.flexWrapViewStyle}>
        {listData?.map(renderItemFlexWrap)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headingText: {
    fontSize: 22,
    color: "#DD1B47",
    fontFamily: "PlayfairDisplay-SemiBold",
    marginBottom: 10,
  },
  flexWrapViewStyle: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  //<<<<<<<<<<<<<renderItemFlexWrap style>>>>>>>>>>>>>>>
  renderItemView: {
    height: 130,
    width: "33%",
    justifyContent: "center",
    alignItems: "center",
  },
  pressableStyle: {
    height: "98%",
    width: "98%",
    alignItems: "center",
  },
  itemImage: {
    height: 80,
    width: 80,
    borderRadius: 80 / 2,
    alignSelf: "center",
  },
  itemHeading: {
    fontSize: 14,
    color: "#161B2F",
    fontFamily: "OpenSans-Medium",
  },
  itemSubText: {
    fontSize: 11,
    color: "#161B2F",
    fontFamily: "OpenSans-Light",
    opacity: 0.8,
  },
});
