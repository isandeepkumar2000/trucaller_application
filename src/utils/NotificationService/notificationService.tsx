import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {Alert} from 'react-native';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getFCMToken();
  }
}

export const getFCMToken = async () => {
  let FCMToken = await AsyncStorage.getItem('FcmToken');
  console.log(FCMToken, 'the old Token');
  if (!FCMToken) {
    try {
      const FCMToken = await messaging().getToken();
      if (FCMToken) {
        console.log('the New Generate FCM token status get:', FCMToken);
        await AsyncStorage.setItem('FcmToken', FCMToken);
      }
    } catch (error) {
      console.log(error, 'error raised in FCM Token');
    }
  }
};

export const NotificationListner = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  messaging().onMessage(async remoteMessage => {
    console.log('received in forground remoteMessage', remoteMessage);
    Alert.alert(
      'A new FCM message arrived! in forground mode',
      JSON.stringify(remoteMessage),
    );
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
};
