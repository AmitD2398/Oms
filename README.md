<!-- Getting started with Expo react-native project -->

# ShoppingApp


## Prerequisites
To run this project in the development mode, you'll need to have a basic environment to run an Expo-App
-VS Code installed
- Install the CLI `npm i -g expo-cli`
- Download the "Expo Client" app from the Play Store or App Store.
- Same Wi-Fi network Access on client app as on your machine


## Step By Step Guide

## Installing

## You can simply clone the project
```
$ git clone < project-url.git >
```
​
-installing dependencies ....
```
$ yarn
```
or
```
$ npm install
```

## Running

Expo Client supports running any project that doesn't have custom native modules added.

With all dependencies installed and the environment properly configured, you can now run the app.
​- Start your project with Expo
  - Start the project `expo start`
- Open the project:
  - Sign in to expo and the project will appear in the app.
  - Or point your phone's camera at the QR code in the terminal (press "c" to view it).
​
## Android
```
$ expo start
```
## iOS
```
$ expo start
```

## To Make Apk in bare React Native App
To make apk first you should have app in Bare React Native Or Expo Ejected App

in root terminal

```
$ cd android
$ ./gradlew assembleRelease
```


## Features
- Native project ready to be built on to your device.
- Support for unimodules and auto-linking.
- Works with the Expo Client app.


## Support and Contact

If you're having issues with Create React Native App, please make sure:

- The issue is not covered in the [Expo Docs](https://docs.expo.io/versions/latest/)
- There is not already an [open issue](https://github.com/expo/expo-cli/issues) for your particular problem