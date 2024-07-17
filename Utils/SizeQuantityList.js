import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  Platform,
  FlatList,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function SelectorModal(props) {
  const [dataList, setDataList] = useState(props?.dataList);

  useEffect(() => {
    setDataList(props?.dataList);
    props?.setIsModal(props?.isModal);
    // setCountryListOrignal(props.dataList.data)
    // setBase_url(props.dataList.base_url)
  }, [props]);

  return (
    <View style={{}}>
      <Modal
        isVisible={props?.isModal}
        // onSwipeComplete={() => { setIsModal(!isModal); }}
        // swipeDirection='down'
        // onSwipeCancel={props?.setIsModal(false)}
        // onDismiss={() => { setIsModal(!isModal) }}
        onBackdropPress={() => props?.setIsModal(false)}
        onBackButtonPress={() => props?.setIsModal(false)}
        style={{
          backgroundColor: "transparent",
          width: "100%",
          marginLeft: 0,
          marginBottom: 0,
          marginTop: 0,
        }}
      >
        <View style={[styles.modelWraper, props?.modelWraperCustomStyle]}>
          {/* <Text style={[global.white, global.medium, global.h3, global.center]}> */}
          <Text
            style={{
              alignSelf: "center",
              fontSize: 15,
              color: "#090129",
              //   fontFamily: "roboto-regular",
            }}
          >
            {props?.modalName}
          </Text>
          <View
            style={{
              // flex: 1,
              marginTop: 10,
              paddingTop: 1,
              borderTopWidth: 0.5,
              borderColor: "white",
            }}
          >
            <View style={{}}></View>
            <FlatList
              showsVerticalScrollIndicator={true}
              style={{
                width: "100%",
                marginTop: 0,
                marginBottom: 0,
                borderWidth: 0,
              }}
              data={dataList}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  key={item?.toString()}
                  style={styles.flatRow}
                  onPress={() => {
                    props?.onChangeValue(item);
                    props?.setIsModal(false);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <View
                      style={{ borderRightWidth: 1, borderColor: "#333" }}
                    ></View>
                    <Text style={[styles.textStyle]}>{item}</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => item?.toString()}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  flatRow: {
    borderBottomWidth: 0.3,
    marginBottom: 5,
    borderColor: "#99999920",
    width: "100%",
    padding: 8,
    display: "flex",
    alignItems: "center",
  },
  modelWraper: {
    marginTop: hp(100) - 500,
    // height: hp(35),
    maxHeight: hp(40),
    width: wp(50),
    backgroundColor: "white", ///
    alignSelf: "center",
    padding: 25,
    paddingTop: 15,
    borderRadius: 15,
  },
  textStyle: {
    // marginLeft: 15,
    color: "#090129",
    fontSize: Platform.OS == "ios" ? 15 : 13,
    // fontFamily: "roboto-medium",
  },
});
