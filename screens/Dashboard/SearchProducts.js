import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  Text,
} from "react-native";
import { useState, useEffect } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import ScrollingTabsComponent from "../../components/Wishlist/ScrollingTabsComponent";
import TrendingComponent from "../../components/SearchProducts/TrendingComponent";
import RecentComponent from "../../components/SearchProducts/RecentComponent";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { All_PRODUCTS_URL } from "../../Utils/ApiUrlConstants";
import { useDispatch, useSelector } from "react-redux";
import { fetchUrl } from "../../Utils/FetchHelper";
import { unAuthorizedHandler } from "../../Utils/UnAuthorizedHandler";
import { showToastWithGravity } from "../../components/Common/SnackBar";
import Loader from "../../components/Common/LoaderModal";

export default function SearchProducts({ navigation }) {
  const { token } = useSelector((state) => state.tokenReducer);
  const { allProducts } = useSelector((state) => state.allProductsReducer);

  const dispatch = useDispatch();

  const [loader, setLoader] = useState(false);
  const [imageBaseUrl, setImageBaseUrl] = useState(null);
  const [allProductsData, setAllProductsData] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [filteredDataArray, setFilteredDataArray] = useState([]);

  // console.log("allProductsData", allProducts);

  useEffect(() => {
    if (allProducts == null) {
      allProductsApi();
    } else {
      setImageBaseUrl(allProducts?.imageBaseUrl);
      setAllProductsData(allProducts?.products);
      setFilteredDataArray(allProducts?.products); //by default data
    }
  }, []);

  const allProductsApi = () => {
    // setLoader(true);
    fetchUrl({ vendor_id: 4 }, token, All_PRODUCTS_URL)
      .then((resJson) => {
        ////////////////////
        setLoader(false);
        // console.log("All_PRODUCTS_result =====", resJson);
        // showToastWithGravity(resJson?.message);
        if (resJson?.status == 200) {
          // console.log("accessToken", resJson?.data?.login_token?.token);
          // setWishListData(resJson?.wishlist);
          setImageBaseUrl(resJson?.data?.imageBaseUrl);
          setAllProductsData(resJson?.data?.products);
          setFilteredDataArray(resJson?.data?.products);
        } else if (resJson?.status == 400) {
          showToastWithGravity(resJson?.message);
        } else if (resJson?.status == 404) {
          // setWishListData([]);
        } else if (resJson?.status == 603) {
          unAuthorizedHandler(resJson, navigation, dispatch);
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("All_PRODUCTS_Error::", error);
      });
  };

  const onChangeSearch = (textString) => {
    let text = textString.trimStart();
    // console.log("text", text);
    try {
      setSearchText(text);
      const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      const containSplChar = specialChars.test(text);
      if (text?.length === 0) {
        // fetch();
        setFilteredDataArray(allProductsData);
      } else {
        if (containSplChar) {
          setFilteredDataArray([]);
        } else {
          const filteredData = filterItems(text);
          // console.log("filteredItem", filteredData);
          setFilteredDataArray(filteredData);
        }
      }
    } catch (error) {
      console.log("Error in onchangesearch in AllProducts::", error);
    }
  };

  const filterItems = (searchTerm) => {
    try {
      const filteredItems = [];
      allProductsData?.forEach((item) => {
        const regex = new RegExp(`\\b${searchTerm}`, "gi");
        if (regex.exec(item?.product_name)) {
          filteredItems.push(item);
        }
      });

      return filteredItems;
    } catch (error) {
      // console.log("filter error:::", error);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.headerView}>
        <Pressable onPress={() => navigation.goBack()}>
          <Image
            resizeMode="contain"
            style={styles.backButton}
            source={require("../../assets/images/backArrow2.png")}
          />
        </Pressable>
        <View style={styles.TextInputView}>
          <View style={styles.textInputAndIconView}>
            <TextInput
              // onPress={() => alert('')}
              placeholder="Search here.."
              style={styles.textInput}
              onChangeText={onChangeSearch}
              value={searchText}
            />

            {/* <Pressable style={styles.searchIconView}>
              <Image
                resizeMode="contain"
                style={styles.searchIcon}
                source={require("../../assets/images/searchIcon.png")}
              />
            </Pressable> */}
          </View>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* <View>
          <Text style={styles.topSeacrhText}>Top Search</Text>
          <ScrollingTabsComponent TabsData={filteredDataArray} />
        </View> */}
        {/* <View style={{ marginHorizontal: 10 }}>
          <RecentComponent data={RecentData} />
        </View> */}
        <TrendingComponent
          // listData={TrendingData}
          imageBaseUrl={imageBaseUrl}
          listData={filteredDataArray}
          navigation={navigation}
          searchText={searchText}
        />
      </ScrollView>
      <Loader loader={loader} setLoader={setLoader} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    // backgroundColor: 'green',
  },
  backButton: {
    width: 22,
    height: 22,
  },
  TextInputView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: 'pink',
    paddingVertical: 10,
    width: "90%",
  },
  textInputAndIconView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F5F6",
    borderRadius: 10,
  },
  textInput: {
    height: 40,
    width: "100%",
    // backgroundColor: '#F2F5F6',
    // borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    // paddingRight: 5,
    // backgroundColor: 'red',
  },
  searchIconView: {
    width: "15%",
    // backgroundColor: 'red',
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: "#161B2F",
  },
  topSeacrhText: {
    fontSize: 22,
    color: "#DD1B47",
    fontFamily: "PlayfairDisplay-SemiBold",
    marginBottom: 5,
    marginHorizontal: 10,
  },
  headerText: {
    fontSize: 18,
    color: "#161B2F",
    fontFamily: "OpenSans-Bold",
    width: "50%",
    marginLeft: 10,
  },
  iconsView: {
    flexDirection: "row",
    // justifyContent: 'space-around',
    justifyContent: "flex-end",
    width: "50%",
  },
  favouriteIconView: {
    marginHorizontal: 10,
  },
  ViewIntoScrollView: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center",
    width: wp(100),
    // paddingBottom: 10,
    // paddingHorizontal: 10,
    // paddingVertical: 10,
    // backgroundColor: 'red',
  },
  favouriteIcon: {
    width: 22,
    height: 22,
    tintColor: "#161B2F",
  },
  bagIcon: {
    width: 20,
    height: 20,
    tintColor: "#161B2F",
  },
  //renderItem style>>>>>>>>>>>>>>>
  itemView: {
    width: "94%",
    height: 150,
    alignSelf: "center",
    // backgroundColor: 'red',
    // overflow: 'hidden',
  },
  itemBackgroundImageStyle: {
    borderRadius: 15,
    borderTopRightRadius: 70,
  },
  itemBackgroundImage: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    //   backgroundColor: '#FFFFFF00',
  },
  itemTextView: {
    alignSelf: "flex-end",
    backgroundColor: "#FFFFFF",
    width: "40%",
    height: "45%",
    borderTopLeftRadius: 70,
    overflow: "hidden",
    paddingTop: 15,
    paddingLeft: 15,
    // padding: 5,
  },
  itemHeadingText: {
    alignSelf: "center",
    fontSize: 16,
    color: "#161B2F",
    fontFamily: "OpenSans-Bold",
  },
  itemDescText: {
    fontSize: 12,
    color: "#646464",
    fontFamily: "OpenSans-Regular",
  },
});
