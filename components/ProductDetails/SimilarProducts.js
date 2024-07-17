import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Pressable,
  Image,
  ScrollView,
} from "react-native";

export default function SimilarProducts({
  listData,
  imageBaseUrl,
  navigation,
  productDetailsApi,
}) {
  const renderItemFlexWrap = ({ item, index }) => {
    // console.log("itemRender", item);
    return (
      <Pressable
        onPress={() =>
          navigation.push("ProductDetails", {
            productId: item?.id,
            productPriceId: item?.pp_id,
            // productId: 6065,
            // productPriceId: 20898,
          })
        }
        // onPress={() =>
        //   productDetailsApi({
        //     product_id: 6075, //6065,//6075(No size)
        //     pp_id: 20908, //20898,//20908(No Size)
        //   })
        // }
        style={[
          styles.renderItemView,
          // { backgroundColor: index == '0' ? 'green' : 'transparent' },
        ]}
      >
        <View style={styles.itemImageView}>
          <Image
            resizeMode="stretch"
            style={styles.itemImage}
            // source={require("../../assets/images/similarProductImage.png")}
            source={{ uri: imageBaseUrl + item?.image_1 }}
          />
        </View>
        <View style={styles.itemTextView}>
          <Text numberOfLines={1} style={styles.itemHeading}>
            {item?.brand}
          </Text>
          <Text numberOfLines={1} style={styles.itemDesc}>
            {item?.product_name}
          </Text>
          <Text numberOfLines={1} style={styles.itemPrice}>
            {`Rs. ${item?.sale_price} `}
            <Text style={styles.itemCrossPrice}>{`Rs. ${item?.mrp} `}</Text>
          </Text>
          <Text numberOfLines={1} style={styles.itemOffPercent}>
            {`(${item?.percentage}% OFF)`}
          </Text>
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
        <Text style={styles.headingText}>You may also like</Text>
        <ScrollView //scrollView to avoid same orientation issue
          scrollEnabled={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          // style={{ backgroundColor: 'green'}}
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
            paddingBottom: 35,
            // backgroundColor: 'red',
          }}
        >
          {listData?.length == 0 ? (
            <Text style={styles.noProductsText}>No similar products found</Text>
          ) : null}
          <FlatList //flatlist for flexWrap elements list
            scrollEnabled={false}
            numColumns={2}
            data={listData}
            renderItem={renderItemFlexWrap}
            ItemSeparatorComponent={DividerFlexWrap}
            keyExtractor={(item) => item?.id.toString()}
            pagingEnabled
            style={{ width: "100%" }}
            // onScrollToIndexFailed={(e) => console.log()}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    // flex: 1,
  },
  headingText: {
    fontSize: 22,
    color: "#24AAE3",
    fontFamily: "PlayfairDisplay-SemiBold",
    marginVertical: 10,
  },
  noProductsText: {
    fontSize: 14,
    color: "#646464",
    fontFamily: "PlayfairDisplay-SemiBold",
    // marginVertical: 10,
  },
  //<<<<<<<<<<<<<renderItemFlexWrap style>>>>>>>>>>>>>>>
  renderItemView: {
    // backgroundColor: 'red',
    height: 260,
    width: "49%",
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#F2F5F6",
    margin: "0.5%",
    // paddingVertical: 2,
    // marginTop: 5,
    padding: 2,
  },
  itemImageView: {
    // backgroundColor: 'green',
    height: "72%",
    width: "100%",
  },
  itemImage: {
    // backgroundColor: 'green',
    width: "100%",
    height: "100%",
  },
  itemTextView: {
    width: "100%",
    height: "28%",
    paddingHorizontal: 4,
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
