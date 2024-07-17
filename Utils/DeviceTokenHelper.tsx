import * as Notifications from 'expo-notifications';

export const getDeviceToken = async () => {
     const token = (await Notifications.getDevicePushTokenAsync()).data;
     //  console.log('real device = ');
     return token;
}



