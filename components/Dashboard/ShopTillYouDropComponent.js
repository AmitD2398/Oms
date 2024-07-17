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

export default function ShopTillYouDropComponent({
  navigation,
  listData,
  baseUrl,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const renderItemFlexWrap = (item, index) => {
    return (
      <View key={item?.id} style={[styles.renderItemView]}>
        <Pressable
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
          style={[styles.pressableStyle, {}]}
        >
          <ImageBackground
            resizeMode="contain"
            style={styles.imageBackground}
            source={require("../../assets/images/shopTillBackground.png")}
            // source={item?.image}
          >
            <Image
              onLoad={() => setImageLoaded(true)}
              resizeMode="center"
              style={styles.itemImage}
              // source={require("../../assets/images/shopTillListImage.png")} //.png
              source={{ uri: baseUrl + item?.image }}
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
                  style={{ width: 30, height: 30 }}
                />
              </View>
            )}
          </ImageBackground>

          <Text numberOfLines={1} style={styles.itemHeading}>
            {item?.name}
          </Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.headingText}>Shop Till You Drop</Text>
      <View style={styles.flexWrapViewStyle}>
        {listData?.map(renderItemFlexWrap)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: 'red',
  },
  headingText: {
    fontSize: 22,
    color: "#24AAE3",
    fontFamily: "PlayfairDisplay-SemiBold",
    marginBottom: 10,
  },
  flexWrapViewStyle: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    // justifyContent: "center",
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
    marginBottom: 10,
  },
  rightArrrowIcon: {
    width: 15,
    height: 15,
    tintColor: "#0E1525",
  },

  //<<<<<<<<<<<<<renderItemFlexWrap style>>>>>>>>>>>>>>>
  renderItemView: {
    height: 130,
    width: "33%",
    // borderRadius: wp(25 / 2),
    justifyContent: "center",
    alignItems: "center",
  },
  pressableStyle: {
    height: "98%",
    width: "98%",
    alignItems: "center",
    // justifyContent: 'space-between',
    // backgroundColor: 'red',
  },
  imageBackground: {
    // backgroundColor: "orange",
    height: 100,
    width: 100,
    // borderRadius: 50,
    padding: 12,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  itemImage: {
    // backgroundColor: "green",
    alignSelf: "center",
    width: "100%",
    height: "100%",
    borderRadius: 50,
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
});
