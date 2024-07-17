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

export default function NowOrNeverComponent({
  navigation,
  bannerData,
  data,
  groupType,
  baseUrl,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageLoaded1, setImageLoaded1] = useState(false);

  let ListData = data;
  // const [ListData, setListData] = useState([]);

  // useEffect(() => {
  //   setListData(data);
  // }, []);

  // console.log("bannerData====", bannerData);
  const renderItem = ({ item, index }) => {
    // console.log("item<>>", item);
    return (
      <Pressable
        key={item.id}
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
            onLoad={() => setImageLoaded1(true)}
            resizeMode="contain"
            style={styles.itemImage}
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
          width: 7,
        }}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.headingText}>Now or Never</Text>
      <Pressable
        onPress={() =>
          navigation.navigate("ProductList", {
            from: "Dashboard",
            categoryName: groupType,
            product_type: groupType,
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
      <View>
        <Image
          onLoad={() => setImageLoaded(true)}
          resizeMode="stretch"
          style={styles.bannerImage}
          // source={require("../../assets/images/NowOrNever.png")}
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
      </View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollIndicatorInsets={{ top: 0, left: 0, bottom: 0, right: 0 }}
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
    // backgroundColor: "red",
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
    // backgroundColor: "red",
    flex: 1,
    height: 220,
    width: wp(37),
    // borderWidth: 1,
    borderColor: "#F2F5F6",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingVertical: 2,
    padding: 0,
    marginTop: 5,
    borderRadius: 5,
  },
  itemImageView: {
    height: "68%",
    width: "100%",
    // backgroundColor: "red",
  },
  itemImage: {
    height: "100%",
    width: "100%",
  },
  itemTextView: {
    height: "32%",
    width: "100%",
    paddingVertical: 2,
    // backgroundColor: "yellow",
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
