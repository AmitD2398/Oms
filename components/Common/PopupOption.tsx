//@ts-nocheck
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FontAwesome } from '@expo/vector-icons';


export default function PopupOption({ onCameraClick = () => { }, onGalleryClick = () => { },
    title = 'CHOOSE OPTION', onCancelClick = () => { }, }) {

    return (
        <View style={[styles.wrapper]}>
            <View style={[styles.cardBox]}>
                <View style={styles.boxContent}>
                    <Text style={styles.title}>{title}</Text>

                    <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center", width: '100%' }}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => onCameraClick()} style={styles.button}>
                            { //@ts-ignore
                                <FontAwesome name="camera" size={34} color="#CB3535" />}
                            <Text style={styles.buttonText}>{'Camera'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => onGalleryClick()} style={styles.button}>
                            { //@ts-ignore
                                <FontAwesome name="picture-o" size={34} color="#CB3535" />}
                            <Text style={styles.buttonText}>{'Gallery'}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', width: '100%' }}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => onCancelClick()} style={{ width: "100%", alignItems: "center" }}>
                            <Text style={[styles.buttonText, { fontSize: 14, color: "gray", }]}>{'CANCEL'}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        // backgroundColor: 'rgba(1, 5, 30, .9)',
        // backgroundColor: "#5E4EA782",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        top: 0, bottom: 0, left: 0, right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        padding: wp(10),
        // zIndex: 999
    },
    cardBox: {
        minHeight: 100,
        width: wp(80),
        borderWidth: 1,
        // borderColor: '#171b55',
        borderColor: '#DDE3F1',
        // backgroundColor: '#113F6D',
        backgroundColor: 'white',
        shadowColor: '#75716b',
        shadowOffset: { width: -0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 1,
        // borderRadius: 15
    },
    boxContent: {
        padding: 15,
        justifyContent: 'center',
        alignItems: 'flex-start',
        // marginTop: 20
    },
    title: {
        fontFamily: "OpenSans-Regular",
        color: 'black',
        fontSize: 14,
        textAlign: 'left',
        // marginBottom: 10
    },
    button: {
        padding: 8,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 15,
        marginBottom: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        // width: wp(30),
        // height: wp(20)
    },
    buttonText: {
        color: 'black',
        fontFamily: 'OpenSans-Regular',
        fontSize: 15,
        paddingTop: 7
    }


})