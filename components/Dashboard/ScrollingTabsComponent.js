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
  setGroupProducts,
  setGroupType,
}) {
  const Data = TabsData;
  // console.log("DataData", Data);
  const [activeTab, setActiveTab] = useState(0);
  var flatlistRef = React.createRef();

  const onTabPressScrollIndex = (toIndex) => {
    flatlistRef.scrollToIndex({
      animated: true,
      index: toIndex,
      viewPosition: 0,
    });
  };

  const renderItem = ({ item, index }) => {
    // console.log("itemTaabs", item);
    return (
      <Pressable
        onPress={() => {
          setActiveTab(index);
          onTabPressScrollIndex(index);
          setGroupProducts(item?.product_details);
          setGroupType(item?.name);
        }}
        style={styles.itemStyle}
      >
        <Text
          style={[
            styles.textStyle,
            {
              color: activeTab == index ? "#161B2F" : "#9F9F9F",
            },
          ]}
        >
          {/* {item?.tabName} */}
          {item?.name}
        </Text>
        {activeTab == index ? (
          <View style={styles.underlineHighlight}></View>
        ) : null}
      </Pressable>
    );
  };
  const ItemSeparatorComponent = () => {
    return <View style={{ width: 10 }}></View>;
  };
  return (
    <View style={{ height: 50 }}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={Data}
        ref={(ref) => (flatlistRef = ref)}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparatorComponent}
        style={{ marginVertical: 5 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemStyle: {
    marginTop: 10,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    //   backgroundColor: 'red',
  },
  textStyle: {
    fontSize: 16,
    fontFamily: "OpenSans-Medium",
  },
  underlineHighlight: {
    backgroundColor: "#24AAE3",
    height: 2,
    width: 35,
    alignSelf: "flex-start",
    //   marginVertical: 2,
  },
});
