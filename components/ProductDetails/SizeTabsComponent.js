import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default function SizeTabsComponent({
  TabsData,
  onPressSizeTab,
  setFinalSelectedSize,
  setAddToCartState,
}) {
  const Data = TabsData;
  const [activeTab, setActiveTab] = useState(null);
  var flatlistRef = React.createRef();

  useEffect(() => {
    // on selection of different size clear selectedColor ,activeTab, availQnty states
    setActiveTab(null);
    setFinalSelectedSize("");
  }, [TabsData]);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     // on selection of different size clear selectedColor ,activeTab, availQnty states
  //     setActiveTab(null);
  //     setFinalSelectedSize("");
  //   }, [TabsData])
  // );

  const onTabPressScrollIndex = (toIndex) => {
    flatlistRef.scrollToIndex({
      animated: true,
      index: toIndex,
      viewPosition: 0,
    });
  };

  const renderItem = ({ item, index }) => {
    return (
      <Pressable
        onPress={() => {
          onPressSizeTab(item);
          setFinalSelectedSize(item?.size);
          setActiveTab(index);
          onTabPressScrollIndex(index);
          setAddToCartState(false);
        }}
        style={[
          styles.itemStyle,
          {
            backgroundColor: activeTab == index ? "#171B6B" : "#FFFFFF",
            flexDirection: "row",
            justifyContent: "space-between",
          },
        ]}
      >
        <Text
          style={[
            styles.textStyle,
            {
              color: activeTab == index ? "#FFFFFF" : "#646464",
            },
          ]}
        >
          {item?.size}
        </Text>
        {/* {activeTab == index ? (
            <View style={styles.underlineHighlight}></View>
          ) : null} */}
      </Pressable>
    );
  };
  const ItemSeparatorComponent = () => {
    return <View style={{ width: 10 }}></View>;
  };
  return (
    <View style={[{ paddingHorizontal: 0 }]}>
      {Data?.length == 0 ? (
        <Text style={{ color: "#DD1B47", fontSize: 11 }}>Free Size</Text>
      ) : (
        <FlatList
          showsHorizontalScrollIndicator={false}
          horizontal
          data={Data}
          ref={(ref) => (flatlistRef = ref)}
          renderItem={renderItem}
          ItemSeparatorComponent={ItemSeparatorComponent}
          // style={{ marginVertical: 5 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  itemStyle: {
    height: 25,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: 'red',
    borderWidth: 0.5,
    borderColor: "rgba(112, 112, 112,0.39)",
    paddingHorizontal: 10,
  },
  textStyle: {
    fontSize: 12,
    fontFamily: "OpenSans-Medium",
  },
  underlineHighlight: {
    backgroundColor: "#DD1B47",
    height: 2,
    width: 35,
    alignSelf: "flex-start",
    //   marginVertical: 2,
  },
});
