import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    Image,
    Pressable,
    Dimensions,
    TextInput,
  } from "react-native";
  import { useState, useEffect, useRef } from "react";
  import ScreenWrapper from "../../components/ScreenWrapper";
  import { fetchUrl } from "../../Utils/FetchHelper";
  import { ADD_ADDRESS_URL, EDIT_ADDRESS_URL } from "../../Utils/ApiUrlConstants";
  import Loader from "../../components/Common/LoaderModal";
  import { showToastWithGravity } from "../../components/Common/SnackBar";
  import { useSelector, useDispatch } from "react-redux";
  import {
    validate_name,
    validate_number,
    validate_PIN,
    validate_address,
  } from "../../Utils/ValidationControl";
import { Picker } from "@react-native-picker/picker";
  
  const { width, height } = Dimensions.get("window");
  
  export default function AddCards({ navigation, route: { params } }) {
    const {
      ///for edit
      edit,
      fromPath = "",
      addressId = "",
      name = "",
      mobile = "",
      pincode = "",
      flat = "",
      area = "",
      city = "",
      state = "",
      landmark = "",
    } = params;
    const ref_input2 = useRef();
    const ref_input3 = useRef();
    const ref_input4 = useRef();
    const ref_input5 = useRef();
    const ref_input6 = useRef();
    const ref_input7 = useRef();
    const ref_input8 = useRef();
    // console.log("params", params);
  
  const [selected, setSelected] = useState(0);

    const { token } = useSelector((state) => state.tokenReducer);
    const { email } = useSelector((state) => state.userProfileReducer);
    const dispatch = useDispatch();
  
    const [loader, setLoader] = useState(false);
  
    const [uName, setUName] = useState(name);
    const [uMobile, setUMobile] = useState(mobile);
    const [uPincode, setUPincode] = useState(pincode);
    const [uFlat, setUFlat] = useState(flat);
    const [uArea, setUArea] = useState(area);
    const [uCity, setUCity] = useState(city);
    const [uState, setUState] = useState(state);
    const [uLandmark, setULandmark] = useState(landmark);
    const [selectedValue, setSelectedValue] = useState('');
  
    const [isActive, setIsActive] = useState(false);

    const handlePress = () => {
      setIsActive(!isActive);
    };

  const handleValueChange = (itemValue) => {
    setSelectedValue(itemValue);
  };

    const addAddressParams = {
      address_type: 1, //1-Home,2-Office
      name: uName,
      email: email, //registered mail
      mobile: uMobile,
      city: uCity,
      state_id: uState, //state
      // country_id: "", //country
      pin: uPincode, //pincode
      address: uFlat,
      town: uArea, //town or city
      address2: "", //optional
      landmark: uLandmark, //optional
      default_address: 0, //0-not set default,1-set as default
      // lat:30.222,
      // lng:76.222,
    };
    const editAddressParams = {
      address_id: addressId,
      address_type: 1, //1-Home,2-Office
      name: uName,
      email: email, //registered mail
      mobile: uMobile,
      city: uCity,
      state_id: uState, //state
      // country_id: "", //country
      pin: uPincode, //pincode
      address: uFlat,
      town: uArea, //town or city
      address2: "", //optional
      landmark: uLandmark, //optional
      default_address: 0, //0-not set default,1-set as default
      // lat:30.222,
      // lng:76.222,
    };
  
    const addAddressApi = () => {
      setLoader(true);
      // console.log("ProductDetailsParams", productDetailsParams);
      fetchUrl(
        edit ? editAddressParams : addAddressParams,
        token,
        edit ? EDIT_ADDRESS_URL : ADD_ADDRESS_URL
      )
        .then((resJson) => {
          ////////////////////
          setLoader(false);
          // console.log(
          //   edit ? "EDIT_ADDRESS_API_result" : "ADD_ADDRESS_API_result =====",
          //   resJson
          // );
          // showToastWithGravity(resJson?.message);
          if (resJson?.status == 200) {
            showToastWithGravity(resJson?.message);
            edit
              ? navigation.navigate("SuccessScreen", {
                  fromPath: fromPath,
                  heading: "Address",
                  content: "Successfully changed!",
                  subContent:
                    "Your  address details has been successfully changed!",
                  button: "Back to settings",
                })
              : navigation.navigate("SuccessScreen", {
                  fromPath: fromPath,
                  heading: "Address",
                  content: "Successfully added!",
                  subContent:
                    "Your new address details has been successfully added!",
                  button: "Back to settings",
                });
            // setProductListData(resJson?.listing);
          } else if (resJson?.status == 603) {
            unAuthorizedHandler(resJson, navigation, dispatch);
          } else if (resJson?.status == 404) {
            showToastWithGravity(resJson?.message);
          }
        })
        .catch((error) => {
          setLoader(false);
          console.log(
            edit ? "EDIT_ADDRESS_API_Error::" : "ADD_ADDRESS_API_Error::",
            error
          );
        });
    };
  
    const validationCheck = () => {
      let validationErrorMessage = null;
  
      if (!validate_name(uName))
        return (validationErrorMessage = "Name Can't Be Empty");
      else if (!validate_number(uMobile))
        return (validationErrorMessage = "Invalid/Empty Card Number");
      else return validationErrorMessage;
    };
  
    const validationCheckHandler = () => {
      let valMsg = validationCheck();
  
      if (valMsg) {
        showToastWithGravity(valMsg);
      } else {
        //if no validation error
        //Api call >>>> then Navigate on success>>
        addAddressApi();
      }
    };
    return (
      <ScreenWrapper>
        <View style={[styles.headerView]}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              resizeMode="contain"
              style={styles.backButton}
              source={require("../../assets/images/backArrow2.png")}
            />
          </Pressable>
          <Text style={styles.headerText}>Cards</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width: width, height: height }}
          contentContainerStyle={{ alignItems: "center" }}
        >
          <View style={styles.viewIntoScrollView}>
            <Text style={styles.fieldHeadingText}>
              {edit ? "Edit Credit/Debit card" : "Add new Credit/Debit card"}
            </Text>
            <View style={{flexDirection:'row',alignSelf:'flex-start'}}>
                <Pressable  style={[styles.swichBtnStyle,{backgroundColor: selected == 0?'#F2F5F6':'#fff'}]}
                onPress={()=>{
                    setSelected(0)
                }}>
                <Text style={{color:'#7E7E7E',fontSize:15,}}>Debit</Text>
                </Pressable>
                <Pressable  style={[styles.swichBtnStyle,{backgroundColor: selected == 1?'#F2F5F6':'#fff',
                }]}
                onPress={()=>{
                    setSelected(1)
                }}>
                <Text style={{color:'#7E7E7E',fontSize:15,}}>Credit</Text>
                </Pressable>
            </View>
            
            <TextInput
              value={uMobile}
              onChangeText={setUMobile}
              maxLength={10}
              keyboardType="numeric"
              autoCorrect={false}
              placeholder="Card number*"
              placeholderTextColor={"rgba(22, 27, 47, 0.6)"}
              style={styles.TextInputStyle}
              ref={ref_input2}
              returnKeyType="next"
              onSubmitEditing={() => ref_input3.current.focus()}
              blurOnSubmit={false}
            />
             <TextInput
              value={uName}
              onChangeText={setUName}
              maxLength={30}
              autoCorrect={false}
              placeholder="Name on card*"
              placeholderTextColor={"rgba(22, 27, 47, 0.6)"}
              style={styles.TextInputStyle}
              returnKeyType="next"
              onSubmitEditing={() => ref_input2.current.focus()}
              blurOnSubmit={false}
            />
            <View style={{width:'100%',flexDirection:'row'}}>
            <View style={{width:'50%',}}>
          <Picker
        selectedValue={selectedValue}
        onValueChange={handleValueChange}
               style={styles.pickerIcon}
      >
        <Picker.Item label="Expiry month" value="option1" />
        <Picker.Item label="Option 2" value="option2" />
        <Picker.Item label="Option 3" value="option3" />
      </Picker>
          </View>
          <View style={{width:'50%',}}>
          <Picker
        selectedValue={selectedValue}
        onValueChange={handleValueChange}
               style={styles.pickerIcon}
      >
        <Picker.Item label="Expiry Year" value="option1" />
        <Picker.Item label="Option 2" value="option2" />
        <Picker.Item label="Option 3" value="option3" />
      </Picker>
          </View>
            </View>
          </View>
          
        </ScrollView>
        <Pressable
          onPress={() => validationCheckHandler()}
          style={styles.addButtonView}
        >
          <Text style={styles.addButtonText}>{edit ? "Save" : "Add"}</Text>
          <Image
            resizeMode="contain"
            style={styles.rightArrow}
            source={require("../../assets/images/rightArrow.png")}
          />
        </Pressable>
        <Loader loader={loader} setLoader={setLoader} />
      </ScreenWrapper>
    );
  }
  
  const styles = StyleSheet.create({
    headerView: {
      flexDirection: "row",
      // justifyContent: "space-between",
      alignSelf: "center",
      alignItems: "center",
      width: "100%",
      paddingHorizontal: 15,
      // backgroundColor: 'red',
      marginTop: 5,
    },
    backButton: {
      height: 20,
      width: 20,
      marginRight: 10,
    },
    headerText: {
      fontSize: 18,
      fontFamily: "OpenSans-Bold",
      color: "#161B2F",
    },
    viewIntoScrollView: {
      paddingTop: 15,
      paddingHorizontal: 15,
      alignItems: "center",
      width: "100%",
    },
    fieldHeadingText: {
      fontSize: 15,
      color: "rgba(22, 27, 47, 1)",
      fontFamily: "OpenSans-SemiBold",
      alignSelf: "flex-start",
      marginVertical: 15,
    },
    TextInputStyle: {
      height: 50,
      width: "100%",
      color: "#161B2F",
      fontSize: 14,
      fontFamily: "OpenSans-Medium",
      borderBottomWidth: 1,
      borderBottomColor: "rgba(159, 159, 159, 0.4)",
      marginBottom: 20,
    },
    addButtonView: {
      backgroundColor: "#1A97CC",
      height: 50,
      width: "100%",
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 15,
      // marginTop: 50,
    },
    addButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontFamily: "OpenSans-Regular",
    },
    rightArrow: {
      height: 18,
      width: 18,
    },
    swichBtnStyle:{
        width:80,alignItems:'center',
        borderRadius:10,
        justifyContent:'center',
        height:30
    },
    pickerIcon:{
        color:'#7E7E7E'
    }
  });
  