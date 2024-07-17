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

export default function ColorTabsComponent({
  TabsData,
  setFinalSelectedColor,
  setAvlQtyInSelectedSizeColorCombination,
  setAddToCartState,
  finalSelectedSize
}) {
  const Data = TabsData;
  const [activeTab, setActiveTab] = useState(null);
  var flatlistRef = React.createRef();

  useEffect(() => {
    console.log(finalSelectedSize)
    // console.log(TabsData)
    // on selection of different size clear selectedColor ,activeTab, availQnty states
    setActiveTab(null);
    setFinalSelectedColor("");
    setAvlQtyInSelectedSizeColorCombination(0);
  }, [TabsData,finalSelectedSize]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setActiveTab(null);
  //     setFinalSelectedColor("");
  //     setAvlQtyInSelectedSizeColorCombination(0);
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
    console.log(index)
    // if (item.color === "None") {
    //   // Don't render the item when the color is 'None'
    //   return null;
    // }
    //item>>>>> {color: 'DarkSlateBlue', code: '#483D8B', qty: '10'}
    return (
      <Pressable
        onPress={() => {
          setActiveTab(index);
          setFinalSelectedColor(item?.color);
          setAvlQtyInSelectedSizeColorCombination(Number(item?.qty)); //Number will set 0 if ""," " is present in item?.qty
          onTabPressScrollIndex(index);
          setAddToCartState(false);
        }}
        style={[
          Data[0]?.color !== 'None' && styles.itemStyle,
          {
            backgroundColor: activeTab == index ? "#171B6B" : "#FFFFFF",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <View
          style={{
            backgroundColor: item?.code ? item?.code : "transparent",
            width: 10,
            height: 10,
            borderRadius: 10 / 2,
            marginRight: 5,
          }}
        ></View>
        {Data[0]?.color !== 'None' &&<Text
          style={[
            styles.textStyle,
            {
              color: activeTab == index ? "#FFFFFF" : "#646464",
            },
          ]}
        >
          {item?.color.toUpperCase()}
        </Text>}
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
      {/* {Data?.length == 0 ? (
        <Text style={{ color: "red", fontSize: 11 }}>No Colors Available</Text>
      ) : ( */}
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={Data}
        ref={(ref) => (flatlistRef = ref)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        // style={{ marginVertical: 5 }}
      />
      {/* )} */}
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
