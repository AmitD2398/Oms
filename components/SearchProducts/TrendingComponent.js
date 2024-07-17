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
import NoRecordFoundComponent from "../Common/NoRecordFoundComponent";

export default function TrendingComponent({
  imageBaseUrl,
  listData,
  navigation,
  searchText,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const renderItemFlexWrap = ({ item, index }) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("ProductDetails", {
            productId: item?.id,
            productPriceId: item?.pp_id,
          })
        }
        style={[
          styles.renderItemView,
          // { backgroundColor: index == '0' ? 'green' : 'transparent' },
        ]}
      >
        <View style={styles.itemImageView}>
          <Image
            onLoad={() => setImageLoaded(true)}
            resizeMode="contain"
            style={styles.itemImage}
            // source={require("../../assets/images/similarProductImage.png")}
            source={{ uri: imageBaseUrl + item?.image_1 }}
          />
        </View>
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

        <View style={styles.itemTextView}>
          <Text numberOfLines={2} style={styles.itemHeading}>
            {item?.product_name}
          </Text>
          {/* <Text numberOfLines={1} style={styles.itemDesc}>
            {item?.product_name}
          </Text> */}
          <Text numberOfLines={1} style={styles.itemPrice}>
            Rs. {item?.sale_price}
            <Text style={styles.itemCrossPrice}>Rs. {item?.mrp}</Text>
          </Text>
          <Text numberOfLines={1} style={styles.itemOffPercent}>
            ({item?.percentage}% OFF)
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
        {/* {searchText?.length == 0 ? (
          <Text style={[styles.headingText, { fontSize: 18 }]}>
            Start searching products...
          </Text>
        ) : null} */}
        {listData?.length == 0 && searchText?.length != 0 ? (
          // <Text style={styles.headingText}>No items found</Text>
          <NoRecordFoundComponent
            contentText={"Sorry ! No Items Found For Your Search"}
          />
        ) : (
          listData?.length != 0 && (
            <Text style={styles.headingText}>
              {/* Trending */}
              {searchText?.length == 0
                ? `All Products`
                : `Found ${listData?.length} item(s)`}
            </Text>
          )
        )}
        <ScrollView //scrollView to avoid same orientation issue
          scrollEnabled={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          // style={{ backgroundColor: 'green'}}
          contentContainerStyle={{
            alignItems: "center",
            width: "100%",
            // backgroundColor: 'red',
          }}
        >
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
    flex: 1,
  },
  headingText: {
    fontSize: 22,
    color: "#1A97CC",
    fontFamily: "PlayfairDisplay-SemiBold",
    marginVertical: 10,
  },
  //<<<<<<<<<<<<<renderItemFlexWrap style>>>>>>>>>>>>>>>
  renderItemView: {
    // backgroundColor: 'red',
    height: 260,
    width: "49%",
    margin: "0.5%",
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(242, 245, 246, 1)",
    borderRadius: 4,
    padding: 2,
    // paddingVertical: 2,
    // marginTop: 5,
    // padding: 10,
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
