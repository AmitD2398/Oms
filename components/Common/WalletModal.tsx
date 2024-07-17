import { StyleSheet, Text, View,ScrollView, } from 'react-native'
import React,{useState} from 'react'
import Modal from 'react-native-modal';

export default function WalletModal() {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <Modal
        isVisible={visible}
        style={styles.modalContainer}
        swipeDirection={'down'}
        onSwipeDown={()=>  setVisible(false) }
        onBackButtonPress={() => {
          setVisible(false);
        }}>
        <ScrollView style={styles.btnSection}>
          <View>
            <View
              style={{
                backgroundColor: '#E1E1E1',
                width: 100,
                height: 5,
                borderRadius: 10,
                alignSelf: 'center',
                marginVertical: 10,
              }}>

              </View>
              </View>
            
        </ScrollView>
      </Modal> 
    </View>
  )
}

const styles = StyleSheet.create({
      modalContainer: {
        width: '100%',
        marginLeft: 0,
        marginBottom: 0,
      },
      btnSection: {
        position: 'absolute',
        bottom: 0,
        height: 300,
        backgroundColor: '#333',
        width: '100%',
        right: 0,
        left: 0,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
      },
})