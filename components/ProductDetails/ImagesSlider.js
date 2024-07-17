import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ImageBackground,
  Image,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function ImagesSlider({ data, imageBaseUrl }) {
  let ListData = data;
  // console.log("data>>>", data);
  const [imageLoaded, setImageLoaded] = useState(false);

  const renderItem = ({ item, index }) => {
    // console.log("imageLoaded", imageLoaded);
    return (
      <>
        <View style={{ height: hp(60) + 4 }}>
          <ImageBackground
            onLoad={() => setImageLoaded(true)}
            resizeMode="cover"
            // imageStyle={styles.imageBackground}
            style={styles.imageBackground}
            source={{ uri: imageBaseUrl + item }}
            // source={require("../../assets/images/detail.png")}
          ></ImageBackground>

          <View style={styles.pagingIndicatorLineView}>
            {ListData?.map((item, ind) => {
              return (
                <View
                  key={index + item + index}
                  style={{
                    height: 4,
                    backgroundColor: index == ind ? "#24AAE3" : "transparent",
                    width: wp(100) / ListData?.length,
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
      </>
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
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={ListData}
        // scrollToIndex={counter}
        renderItem={renderItem}
        ItemSeparatorComponent={Divider}
        keyExtractor={(item, index) => item + index}
        pagingEnabled
        style={{ width: wp(100) }}
        // onScrollToIndexFailed={(e) => console.log()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    // flex: 1,
    // backgroundColor: 'red',
  },
  imageBackground: {
    height: hp(60),
    width: wp(100),
    // marginTop: 10,
    // position: 'absolute',
    backgroundColor: "#0E1525",
    alignItems: "flex-end",
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
