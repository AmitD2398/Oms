//@ts-nocheck
import { StyleSheet, Text, View, Image, useEffect } from "react-native";
import React from "react";
import Modal from "react-native-modal";
// import { StatusBar } from "expo-status-bar";

export default function Loader({ loader = false, setLoader = false }) {
  // useEffect(() => {
  //     setLoader(loader)
  // }, [loader])

  return (
    <>
      <Modal
        // presentationStyle='overFullScreen'
        // coverScreen={true}
        isVisible={loader}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
        // coverScreen={true}
        // backdropColor={"red"}
        // backdropColor={"rgba(0,0,0,0.5)"}
        // backdropColor={"rgba(242, 245, 246, 0.5)"}
        // backdropColor={"white"}
        backdropColor="transparent"
        // onSwipeComplete={() => { setIsModal(!isModal); }}
        // swipeDirection='down'
        // onSwipeCancel={props?.setIsModal(false)}
        // onDismiss={() => { setIsModal(!isModal) }}
        // onBackButtonPress={() => setLoader(false)}
        style={{
          alignItems: "center",
          alignSelf: "center",
          marginLeft: 0,
          marginBottom: 0,
          marginTop: 0,
        }}
      >
        <Image
          style={{ width: 150, height: 150 }}
          source={require("../../assets/images/lpntLoader.gif")}
        />
        {/* <Text style={{
                    color: '#FFCC01',
                    fontSize: 15,
                    fontFamily: 'OpenSans-Regular',
                    textAlign: "center",
                }}>Loading..</Text> */}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({});
