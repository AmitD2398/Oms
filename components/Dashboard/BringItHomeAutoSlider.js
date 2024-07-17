import { useFocusEffect } from "@react-navigation/native";
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
// import { SliderBox } from "react-native-image-slider-box";
// yarn add megamaxs1234/react-native-image-slider-box

let flatlistRef = React.createRef();

export default function BringItHomeAutoSlider({
  navigation,
  bannerData,
  listData,
  product_type,
  baseUrl,
  // renderItem,
  intervalTime,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // const [bannerDataImages, setBannerDataImages] = useState([]);
  // console.log("bannerData", bannerData);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageLoaded1, setImageLoaded1] = useState(false);

  // console.log("flatlistRefflatlistRef", flatlistRef._listRef?._cellRefs);

  let counterNo = 0;

  useFocusEffect(
    React.useCallback(() => {
      // let tempArray = [];
      // bannerData?.map((item, index) => {
      //   tempArray.push(baseUrl + item?.image);
      // });
      // setBannerDataImages(tempArray);
      /////////////////////////////////////////////
      let intervalId;
      // console.log("bannerDatabannerData==================>>>>", bannerData);
      intervalId =
        bannerData?.length != 0 &&
        setInterval(() => {
          flatlistRef.scrollToIndex({
            animated: counterNo == 0 ? true : true,
            index: counterNo,
            viewPosition: 0,
          });
          if (counterNo == bannerData?.length - 1) {
            //when index is last itemIndex or only 1 item present in banner(length=1)
            counterNo = 0;
            setCurrentIndex(bannerData?.length - 1);
          } else {
            counterNo += 1;
            setCurrentIndex(counterNo - 1);
          }
        }, intervalTime);

      return () => {
        clearInterval(intervalId);
      };
    }, [bannerData])
  );
  // console.log("currentIndex", currentIndex);

  const renderItemFlexWrap = ({ item, index }) => {
    // console.log("itemmmmm>>>", item);
    return (
      <Pressable
        key={item?.id + item?.pp_id}
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
            onLoad={() => setImageLoaded1(true)}
            resizeMode="contain"
            style={styles.itemImage}
            source={{ uri: baseUrl + item?.image_1 }}
            // source={item?.image}
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
  const DividerFlexWrap = () => {
    return <View style={{ width: 0 }} />;
  };

  const renderItem = ({ item, index }) => {
    return (
      <View key={item?.id?.toString()}>
        <View
          style={{
            // height: 175,
            height: 200,
            width: wp(100),
          }}
        >
          <ImageBackground
            onLoad={() => setImageLoaded(true)}
            resizeMode="stretch"
            style={styles.imageBackground}
            // source={item?.image}
            source={{ uri: baseUrl + item?.image }}
          >
            <View
              style={{
                height: "100%",
                width: wp(50),
                alignItems: "center",
                justifyContent: "flex-end",
                padding: 10,
              }}
            >
              {/* <Pressable
              style={{}}
              // onPress={() => navigation.navigate("ProductList")}
            >
              <Text
                style={{
                  textDecorationLine: "underline",
                  fontSize: 15,
                  fontFamily: "OpenSans-Regular",
                  color: "#DD1B47",
                }}
              >
                +Explore
              </Text>
             
            </Pressable> */}
              {/* <Image
                resizeMode="contain"
                style={styles.rightArrrowIcon}
                source={require('../../assets/images/rightArrow.png')}
              /> */}
            </View>
          </ImageBackground>

          {/* <View style={styles.pagingIndicatorLineView}>
            {bannerData?.map((item, ind) => {
              return (
                <View
                  key={item?.id?.toString()}
                  style={{
                    height: "100%",
                    backgroundColor: index == ind ? "#DD1B47" : "transparent",
                    width: wp(100) / bannerData?.length,
                  }}
                ></View>
              );
            })}
          </View> */}
        </View>
        {!imageLoaded && (
          <View
            style={[
              // styles.bannerImage,
              {
                height: 200,
                width: wp(100),
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
    );
  };

  const Divider = () => {
    return (
      <View
        style={
          {
            // height: 1,
            // width: '100%',
            // backgroundColor: 'black',
          }
        }
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View style={{ paddingHorizontal: 10 }}>
        <Text style={styles.headingText}>Bring it Home</Text>
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
            // ref={(ref) => (flatlistRef = ref)}
            renderItem={renderItemFlexWrap}
            ItemSeparatorComponent={DividerFlexWrap}
            keyExtractor={(item) => item?.id.toString()}
            pagingEnabled
            style={{ width: "100%" }}
            // onScrollToIndexFailed={(e) => console.log()}
          />
        </ScrollView>
      </View>

      <FlatList //flatlist for autoSlider
        horizontal
        showsHorizontalScrollIndicator={false}
        data={bannerData}
        ref={(ref) => (flatlistRef = ref)}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        keyExtractor={(item) => item?.id?.toString()}
        pagingEnabled
        style={{ marginTop: 10 }}
        // onScrollToIndexFailed={(e) => console.log()}
        onMomentumScrollEnd={(event) => {
          const index = Math.floor(
            Math.floor(event.nativeEvent.contentOffset.x) /
              Math.floor(event.nativeEvent.layoutMeasurement.width)
          );
          // setCurrentIndex(index);
          // work with: index
          setCurrentIndex(index);
        }}
      />
      <View
        style={{
          width: "100%",
          height: 15,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          // backgroundColor: "yellow",
          marginVertical: 4,
        }}
      >
        {bannerData?.map((item, index) => {
          //custom paging indicator
          return (
            <View
              key={item?.id + index}
              style={{
                height: 8,
                width: 8,
                borderRadius: 8 / 2,
                backgroundColor: index == currentIndex ? "#24AAE3" : "#D4D4D4",
                marginHorizontal: 2,
              }}
            ></View>
          );
        })}
      </View>

      {/* <SliderBox
        images={bannerDataImages}
        sliderBoxHeight={200}
        // onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
        dotColor="#DD1B47"
        inactiveDotColor="#D4D4D4"
        pagingEnabled={true}
        autoplay={true}
        autoplayInterval={2000}
        circleLoop={true}
        autoplayDelay={200}
        // contentContainerStyle={{ height: 200, backgroundColor: "red" }}
        // paginationBoxVerticalPadding={0}
        pagingIndicatorLineView={true}
        enableSnap={true}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
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
    marginBottom: 10,
  },
  rightArrrowIcon: {
    width: 15,
    height: 15,
    tintColor: "#0E1525",
  },

  //<<<<<<<<<<<<<renderItemFlexWrap style>>>>>>>>>>>>>>>
  renderItemView: {
    // backgroundColor: "red",
    height: 250,
    width: "48%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 0,
    borderRadius: 5,
    // borderWidth: 1,
    borderColor: "#F2F5F6",
    margin: "1%",
  },
  itemImageView: {
    // backgroundColor: "green",
    height: "70%",
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
    paddingTop: 3,
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

  //<<<<<<<<<<<<<renderItem style>>>>>>>>>>>>>>>
  imageBackground: {
    width: "100%",
    height: 197,
    // marginTop: 10,
    // position: 'absolute',
    // backgroundColor: '#0E1525',
    alignItems: "flex-end",
  },
  pagingIndicatorLineView: {
    // height: '1%',
    height: 3,
    backgroundColor: "#0E1525",
    // width: wp(100),
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    // justifyContent: 'space-around',
    marginBottom: 30,
  },
});
