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
import { useFocusEffect } from "@react-navigation/native";

// const CheckOutSliderData = [
//   // {
//   //   id: 1,
//   //   image: require('../../assets/images/loginImage.png'),
//   // },
//   {
//     id: 2,
//     image: require("../../assets/images/checkItOut.png"),
//   },
//   {
//     id: 3,
//     image: require("../../assets/images/checkItOut.png"),
//   },
//   {
//     id: 4,
//     image: require("../../assets/images/checkItOut.png"),
//   },
//   {
//     id: 5,
//     image: require("../../assets/images/checkItOut.png"),
//   },
//   {
//     id: 6,
//     image: require("../../assets/images/checkItOut.png"),
//   },
// ];
let flatlistRef = React.createRef();

export default function CheckOutScrollComponent({
  bannerData,
  baseUrl,
  // renderItem,
  intervalTime,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);

  let CheckOutSliderData = bannerData;

  let counterNo = 0;

  // useFocusEffect(
  //   React.useCallback(() => {
  //     return () => {
  //       clearInterval(intervalId);
  //       // console.log("clearInterval(intervalId)");
  //     };
  //   }, [])
  // );

  // let intervalId =
  //   bannerData?.length != 0 &&
  //   setInterval(() => {
  //     flatlistRef.scrollToIndex({
  //       animated: counterNo == 0 ? true : true,
  //       // animated: true,
  //       index: counterNo,
  //       viewPosition: 0,
  //     });
  //     if (counterNo == bannerData?.length - 1) {
  //       //when index is last itemIndex
  //       counterNo = 0;
  //     } else {
  //       counterNo += 1;
  //     }
  //   }, intervalTime);

  useFocusEffect(
    React.useCallback(() => {
      let intervalId =
        bannerData?.length != 0 &&
        setInterval(() => {
          flatlistRef.scrollToIndex({
            animated: counterNo == 0 ? false : true,
            // animated: true,
            index: counterNo,
            viewPosition: 0,
          });
          if (counterNo == bannerData?.length - 1) {
            //when index is last itemIndex
            counterNo = 0;
          } else {
            counterNo += 1;
          }
        }, intervalTime);
      return () => {
        clearInterval(intervalId);
        counterNo = 0;
      };
    }, [bannerData])
  );

  const renderItemm = ({ item, index }) => {
    // console.log("baseUrl + item.image", item);
    return (
      <View key={item?.id} style={{}}>
        <View>
          <ImageBackground
            onLoad={() => setImageLoaded(true)}
            resizeMode="stretch"
            style={styles.imageBackground}
            // source={{ uri: baseUrl + item?.image }}
            source={{
              uri: baseUrl + item.image,
            }}
          >
            {/* <View style={styles.shopNowButtonView}>
            <Pressable style={styles.shopNowButton}>
              <Text style={styles.shopNowText}>Shop now</Text>
              <Image
                resizeMode="contain"
                style={styles.rightArrrowIcon}
                source={require("../../assets/images/rightArrow.png")}
              />
            </Pressable>
          </View> */}
          </ImageBackground>
          <View style={styles.pagingIndicatorLineView}>
            {bannerData?.map((item, ind) => {
              return (
                <View
                  key={item?.id?.toString()}
                  style={{
                    height: 4,
                    backgroundColor: index == ind ? "#24AAE3" : "transparent",
                    width: wp(100) / bannerData?.length,
                  }}
                ></View>
              );
            })}
          </View>
        </View>
        {!imageLoaded && (
          <View
            style={[
              styles.imageBackground,
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
    );
  };
  const Dividerr = ({ item, index }) => {
    return (
      <View
        key={item?.id}
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
      <FlatList
        // getItemLayout={(data, index) => ({
        //   length: SliderData,
        //   offset: SliderData * index,
        //   index,
        // })}
        showsHorizontalScrollIndicator={false}
        horizontal
        data={bannerData}
        ref={(ref) => (flatlistRef = ref)}
        // scrollToIndex={counter}
        renderItem={renderItemm}
        ItemSeparatorComponent={Dividerr}
        keyExtractor={(item, index) => item?.id}
        pagingEnabled
        style={{ width: wp(100) }}
        // onScrollToIndexFailed={(e) => console.log()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  imageBackground: {
    width: wp(100),
    height: wp(100),
    // marginTop: 10,
    // position: 'absolute',
    backgroundColor: "#0E1525",
    // backgroundColor: "rgba(14, 21, 37, 0.6)",
    alignItems: "flex-end",
  },
  shopNowButtonView: {
    width: wp(40),
    height: wp(95),
    flexDirection: "row",
    alignItems: "flex-end",
    //   backgroundColor: 'yellow',
  },
  shopNowButton: {
    backgroundColor: "#0E1525",
    height: 35,
    width: "90%",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  shopNowText: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  rightArrrowIcon: {
    width: 18,
    height: 15,
  },
  pagingIndicatorLineView: {
    height: 4,
    backgroundColor: "#0E1525",
    width: wp(100),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
