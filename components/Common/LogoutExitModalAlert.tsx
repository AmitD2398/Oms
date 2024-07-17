//@ts-nocheck
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Modal from "react-native-modal";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function LogoutExitModalAlert({ fromScreen = "", isModal, setIsModal, onPressHandler }) {

    return (
        <View style={{ zIndex: 999, backgroundColor: "white" }}>
            <Modal
                isVisible={isModal}
                // onSwipeComplete={() => { setIsModal(!isModal); }}
                // swipeDirection='down'
                // onSwipeCancel={props?.setIsModal(false)}
                // onDismiss={() => { setIsModal(!isModal) }}
                onBackdropPress={() => setIsModal(false)}
                onBackButtonPress={() => setIsModal(false)}
                style={{
                    // backgroundColor: "#5E4EA782",
                    backgroundColor: "transparent",
                    width: '100%', alignItems: 'center', alignSelf: "center"
                }}
            >
                <View style={[styles.modelWraper]}>
                    {fromScreen == "Dashboard" ?
                        <Image resizeMode='contain' source={require("../../assets/images/logoutAlertIcon.png")} style={{ width: 70, height: 70, tintColor: "#DD1B47" }} />
                        :
                        <Image resizeMode='contain' source={require("../../assets/images/logoutPopupIcon.png")} style={{ width: 60, height: 60, tintColor: "#DD1B47" }} />
                    }


                    {/* <View style={{ alignItems: "center", marginBottom: 7 }}> */}
                    <Text style={{ color: "#090129", fontSize: 22, fontFamily: "OpenSans-Medium", }}>
                        {fromScreen == "Dashboard" ?
                            "Come back soon" :
                            "Confirm Logout"}
                    </Text>
                    <Text style={{ color: "#ABABAB", fontSize: 16, fontFamily: "OpenSans-Regular", marginBottom: 10 }}>
                        {fromScreen == "Dashboard" ?
                            "Are you sure you want to Exit?" :
                            "Are you sure you want to logout?"}
                    </Text>
                    {/* </View> */}
                    <View style={{ width: "100%", height: 45, flexDirection: "row", justifyContent: 'space-between', marginTop: 5 }}>
                        <TouchableOpacity
                            onPress={() => {
                                setIsModal(false)
                            }}
                            activeOpacity={0.8}
                            style={{ borderRadius: 10, width: "48%", height: "100%", justifyContent: 'center', borderWidth: 0.6, borderColor: "#707070" }}>
                            <Text style={{ alignSelf: "center", fontSize: 15, fontFamily: 'OpenSans-Regular', color: "#ABABAB" }}>
                                {fromScreen == "Dashboard" ? "Later" : "Cancel"}

                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                onPressHandler()
                                setIsModal(false)
                            }}
                            activeOpacity={0.8}
                            style={{ backgroundColor: "#1A97CC", borderRadius: 10, width: "48%", height: "100%", justifyContent: "center" }}>
                            <Text style={{ alignSelf: "center", fontSize: 15, fontFamily: 'OpenSans-Regular', color: "#FFFFFF" }}>
                                {fromScreen == "Dashboard" ? "Exit" : "Logout"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </Modal>
        </View >
    )
}
const styles = StyleSheet.create({
    modelWraper: {
        height: hp(35),
        // marginTop: hp(50),
        backgroundColor: "white", ///
        width: wp(95),
        alignSelf: 'center',
        alignItems: "center",
        padding: 25,
        borderRadius: 30,
        justifyContent: 'space-between'
    },

})