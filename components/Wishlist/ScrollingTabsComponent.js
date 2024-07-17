import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useState } from "react";

export default function ScrollingTabsComponent({
  TabsData,
  customItemViewStyle,
  customItemTextStyle,
  customComponentViewStyle,
  color,
}) {
  const Data = TabsData;
  const [activeTab, setActiveTab] = useState(null);
  var flatlistRef = React.createRef();

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
          setActiveTab(index);
          onTabPressScrollIndex(index);
        }}
        style={[
          styles.itemStyle,
          {
            backgroundColor: activeTab == index ? "#161B2F" : "#FFFFFF",
            flexDirection: "row",
            justifyContent: "space-between",
          },
          customItemViewStyle,
        ]}
      >
        {color ? (
          <View
            style={{
              backgroundColor: "red",
              width: 7,
              height: 7,
              borderRadius: 7 / 2,
              marginHorizontal: 2,
            }}
          ></View>
        ) : null}
        <Text
          style={[
            styles.textStyle,
            {
              color: activeTab == index ? "#FFFFFF" : "#646464",
            },
            customItemTextStyle,
          ]}
        >
          {item?.id}
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
    <View
      style={[{ height: 50, paddingHorizontal: 10 }, customComponentViewStyle]}
    >
      <FlatList
        showsHorizontalScrollIndicator={true}
        horizontal
        data={Data}
        ref={(ref) => (flatlistRef = ref)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        // style={{}}
        // contentContainerStyle={{}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemStyle: {
    marginVertical: 5,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: 'red',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: "rgba(112, 112, 112,0.39)",
    paddingHorizontal: 5,
  },
  textStyle: {
    fontSize: 15,
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
