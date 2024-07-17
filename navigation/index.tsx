//@ts-nocheck
/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DefaultTheme, DarkTheme, useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { ColorSchemeName, Pressable, Image, Platform, View } from 'react-native';

import Login from '../screens/Auth/Login';
// import ForgotPassword from '../screens/Auth/ForgotPassword';
// import ResetPassword from '../screens/Auth/ResetPassword';
// import ForgotPasswordOTP from '../screens/Auth/ForgotPasswordOTP';

import Dashboard from '../screens/Dashboard/Dashboard';
import ProductList from '../screens/ProductList/ProductList';
import ProductDetails from '../screens/ProductDetails/ProductDetails';
import WishList from '../screens/Dashboard/WishList';
import SearchProducts from '../screens/Dashboard/SearchProducts';
import Category from '../screens/Category/Category';
import SubCategory from '../screens/Category/SubCategory';
import MyCart from '../screens/Cart/MyCart';
import CheckoutAddress from '../screens/Cart/CheckoutAddress';
import Payment from '../screens/Cart/Payment';
import MyOrders from '../screens/MyOrders/MyOrders';
import OrderDetails from '../screens/MyOrders/OrderDetails';
import CancelOrder from '../screens/MyOrders/CancelOrder';
import OrderTracking from '../screens/MyOrders/OrderTracking';
import OrderRefund from '../screens/MyOrders/OrderRefund';
import Notifications from '../screens/Notifications/Notifications';
import NotificationsDetail from '../screens/Notifications/NotificationsDetail';

import MyProfile from '../screens/Profile/MyProfile';
import EditMyProfile from '../screens/Profile/EditMyProfile';
import Settings from '../screens/Profile/Settings';
import Cards from '../screens/Profile/Cards';
import AddCards from '../screens/Profile/AddCards';
// import ChangePassword from '../screens/Profile/ChangePassword';
// import ChangePasswordOTP from '../screens/Profile/ChangePasswordOTP';
// import NewPassword from '../screens/Profile/NewPassword';
import SuccessScreen from '../screens/SuccessScreen';
import OrderPlacedSuccessfully from '../screens/OrderPlacedOrCancelSuccessfully';
import Addresses from '../screens/Profile/Addresses';
import AddAddress from '../screens/Profile/AddAddress';


import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';

import { useDispatch, useSelector } from "react-redux";
import { setTokenAction } from "../redux/Actions/SetTokenAction";
import Register from '../screens/Auth/Register';
import VerifyAccount from '../screens/Auth/VerifyAccount';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import ResetPassword from '../screens/Auth/ResetPassword';
import ForgotPasswordOTP from '../screens/Auth/ForgotPasswordOTP';
import NewPassword from '../screens/Profile/NewPassword';
import ChangePasswordOTP from '../screens/Profile/ChangePasswordOTP';
import ChangePassword from '../screens/Profile/ChangePassword';
import WalletModal from '../components/Common/WalletModal';


/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */


export default function Navigation({
  landingScreenName,
  tokenn,
}) {
  // console.log("++tokenn====", tokenn);

  const dispatch = useDispatch()
  // const { token } = useSelector((state) => state.tokenRducer)


  useEffect(() => {
    dispatch(setTokenAction(tokenn));

  }, []);

  return (
    <NavigationContainer
    // linking={LinkingConfiguration}
    // ref={navigationRef}
    >
      <RootNavigator landingScreenName={landingScreenName} />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator({ landingScreenName }) {
  return (
    <Stack.Navigator
      // screenOptions={horizontalAnimation}
      initialRouteName={landingScreenName}
      screenOptions={{
        // animation: 'none',
        gestureEnabled: false, //>>>>specially for ios 15 backGesture to stop back on swipe from right edge
      }}
    >
      <Stack.Screen
        name="BottomTabNavigation"
        component={BottomTabNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="VerifyAccount"
        component={VerifyAccount}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="ForgotPasswordOTP"
        component={ForgotPasswordOTP}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="SubCategory"
        component={SubCategory}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="ProductList"
        component={ProductList}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="SearchProducts"
        component={SearchProducts}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="WishList"
        component={WishList}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="MyCart"
        component={MyCart}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="CheckoutAddress"
        component={CheckoutAddress}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="MyOrders"
        component={MyOrders}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetails}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="CancelOrder"
        component={CancelOrder}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="OrderTracking"
        component={OrderTracking}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="OrderRefund"
        component={OrderRefund}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="NotificationsDetail"
        component={NotificationsDetail}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="EditMyProfile"
        component={EditMyProfile}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="Cards"
        component={Cards}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="AddCards"
        component={AddCards}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="ChangePasswordOTP"
        component={ChangePasswordOTP}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="NewPassword"
        component={NewPassword}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="WalletModal"
        component={WalletModal}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="SuccessScreen"
        component={SuccessScreen}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="OrderPlacedSuccessfully"
        component={OrderPlacedSuccessfully}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="Addresses"
        component={Addresses}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />
      <Stack.Screen
        name="AddAddress"
        component={AddAddress}
        options={{
          headerShown: false,
          // presentation: "transparentModal"
        }}
      />

    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

const Tab = createBottomTabNavigator();
function BottomTabNavigation() {
  const { token } = useSelector((state) => state.tokenReducer);

  return (
    <Tab.Navigator
      // initialRouteName="TabOneScreen"
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme].tint,
        // tabBarActiveTintColor: 'yellow', //active color for label if not defibned in tabBarLabelStyle
        tabBarHideOnKeyboard: true,
        headerShown: false, //
        tabBarStyle: {
          // display: 'none',
          // height: Platform.OS === "android" ? 60 : 80, //tabBar Height
          // paddingBottom: Platform.OS === "android" ? 7 : 30,
          paddingLeft: 10,
          paddingRight: 10,
          backgroundColor: '#F4F4F4',
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          // tabBarShowLabel: false,
          fontSize: 11,
          color: "#161B2F", //color for label
          // fontFamily: 'roboto-medium',
          paddingBottom: Platform.OS === 'android' ? 3 : 0,
        },
        tabBarItemStyle: {
          //    backgroundColor: "yellow",
          margin: 2,
        }
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={({ navigation, route, focused }) => ({
          // tabBarBadge: true,
          title: "Home",
          // tabBarShowLabel: false,
          // tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          tabBarIcon: ({ focused, color, size }) => (

            focused ? (<Image
              resizeMode="contain"
              source={require("../assets/images/homeIconTabActive.png")}
              style={{
                width: 24,
                height: 24,
                top: 2,
                left: 2
                // marginBottom: focused ? 10 : 0,
                // tintColor: '#161B2F',
                // tintColor: focused ? '#161B2F' : 'gray',

              }}
            />) : (<Image
              resizeMode="contain"
              source={require("../assets/images/homeIconTab.png")}
              style={{
                width: 19,
                height: 19,
                // marginBottom: focused ? 10 : 0,
                tintColor: '#161B2F',
                // tintColor: focused ? '#161B2F' : 'gray',

              }}
            />)
          ),
        })}
      />
      <Tab.Screen
        name="Category"
        component={Category}
        options={({ navigation, route }) => ({
          title: 'Categories',
          // tabBarShowLabel: false,
          // tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          tabBarIcon: ({ focused, color, size }) => (
            focused ? (<Image
              resizeMode="contain"
              source={require("../assets/images/categoryIconTabActive.png")}
              style={{
                width: 24,
                height: 24,
                top: 2,
                left: 2
                // marginBottom: focused ? 10 : 0,
                // tintColor: '#161B2F',
                // tintColor: focused ? '#161B2F' : 'gray',

              }}
            />) : (<Image
              resizeMode="contain"
              source={require("../assets/images/categoryIconTab.png")}
              style={{
                width: 19,
                height: 19,
                // marginBottom: focused ? 10 : 0,
                // tintColor: '#161B2F',
                // tintColor: focused ? '#161B2F' : 'gray',
              }}
            />)

          ),
        })}
      />
      <Tab.Screen
        name="MyCart"
        component={MyCart}
        options={({ navigation, route }) => ({
          title: 'Bag',
          // tabBarShowLabel: false,
          // tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          tabBarIcon: ({ focused, color, size }) => (
            focused ? (<Image
              resizeMode="contain"
              source={require("../assets/images/bagIconTabActive.png")}
              style={{
                width: 24,
                height: 24,
                top: 2,
                left: 2
                // marginBottom: focused ? 10 : 0,
                // tintColor: '#161B2F',
                // tintColor: focused ? '#161B2F' : 'gray',

              }}
            />) : (<Image
              resizeMode="contain"
              source={require("../assets/images/bagIconTab.png")}
              style={{
                width: 19,
                height: 19,
                // marginBottom: focused ? 10 : 0,
                // tintColor: '#161B2F',
                // tintColor: focused ? '#161B2F' : 'gray',
              }}
            />)
          ),
        })}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            if (!token) {
              // Prevent default action
              e.preventDefault();
              // Do something with the `navigation` object
              navigation.push("Login");
            } else {
              //
            }
          },
        })}
      />
      <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={({ navigation, route }) => ({
          title: 'Inbox',
          // tabBarShowLabel: false,
          // tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          tabBarIcon: ({ focused, color, size }) => (
            focused ? (<Image
              resizeMode="contain"
              source={require("../assets/images/inboxIconTabActive.png")}
              style={{
                width: 24,
                height: 24,
                top: 2,
                left: 2
                // marginBottom: focused ? 10 : 0,
                // tintColor: '#161B2F',
                // tintColor: focused ? '#161B2F' : 'gray',

              }}
            />) : (<Image
              resizeMode="contain"
              source={require("../assets/images/inboxIconTab.png")}
              style={{
                width: 19,
                height: 19,
                // marginBottom: focused ? 10 : 0,
                // tintColor: '#161B2F',
                // tintColor: focused ? '#161B2F' : 'gray',
              }}
            />)
          ),
        })}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            if (!token) {
              // Prevent default action
              e.preventDefault();
              // Do something with the `navigation` object
              navigation.push("Login");
            } else {
              //
            }
          },
        })}
      />
      <Tab.Screen
        name="MyProfile"
        component={MyProfile}
        options={({ navigation, route }) => ({
          title: 'Me',
          // tabBarShowLabel: false,
          // tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          // tabBarStyle: { display: "none" },
          tabBarIcon: ({ focused, color, size }) => (
            focused ? (<Image
              resizeMode="contain"
              source={require("../assets/images/userIconTabActive.png")}
              style={{
                width: 24,
                height: 24,
                top: 2,
                left: 2
                // marginBottom: focused ? 10 : 0,
                // tintColor: '#161B2F',
                // tintColor: focused ? '#161B2F' : 'gray',

              }}
            />) : (<Image
              resizeMode="contain"
              source={require("../assets/images/userIconTab.png")}
              style={{
                width: 19,
                height: 19,
                // marginBottom: focused ? 10 : 0,
                // tintColor: '#161B2F',
                // tintColor: focused ? '#161B2F' : 'gray',
              }}
            />)
          ),
        })}
        listeners={({ navigation, route }) => ({
          tabPress: (e) => {
            if (!token) {
              // Prevent default action
              e.preventDefault();
              // Do something with the `navigation` object
              navigation.push("Login");
            } else {
              //
            }
          },
        })}
      />

    </Tab.Navigator>
  );
}






/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}
