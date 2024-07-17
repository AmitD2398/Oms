import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Pressable,
  Image,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useSelector, useDispatch } from "react-redux";
import NoRecordFoundComponent from "../../components/Common/NoRecordFoundComponent";

export default function SubCategory({ navigation, route: { params } }) {
  const { token } = useSelector((state) => state.tokenReducer);
  const { imageBaseUrl } = useSelector((state) => state.imageBaseUrlReducer);
  const { cartItemCount } = useSelector((state) => state.cartItemsCountReducer);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { categoryName, subcategoryData } = params;
  const renderItemFlexWrap = ({ item, index }) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate("ProductList", {
            categoryName: item?.name,
            categoryId: item?.pid,
            subCategoryId: item?.id,
          })
        }
        style={[styles.renderItemView]}
      >
        <View style={styles.itemImageView}>
          <Image
            onLoad={() => setImageLoaded(true)}
            resizeMode="stretch"
            style={styles.itemImage}
            source={{
              uri: imageBaseUrl + item?.image,
            }}
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
        </View>

        <View style={styles.itemTextViewStyle}>
          <Text numberOfLines={2} style={styles.itemText}>
            {item?.name}
          </Text>
        </View>
      </Pressable>
    );
  };
  const DividerFlexWrap = () => {
    return <View style={{ width: 0 }} />;
  };

  return (
    <ScreenWrapper style={styles.mainContainer}>
      <View style={styles.headerView}>
        <View style={styles.backbuttonAndTextView}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              source={require("../../assets/images/backArrow.png")}
              style={styles.backButton}
            />
          </Pressable>
          <View>
            <Text style={styles.headerText}>
              {categoryName == "Men"
                ? "Men's Fashion"
                : categoryName == "Women"
                ? "Women's Fashion"
                : categoryName}
            </Text>
            {/* <Text style={styles.headerSubText}>
              {subcategoryData?.length != 0
                ? subcategoryData?.length == 1
                  ? "1 item"
                  : subcategoryData?.length + " " + "Items"
                : 0 + " " + "item"}
            </Text> */}
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Pressable onPress={() => navigation.navigate("SearchProducts")}>
            <Image
              resizeMode="contain"
              style={styles.searchIcon}
              source={require("../../assets/images/searchIcon.png")}
            />
          </Pressable>
          <Pressable
            style={{ marginHorizontal: 7 }}
            onPress={() =>
              token ? navigation.navigate("WishList") : navigation.push("Login")
            }
          >
            <Image
              resizeMode="contain"
              style={styles.favouriteIcon}
              source={require("../../assets/images/favouriteIcon.png")}
            />
          </Pressable>
          <Pressable
            onPress={() =>
              token
                ? navigation.navigate("MyCart", { stackScreen: true })
                : navigation.push("Login")
            }
          >
            <Image
              resizeMode="contain"
              style={styles.bagIcon}
              source={require("../../assets/images/bagIconTab.png")}
            />
            {token && cartItemCount != 0 ? (
              <View style={styles.itemCountBadgeView}>
                <Text style={styles.itemBadgeCountText}>{cartItemCount}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>
      <View style={{ paddingHorizontal: 10 }}>
        {subcategoryData.length != 0 ? (
          <FlatList //flatlist for flexWrap elements list
            scrollEnabled={true}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={subcategoryData}
            renderItem={renderItemFlexWrap}
            ItemSeparatorComponent={DividerFlexWrap}
            keyExtractor={(item) => item?.id}
            contentContainerStyle={{
              paddingTop: 10,
              paddingBottom: 80,
            }}
          />
        ) : (
          <NoRecordFoundComponent />
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    // flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingVertical: 2,
    width: "100%",
  },
  backbuttonAndTextView: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
  },
  headerText: {
    fontSize: 18,
    fontFamily: "OpenSans-SemiBold",
    color: "161B2F",
  },
  headerSubText: {
    fontSize: 10,
    fontFamily: "OpenSans-Regular",
    color: "161B2F",
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#161B2F",
  },
  favouriteIcon: {
    width: 22,
    height: 22,
    tintColor: "#161B2F",
  },
  bagIcon: {
    width: 20,
    height: 20,
    tintColor: "#161B2F",
  },
  itemCountBadgeView: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "#E1385E",
    height: 14,
    width: 14,
    borderRadius: 14 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  itemBadgeCountText: {
    color: "#FFFFFF",
    fontSize: 9,
  },
  //<<<<<<<<<<<<<renderItemFlexWrap style>>>>>>>>>>>>>>>
  renderItemView: {
    height: 190,
    width: "47.5%",
    justifyContent: "center",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    // backgroundColor: "red",
    borderWidth: 1,
    borderColor: "#F2F5F6",
    marginLeft: "1.5%",
    marginTop: "1.5%",
    borderRadius: 4,
  },
  itemImageView: {
    height: "80%",
    // height: "100%",
    width: "100%",
    // backgroundColor: "red",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    borderRadius:4
    // backgroundColor: "red",
  },
  itemTextViewStyle: {
    alignItems: "center",
    justifyContent: "center",
    height: "20%",
    width: "75%",
  },
  itemText: {
    color: "#161B2F",
    fontSize: 14,
    fontFamily: "OpenSans-Regular",
  },
});
