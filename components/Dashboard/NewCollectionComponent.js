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

export default function NewCollectionComponent({
  navigation,
  bannerData,
  data,
  product_type,
  baseUrl,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageLoaded1, setImageLoaded1] = useState(false);

  let ListData = data;

  const renderItem = ({ item, index }) => {
    // console.log("itemmmm>>>", item);
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
            onLoad={setImageLoaded1}
            resizeMode="contain"
            style={styles.itemImage}
            // source={require('../../assets/images/nowOrNeverList.png')}
            source={{ uri: baseUrl + item?.image_1 }}
          />
          {!imageLoaded1 && (
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
        </View>
        <View style={styles.itemTextView}>
          <Text numberOfLines={1} style={styles.itemHeading}>
            {item?.brand_name}
          </Text>
          <Text numberOfLines={1} style={styles.itemDesc}>
            {item?.product_name}
          </Text>
          <Text numberOfLines={1} style={styles.itemPrice}>
            Rs. {item?.final_price}{" "}
            <Text style={styles.itemCrossPrice}>Rs. {item?.mrp}</Text>
          </Text>
          <Text numberOfLines={1} style={styles.itemOffPercent}>
            ({item?.percentage}% OFF)
          </Text>
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
          //   backgroundColor: 'white',
        }}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.headingText}>New Collection</Text>
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
      <Pressable
      // onPress={() => navigation.navigate("ProductList")}
      >
        <Image
          onLoad={() => setImageLoaded(true)}
          resizeMode="stretch"
          style={styles.bannerImage}
          // source={require("../../assets/images/newCollectionBanner.png")}
          source={{ uri: baseUrl + bannerData?.image }}
        />
        {!imageLoaded && (
          <View
            style={[
              styles.bannerImage,
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
              style={{ width: 70, height: 70 }}
            />
          </View>
        )}
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
    color: "#24AAE3",
    fontFamily: "PlayfairDisplay-SemiBold",
    // marginTop: 10,
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
  },
  rightArrrowIcon: {
    width: 15,
    height: 15,
    tintColor: "#0E1525",
  },
  bannerImage: {
    width: "100%",
    height: wp(100),
    alignSelf: "center",
    marginVertical: 10,
    // backgroundColor: 'green',
  },
  //<<<<<<<<<<<<<renderItem style>>>>>>>>>>>>>>>
  renderItemView: {
    //   backgroundColor: 'red',
    height: 220,
    width: wp(37),
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
    padding: 0,
    marginTop: 5,
    borderRadius: 5,
    // borderWidth: 1,
    borderColor: "#F2F5F6",
  },
  itemImageView: {
    height: "68%",
    width: "100%",
  },
  itemImage: {
    width: "100%",
    height: "100%",
  },
  itemTextView: {
    width: "100%",
    height: "32%",
    paddingVertical: 2,
    // backgroundColor: "yellow",
    justifyContent: "center",
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
