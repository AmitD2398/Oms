//@ts-nocheck
import { useState, useEffect } from 'react'
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { getItemFromStorage, setItemInStorage } from './Utils/AsyncStorageHelper';

import { store } from './redux/store';
import { Provider } from "react-redux"

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  // const [landingScreenName, setLandingScreenName] = useState('Login')
  const [landingScreenName, setLandingScreenName] = useState('Dashboard')
  // const [isSetNavigation, setIsSetNavigation] = useState(false)
  const [isSetNavigation, setIsSetNavigation] = useState(true)
  const [token, setToken] = useState(null)


  useEffect(() => {
    getItemFromStorage("accessToken").then((res) => {
      if (res) {
        setToken(res)
        // setLandingScreenName('BottomTabNavigation')
        setIsSetNavigation(true)
      } else {
        setIsSetNavigation(true)
      }
    })
    // setItemInStorage("accessToken", "sdjg832523t3498239")
  }, [])

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      isSetNavigation ?
        <SafeAreaProvider >
          <Provider store={store}>
            <Navigation tokenn={token} landingScreenName={landingScreenName} />
            {/* <Navigation landingScreenName={landingScreenName} /> */}
            <StatusBar
              backgroundColor='white'
              style={"dark"}
              translucent={false} //if true drag app under statusbar
            /></Provider>
        </SafeAreaProvider>
        : <View></View>
    );
  }
}
