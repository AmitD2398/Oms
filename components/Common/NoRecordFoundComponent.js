import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

export default function NoRecordFoundComponent({ contentText }) {
  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        // backgroundColor: "red",
        alignSelf: "center",
        marginTop: "10%",
        // height: 200,
      }}
    >
      <Image
        resizeMode="contain"
        style={{ height: 120, width: 120 }}
        source={require("../../assets/images/noDataFound.png")}
      />
      <Text
        style={{
          fontSize: 16,
          fontFamily: "OpenSans-Medium",
          color: "#161B2F",
          top: 10,
          textAlign: "center",
        }}
      >
        {contentText ? contentText : "Sorry ! No Items Found"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
