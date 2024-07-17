import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { openGallery } from "../../Utils/GalleryHelper";
import { openCamera } from "../../Utils/CameraHelper";
import PopupOption from "../../components/Common/PopupOption";
import { fetchUrl, fetchFormData } from "../../Utils/FetchHelper";
import {
  USER_PROFILE_URL,
  UPDATE_USER_PROFILE_PIC_URL,
  CHANGEPASSWORD_URL,
  UPDATE_USER_PROFILE_URL,
} from "../../Utils/ApiUrlConstants";
import { showToastWithGravity } from "../../components/Common/SnackBar";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../components/Common/LoaderModal";
import { unAuthorizedHandler } from "../../Utils/UnAuthorizedHandler";
import { ApiUrl } from "../../constants/Constant";
import { useRoute } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const { width, height } = Dimensions.get("window");

export default function EditMyProfile({ navigation, route: { params } }) {
  const route = useRoute();
  const { userProfileData } = params;
  const { token } = useSelector((state) => state.tokenReducer);
  const dispatch = useDispatch();

  const [loader, setLoader] = useState(false);

  const [popup, showPopup] = useState(false);
  const [modal, showModal] = useState(false);
  // const [imageBackOrFront, setImageBackOrFront] = useState("");
  const [frontImage, setFrontImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [gendar, setGendar] = useState(route.params?.userProfileData?.gender);
  const [gendarName, setGendarName] = useState('');
  useEffect(() => {
    // console.log('gendar',gendar); // Check if the gender variable has the expected value
    navigation.setParams({
      // ...params,
      gender: gendar,
    });
  }, [gendar]);
console.log(route.params?.userProfileData?.gender);
  useEffect(() => {
    setFrontImage(userProfileData?.photo ? userProfileData?.photo : "");
    setImageUrl(userProfileData?.background_photo ? userProfileData?.background_photo : "");
  }, []);

  useEffect(() => {
    updateGenterApi()
  }, [gendar]);

  const handlePressClick = () => {
    showPopup(!popup);
  };
  const handleClick = () => {
    showModal(!modal);
  };
  const onCameraClick = () => {
    showPopup(false);
    openCamera().then((res) => {
      // console.log("CameraResponse>>>>", res);
      if (res == null) {
      } else {
        // uploadProfileImageApi(res);///////////////////////////
        // setFrontImage(res);
        uploadProfileImageApi(res);
      }
      // setImage(res)
    });
  };
  const cameraClick = () => {
    showPopup(false);
    openCamera().then((res) => {
      // console.log("CameraResponse>>>>", res);
      if (res == null) {
      } else {
        // uploadProfileImageApi(res);///////////////////////////
        // setFrontImage(res);
        updateProfileImageApi(res);
      }
      // setImage(res)
    });
  };
  const onGalleryClick = () => {
    showPopup(false);
    openGallery().then((res) => {
      // console.log("GalleryResponse>>>>", res);
      if (res == null) {
      } else {
        // uploadProfileImageApi(res);///////////////////
        // setFrontImage(res);
        uploadProfileImageApi(res);
      }
      // setImage(res)
    });
  };
  const galleryClick = () => {
    showModal(false);
    openGallery().then((res) => {
      // console.log("GalleryResponse>>>>", res);
      if (res == null) {
      } else {
        // uploadProfileImageApi(res);///////////////////
        // setFrontImage(res);
        updateProfileImageApi(res);
      }
      // setImage(res)
    });
  };

  const uploadProfileImageApi = (image) => {
    setLoader(true);
    let localUri = image?.uri;
    let filename = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    const data = new FormData();
    data.append("profile_pic", { uri: image?.uri, name: filename, type: type });
    // console.log("match", match, type, `image/${match[1]}`)
    fetchFormData(data, token, UPDATE_USER_PROFILE_PIC_URL)
      .then((resJson) => {
        // console.log("UPDATE_USER_PROFILE_URL_Result =====", resJson);
        if (resJson?.status == 200) {
          userProfileApi();
        } else if (resJson?.status == 400) {
          showToastWithGravity(resJson?.message);
        } else if (resJson?.status == 603) {
          showToastWithGravity(resJson?.message);
          // unAuthorizedHandler(resJson, navigation, dispatch);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("UPDATE_USER_PROFILE_URL_Error::", error);
      });
  };
  const updateProfileImageApi = (image) => {
    let localUri = image?.uri;
    let filename = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    const data = new FormData();
    data.append("background_image", { uri: image?.uri, name: filename, type: type });
    // console.log("match", match, type, `image/${match[1]}`)
    fetchFormData(data, token, UPDATE_USER_PROFILE_URL)
      .then((resJson) => {
        // console.log("UPDATE_USER_PROFILE_URL_Result =====", resJson);
        if (resJson?.status == 200) {
          setImageUrl(resJson?.data?.background_photo ? resJson?.data?.background_photo : null)
        } else if (resJson?.status == 400) {
          showToastWithGravity(resJson?.message);
        } else if (resJson?.status == 603) {
          showToastWithGravity(resJson?.message);
          // unAuthorizedHandler(resJson, navigation, dispatch);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("UPDATE_USER_PROFILE_URL_Error::", error);
      });
  };
  const updateGenterApi = () => {
    const data = new FormData();
    data.append("gender", gendar);

    fetchFormData(data, token, UPDATE_USER_PROFILE_URL)
      .then((resJson) => {
        // console.log("UPDATE_USER_PROFILE_URL_Result =====", resJson);
        setLoader(false);
        if (resJson?.status == 200) {
          setGendarName(resJson?.data)
          userProfileApi()
        } else if (resJson?.status == 400) {
          showToastWithGravity(resJson?.message);
        } else if (resJson?.status == 603) {
          showToastWithGravity(resJson?.message);
          // unAuthorizedHandler(resJson, navigation, dispatch);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("UPDATE_USER_PROFILE_URL_Error::", error);
      });
  };
  const userProfileApi = () => {
    fetchUrl({}, token, USER_PROFILE_URL)
      .then((resJson) => {
        ////////////////////
        setLoader(false);
        // console.log("USER_PROFILE_result =====", resJson);
        if (resJson?.status == 200) {
          // setLoader(false);
          // showToastWithGravity(resJson?.message);
          setFrontImage(resJson?.data?.photo ? resJson?.data?.photo : null);
          
        } else if (resJson?.status == 400) {
          showToastWithGravity(resJson?.message);
        } else if (resJson?.status == 603) {
          // showToastWithGravity(resJson?.message);
          unAuthorizedHandler(resJson, navigation, dispatch);
        } 
      })
      .catch((error) => {
        setLoader(false);
        console.log("USER_PROFILE_Error::", error);
      });
  };
  const changePasswordApi = () => {
    fetchUrl({}, token, CHANGEPASSWORD_URL)
      .then((resJson) => {
        ////////////////////
        setLoader(false);
        // console.log("USER_PROFILE_result =====", resJson);
        if (resJson?.status == 200) {
          // setLoader(false);
          // showToastWithGravity(resJson?.message);
          navigation.navigate("ChangePasswordOTP",{email:userProfileData?.email})
        } else if (resJson?.status == 400) {
          showToastWithGravity(resJson?.message);
        } else if (resJson?.status == 603) {
          // showToastWithGravity(resJson?.message);
          unAuthorizedHandler(resJson, navigation, dispatch);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("USER_PROFILE_Error::", error);
      });
  };
  const handleUpdateUserProfileData = (data) => {
    // console.log('dafs',data)
    setGendar(data);
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
        <Text style={styles.headerText}>Profile</Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: width, height: height }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={styles.profileANdBackImageView}>
          <View style={styles.backGroundImage}>
          {/* <Pressable
              onPress={() => {
                showModal(true);
              }}> */}
              {imageUrl?(<Image
              resizeMode="stretch"
              style={styles.backGroundImage}
              source={{uri:ApiUrl+imageUrl}}
            />):(<Image
              resizeMode="stretch"
              style={styles.backGroundImage}
              source={require("../../assets/images/profileBackImage.png")}
            />)}
            
            {/* </Pressable> */}
            <Pressable
              onPress={() => {
                showModal(true);
              }}>
            <Image
              resizeMode="contain"
              style={[
                styles.profileImageEditTag,
                { position: "absolute", right:10,bottom:10 },
              ]}
              source={require("../../assets/images/profileEditTag.png")}
            />
            </Pressable>
          </View>
          <View style={styles.profileAndNameView}>
            {/* <Pressable
              onPress={() => {
                showPopup(true);
              }}
              //frontImage
              style={{
                borderWidth: 0.5,
                borderColor: "#E0E3E3",
                borderRadius: 110 / 2,
              }}
            > */}
              {frontImage ? (
                <Image
                  resizeMode="cover"
                  style={styles.profileImage}
                  source={{ uri: frontImage }}
                />
              ) : (
                <Image
                  resizeMode="contain"
                  style={styles.profileImage}
                  source={
                    require("../../assets/images/lpntUserIcon.png")
                    // userProfileData?.gender == "FeMale"
                    //   ? require("../../assets/images/femaleIcon.png")
                    //   : userProfileData?.gender == "Male"
                    //   ? require("../../assets/images/maleIcon.png")
                    //   : require("../../assets/images/maleIcon.png") //null
                  }
                />
              )}
            {/* </Pressable> */}
            <Pressable
              onPress={() => {
                showPopup(true);
              }}
              //frontImage
              style={{
                position: "absolute", top: wp(2), right: wp(35)
              }}
            >
            <Image
              resizeMode="contain"
              style={[
                styles.profileImageEditTag,
              ]}
              source={require("../../assets/images/profileEditTag.png")}
            />
            </Pressable>
          </View>
        </View>

        <View style={styles.personalDetailsViewWrapper}>
          <View style={styles.personalDetailsView}>
            <Text style={styles.personalDetailTextHeading}>
              Personal Details
            </Text>
            <View style={styles.horizontalLinefull}></View>
            <Text style={styles.fieldKey}>Full name</Text>
            <Text style={styles.fieldValue}>{userProfileData?.full_name}</Text>
            <View style={styles.horizontalLine}></View>
            <Text style={styles.fieldKey}>Mobile number</Text>
            <Text style={styles.fieldValue}>{userProfileData?.mobile}</Text>
            <View style={styles.horizontalLine}></View>
            <Text style={styles.fieldKey}>Email Address</Text>
            <Text style={styles.fieldValue}>{userProfileData?.email}</Text>
            <View style={styles.horizontalLine}></View>
            <View style={styles.maleFemaleViewWrapper}>
            <Pressable onPress={()=>handleUpdateUserProfileData('male')} >
              <View style={styles.maleFemaleView}>
                {gendar == "male" ? ( //GenderMale
                  <Image
                    resizeMode="contain"
                    style={styles.greenTickImage}
                    source={require("../../assets/images/greenCheck.png")}
                  />
                ) : null}
                
                <Text style={styles.maleFemaleText}>Male</Text> 
              </View>
              </Pressable>
              <Pressable onPress={()=>handleUpdateUserProfileData('female')}>
              <View style={styles.maleFemaleView}>
                
                {gendar == "female" ? ( //GenderFemale
                  <Image
                    resizeMode="contain"
                    style={styles.greenTickImage}
                    source={require("../../assets/images/greenCheck.png")}
                  />
                ) : null}
               
                <Text style={styles.maleFemaleText}>Female</Text> 
                
              </View>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.changePasswordButtonWrapper}>
          <Pressable
            // onPress={() => navigation.navigate("ChangePassword")}
            onPress={changePasswordApi}
            style={styles.itemView}
          >
            <View style={styles.itemImageView}>
              <Image
                resizeMode="contain"
                style={styles.itemImage}
                source={require("../../assets/images/profileLockIcon.png")}
              />
            </View>
            <View style={styles.itemTextView}>
              <Text style={styles.itemTitle}>Change Password</Text>
              <Text style={styles.itemSubTitle}>
                Choose a strong password for better security
              </Text>
            </View>
            <View style={styles.rightArrowView}>
              <Image
                resizeMode="contain"
                style={styles.rightArrow}
                source={require("../../assets/images/rightArrow.png")}
              />
            </View>
          </Pressable>
        </View>
      </ScrollView>
      <Loader loader={loader} setLoader={setLoader} />
      {popup && (
        <PopupOption
          onCameraClick={onCameraClick}
          onGalleryClick={onGalleryClick}
          onCancelClick={handlePressClick}
        />
      )}
      {modal && (
        <PopupOption
          onCameraClick={cameraClick}
          onGalleryClick={galleryClick}
          onCancelClick={handleClick}
        />
      )}
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
  profileANdBackImageView: {
    marginTop: 20,
    // backgroundColor: "red",
    width: "100%",
    paddingHorizontal: 15,
    height: 210,
    alignItems: "center",
  },
  backGroundImage: {
    height: 140,
    width: "100%",
    borderRadius: 10,
    // backgroundColor: "rgba(22, 27, 47, 0.2)",
  },
  profileAndNameView: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    height: 140,
    width: "100%",
    top: 140 / 2.1,
    // backgroundColor: "red",
  },
  profileImage: {
    height: 110,
    width: 110,
    borderRadius: 110 / 2,
    // backgroundColor: "rgba(22, 27, 47, 0.6)",
  },
  profileImageEditTag: {
    height: 25,
    width: 25,
    // borderRadius: 25 / 2,
  },
  personalDetailsViewWrapper: {
    width: "100%",
    paddingHorizontal: 15,
    // backgroundColor: "red",
  },
  personalDetailsView: {
    // backgroundColor: "red",
    borderWidth: 1,
    borderColor: "rgba(22, 27, 47, 0.2)",
    width: "100%",
    borderRadius: 10,
    justifyContent: "center",
    paddingVertical: 10,
  },
  personalDetailTextHeading: {
    fontSize: 14,
    color: "rgba(22, 27, 47, 1)",
    fontFamily: "OpenSans-SemiBold",
    marginLeft: 10,
  },
  horizontalLinefull: {
    height: 1,
    backgroundColor: "rgba(22, 27, 47, 0.2)",
    width: "100%",
    marginVertical: 8,
    marginBottom: 15,
  },
  fieldKey: {
    fontSize: 12,
    color: "rgba(22, 27, 47, 0.6)",
    fontFamily: "OpenSans-Medium",
    marginLeft: 10,
  },
  fieldValue: {
    fontSize: 14,
    color: "rgba(22, 27, 47, 1)",
    fontFamily: "OpenSans-Medium",
    marginLeft: 10,
  },
  horizontalLine: {
    alignSelf: "center",
    height: 1,
    backgroundColor: "rgba(22, 27, 47, 0.15)",
    width: "95%",
    marginVertical: 8,
    marginBottom: 15,
  },
  maleFemaleViewWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  maleFemaleView: {
    height: 35,
    width: "90%",
    borderWidth: 1,
    borderColor: "rgba(22, 27, 47, 0.2)",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  greenTickImage: {
    height: 14,
    width: 14,
    marginRight: 10,
  },
  maleFemaleText: {
    fontSize: 14,
    color: "rgba(100, 100, 100, 1)",
    fontFamily: "OpenSans-Medium",
  },
  changePasswordButtonWrapper: {
    marginTop: 15,
    // backgroundColor: "red",
    width: "100%",
    paddingHorizontal: 15,
    alignItems: "center",
  },
  itemView: {
    backgroundColor: "#F2F5F6",
    // backgroundColor: "red",
    height: 60,
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemImageView: {
    width: "12%",
    height: "100%",
    alignItems: "center",
    paddingTop: 2,
  },
  itemImage: {
    height: 20,
    width: 20,
    right: 4,
  },
  itemTextView: {
    width: "76%",
    height: "100%",
  },
  itemTitle: {
    fontSize: 14,
    fontFamily: "OpenSans-Medium",
    color: "#161B2F",
    // marginVertical: 5,
  },
  itemSubTitle: {
    fontSize: 11,
    fontFamily: "OpenSans-Regular",
    color: "#646464",
    // marginVertical: 5,
  },
  rightArrowView: {
    width: "12%",
    height: "100%",
    // backgroundColor: "yellow",
    alignItems: "center",
    paddingTop: 4,
  },
  rightArrow: {
    height: 15,
    width: 15,
    tintColor: "#0E1525",
  },
});
