import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, AndroidColor} from '@notifee/react-native';
import {name as appName} from './app.json';
import App from './src/App';
import AsyncStorage from '@react-native-async-storage/async-storage';

notifee.onBackgroundEvent(async event => {
  console.log('Background Event:', event);

  if (event.type === notifee.BackgroundEventType) {
    console.log(
      'Notification Pressed in Background:',
      event.detail.notification,
    );
  }
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(
    'Message handled in the background:',
    JSON.stringify(remoteMessage),
  );
  displayNotification(remoteMessage);

  const {body, title} = remoteMessage.notification;

  await AsyncStorage.setItem('notificationBody', body);
  await AsyncStorage.setItem('notificationTitle', title);
});

const displayNotification = async notificationData => {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
  const storedNotificationTitle = await AsyncStorage.getItem(
    'notificationTitle',
  );
  const storedNotificationBody = await AsyncStorage.getItem('notificationBody');
  await notifee.displayNotification({
    title: notificationData.title ?? storedNotificationTitle,
    body: notificationData.body ?? storedNotificationBody,
    android: {
      channelId,
      color: AndroidColor.RED,
      importance: AndroidImportance.HIGH,
      showTimestamp: true,
      timestamp: Date.now(),
    },
  });
};

AppRegistry.registerComponent(appName, () => App);
