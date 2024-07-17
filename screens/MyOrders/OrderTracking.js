//@ts-nocheck
import React, { useRef } from 'react'
import {
  View,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

// import BottomSheet from '@gorhom/bottom-sheet'
// import * as RootNavigationRef from '../../navigation/RootNavigationRef'
// import { useSelector } from 'react-redux'
// import { showToastWithGravity } from '../../components/SnackBar'

const { width, height } = Dimensions.get('window')

export default function OrderTracking({ bSheetRef }) {
  // const bottomSheetRef = useRef < BottomSheet > null
  return (
    // <View>
    <RBSheet
      ref={bSheetRef}
      // height={280}
      height={300}
      openDuration={350}
      // onClose={() => navigation.jumpTo("Transactions")}
      dragFromTopOnly={true} // whwn true stops dragdown feature
      closeOnDragDown={true}
      customStyles={{
        wrapper: {
          // backgroundColor: 'rgba(2, 1, 28, 0.7)',
          // backgroundColor: "#5E4EA782",
        },
        container: {
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          // justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          overflow: 'hidden',
          paddingHorizontal: 10,
          paddingBottom: 20,
        },
        draggableIcon: {
          //works with closeOnDragDown={true}
          backgroundColor: '#0000001A',
          height: 3,
          width: '40%',
        },
      }}
    >
      {/* <GestureHandlerRootView style={{ flex: 1 }}> */}
      <ScrollView
        style={{ width: '100%' }}
        contentContainerStyle={{ backgroundColor: 'white' }}
      >
        <View
          style={{
            marginTop: 5,
            height: 50,
            width: '100%',
            backgroundColor: '#F2F5F6',
            borderRadius: 7,
            justifyContent: 'center',
            padding: 10,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: '#161B2F',
              FontFace: 'OpenSans-Medium',
            }}
          >
            Track Item
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: '#646464',
              FontFace: 'OpenSans-Regular',
            }}
          >
            Tracking No : JAGS7868757587
          </Text>
        </View>

        <View style={styles.orderStatusView}>
          <View style={styles.progressImagesView}>
            <View style={styles.progressImagesWrapper}>
              {true ? ( //Ordered>>>>>>>>>
                <Image
                  resizeMode="contain"
                  style={{ height: 20, width: 20 }}
                  source={require('../../assets/images/greenCheck.png')}
                />
              ) : (
                <Image
                  resizeMode="contain"
                  style={{ height: 20, width: 20 }}
                  source={require('../../assets/images/circleImage.png')}
                />
              )}
              {true ? (
                <Image
                  resizeMode="contain"
                  style={{ height: 25, width: 25, marginVertical: 2 }}
                  source={require('../../assets/images/progressActive.png')}
                />
              ) : (
                <Image
                  resizeMode="contain"
                  style={{ height: 25, width: 25, marginVertical: 2 }}
                  source={require('../../assets/images/progressPassive.png')}
                />
              )}

              {true ? ( //Shipped>>>>>>>>>>>>
                <Image
                  resizeMode="contain"
                  style={{ height: 20, width: 20 }}
                  source={require('../../assets/images/greenCheck.png')}
                />
              ) : (
                <Image
                  resizeMode="contain"
                  style={{ height: 20, width: 20 }}
                  source={require('../../assets/images/circleImage.png')}
                />
              )}
              {true ? (
                <Image
                  resizeMode="contain"
                  style={{ height: 25, width: 25, marginVertical: 2 }}
                  source={require('../../assets/images/progressActive.png')}
                />
              ) : (
                <Image
                  resizeMode="contain"
                  style={{ height: 25, width: 25, marginVertical: 2 }}
                  source={require('../../assets/images/progressPassive.png')}
                />
              )}
              {true ? ( //OutForDelivery>>>>>>>>
                <Image
                  resizeMode="contain"
                  style={{ height: 20, width: 20 }}
                  source={require('../../assets/images/greenCheck.png')}
                />
              ) : (
                <Image
                  resizeMode="contain"
                  style={{ height: 20, width: 20 }}
                  source={require('../../assets/images/circleImage.png')}
                />
              )}
              {false ? (
                <Image
                  resizeMode="contain"
                  style={{ height: 25, width: 25, marginVertical: 2 }}
                  source={require('../../assets/images/progressActive.png')}
                />
              ) : (
                <Image
                  resizeMode="contain"
                  style={{ height: 25, width: 25, marginVertical: 2 }}
                  source={require('../../assets/images/progressPassive.png')}
                />
              )}
              {false ? ( //OutForDelivery>>>>>>>>
                <Image
                  resizeMode="contain"
                  style={{ height: 20, width: 20 }}
                  source={require('../../assets/images/greenCheck.png')}
                />
              ) : (
                <Image
                  resizeMode="contain"
                  style={{ height: 20, width: 20 }}
                  source={require('../../assets/images/circleImage.png')}
                />
              )}
            </View>
          </View>
          <View style={styles.orderStatusTextView}>
            <Text numberOfLines={1} style={styles.statusText}>
              Ordered Sunday, 10 Jul
            </Text>
            <View style={[styles.horizontalLine, {}]}></View>
            <View style={{}}>
              <Text numberOfLines={1} style={styles.statusText}>
                Monday, 11 Jul
              </Text>
              <Text numberOfLines={2} style={styles.statusSubText}>
                Item shipped to nearest delivery center
              </Text>
            </View>
            <View style={[styles.horizontalLine, {}]}></View>
            <Text numberOfLines={1} style={styles.statusText}>
              Shipped on 12 Jul
            </Text>
            <View style={[styles.horizontalLine, {}]}></View>
            <Text numberOfLines={1} style={styles.statusText}>
              Arriving Today, 18 Jul
            </Text>
          </View>
        </View>
      </ScrollView>
      {/* </GestureHandlerRootView> */}
    </RBSheet>
    // </View>
  )
}
const styles = StyleSheet.create({
  horizontalLine: {
    alignSelf: 'center',
    backgroundColor: 'rgba(22, 27, 47, 0.15)',
    height: 1,
    width: '100%',
    marginVertical: 10,
    // marginBottom: 50,
  },
  orderStatusView: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    paddingVertical: 5,
    marginVertical: 5,
    marginTop: 15,
    // height: 130,
  },
  progressImagesView: {
    width: '10%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    //   backgroundColor: 'pink',
  },
  progressImagesWrapper: {
    alignItems: 'center',
  },
  orderStatusTextView: {
    width: '90%',
    //   backgroundColor: 'yellow',
    justifyContent: 'space-between',
  },
  statusText: {
    color: '#646464',
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
  },
  shippedStatusView: {
    flexDirection: 'row',
    //   backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightArrowIcon: {
    height: 15,
    width: 15,
    tintColor: '#161B2F',
  },
  statusSubText: {
    color: 'rgba(100, 100, 100, 0.7)',
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
  },
  trackButtonView: {
    backgroundColor: '#DD1B47',
    height: 35,
    width: '100%',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'OpenSans-Medium',
  },
  //////////
  deliveryAddressView: {
    marginVertical: 15,
    borderWidth: 1,
    borderColor: 'rgba(22, 27, 47, 0.2)',
    borderRadius: 5,
  },
  deliveryAddressHeading: {
    color: '#161B2F',
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
    margin: 10,
  },
  nameAndMobileView: {
    flexDirection: 'row',
    alignItems: 'center',
    //   backgroundColor: 'green',
    width: '85%',
  },
  nameText: {
    color: '#161B2F',
    fontSize: 14,
    fontFamily: 'OpenSans-SemiBold',
  },
  verticalLine: {
    height: 18,
    width: 1,
    backgroundColor: 'rgba(22, 27, 47, 0.2)',
    marginHorizontal: 10,
  },
  addressTextView: {
    width: '85%',
    marginTop: 4,
  },
  addressText: {
    color: '#646464',
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
  },
})

// import React, { useCallback, useMemo, useRef } from 'react'
// import { View, Text, StyleSheet, Button } from 'react-native'
// import Bottomsheet, {
//   BottomSheetView,
//   BottomSheetModal,
//   BottomSheetModalProvider,
//   BottomSheetDraggableView,
//   BottomSheetScrollView,
//   BottomSheetBackdrop,
// } from '@gorhom/bottom-sheet'
// import { GestureHandlerRootView } from 'react-native-gesture-handler'

// const OrderTracking = () => {
//   // ref
//   // const bottomSheetModalRef = useRef < BottomSheetModal > null
//   const bottomSheetModalRef = useRef(null)

//   // variables
//   const snapPoints = useMemo(() => ['25%', '55%'], [])
//   // const snapPoints = useMemo(() => [500, 100, 150, 300, 500], [])

//   // callbacks
//   const handlePresentModalPress = useCallback(() => {
//     console.log('ywgyudxq', bottomSheetModalRef.current)
//     bottomSheetModalRef.current?.present()
//     // bottomSheetModalRef.current?.snapToIndex(1)
//   }, [])
//   // const backDropPress = useCallback(() => {
//   //   // bottomSheetModalRef.current?.present()
//   //   console.log('ywgyudxq', bottomSheetModalRef.current)
//   // }, [])
//   const handleSheetChanges = useCallback((index) => {
//     console.log('handleSheetChanges', index)
//   }, [])

//   const handleOnLayout = useCallback(
//     ({
//       nativeEvent: {
//         layout: { height },
//       },
//     }) => {
//       // console.log('SCREEN \t\t', 'handleOnLayout', height);
//       setContentHeight(height)
//     },
//     [],
//   )
//   // renders
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <BottomSheetModalProvider>
//         <View style={styles.container}>
//           <Button
//             onPress={handlePresentModalPress}
//             title="Present Modal"
//             color="black"
//           />
//           <BottomSheetModal
//             // enablePanDownToClose={true}
//             ref={bottomSheetModalRef}
//             index={1}
//             snapPoints={snapPoints}
//             onChange={handleSheetChanges}
//             // enableOverDrag={true}
//             // handleHeight={100}
//             // detached={true}
//             containerStyle={{ backgroundColor: 'green' }}
//             // handleHeight={100}

//             // onPress={backDropPress}
//           >
//             {/* <BottomSheetDraggableView
//             backgroundColor={'red'}
//             height={'100%'}
//             // onTouchStart={() => bottomSheetModalRef.current.snapToIndex(0)}
//             // onTouchMove={() => bottomSheetModalRef.current.snapToIndex(0)}
//             // onMagicTap={() => bottomSheetModalRef.current.snapToIndex(0)}
//           > */}
//             {/* <BottomSheetScrollView
//               contentContainerStyle={styles.contentContainerScroll}
//               scrollEnabled={true}
//               showsVerticalScrollIndicator={true}
//             > */}
//             <BottomSheetView layout={handleOnLayout}>
//               <View style={styles.contentContainer}>
//                 <Text onPress={() => bottomSheetModalRef.current?.collapse()}>
//                   Awesome 🎉
//                 </Text>
//               </View>
//             </BottomSheetView>

//             {/* </BottomSheetScrollView> */}
//             {/* </BottomSheetDraggableView> */}
//           </BottomSheetModal>
//         </View>
//       </BottomSheetModalProvider>
//     </GestureHandlerRootView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 24,
//     justifyContent: 'center',
//     backgroundColor: 'grey',
//   },
//   contentContainer: {
//     // flex: 1,
//     alignItems: 'center',
//     height: 100,
//     backgroundColor: 'red',
//     margin: 20,
//   },
//   contentContainerScroll: {
//     // flex: 1,
//     // alignItems: 'center',
//     // height: ,
//     backgroundColor: 'pink',
//     // height: 100,
//   },
// })

// export default OrderTracking

// import React, { useCallback, useRef, useMemo } from 'react'
// import { StyleSheet, View, Text, Button } from 'react-native'
// import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'

// const App = () => {
//   // hooks
//   // const sheetRef = useRef < BottomSheet > null
//   const sheetRef = React.createRef(null)

//   // variables
//   const data = useMemo(
//     () =>
//       Array(50)
//         .fill(0)
//         .map((_, index) => `index-${index}`),
//     [],
//   )
//   const snapPoints = useMemo(() => ['25%', '50%', '90%'], [])

//   // callbacks
//   const handleSheetChange = useCallback((index) => {
//     console.log('handleSheetChange', index)
//   }, [])
//   const handleSnapPress = useCallback((index) => {
//     sheetRef.current?.snapToIndex(index)
//   }, [])
//   const handleClosePress = useCallback(() => {
//     sheetRef.current?.close()
//   }, [])

//   // render
//   const renderItem = useCallback(
//     (item) => (
//       <View key={item} style={styles.itemContainer}>
//         <Text>{item}</Text>
//       </View>
//     ),
//     [],
//   )
//   return (
//     <View style={styles.container}>
//       <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
//       <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
//       <Button title="Snap To 25%" onPress={() => handleSnapPress(0)} />
//       <Button title="Close" onPress={() => handleClosePress()} />
//       <BottomSheet
//         ref={sheetRef}
//         index={1}
//         snapPoints={snapPoints}
//         onChange={handleSheetChange}
//       >
//         <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
//           {data.map(renderItem)}
//         </BottomSheetScrollView>
//       </BottomSheet>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 200,
//   },
//   contentContainer: {
//     backgroundColor: 'white',
//   },
//   itemContainer: {
//     padding: 6,
//     margin: 6,
//     backgroundColor: '#eee',
//   },
// })

// export default App
