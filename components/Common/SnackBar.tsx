//@ts-nocheck
import { ToastAndroid, Platform } from 'react-native';
import Toast from 'react-native-root-toast'

export const showToast_Both = (message: string) => {
    let toast = Toast.show(message, {
        duration: Toast.durations.SHORT,
    });
};
export const showToast = (message: string) => {
    if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
        let toast = Toast.show(message, {
            duration: Toast.durations.SHORT,
        });
    }
};

export const showToastWithGravity = (message: string) => {
    if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
        );
    } else {
        let toast = Toast.show(message, {
            duration: Toast.durations.SHORT,
        });
    }
};

export const showToastWithGravityAndOffset = (message: string) => {
    if (Platform.OS === 'android') {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );
    } else {
        let toast = Toast.show(message, {
            duration: Toast.durations.SHORT,
        });
    }
};

