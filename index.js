import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, AndroidColor} from '@notifee/react-native';
import {name as appName} from './app.json';
import App from './src/App';

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
  console.log('Message handled in the background:', remoteMessage);
  displayNotification(remoteMessage.data);
});

notifee.registerForegroundService(async notification => {
  return new Promise(() => {
    console.log('Foreground Service Notification:', notification);

    notifee.displayNotification({
      id: notification.id,
      title: notification.title,
      body: notification.body,
      android: {
        channelId: 'default',
        asForegroundService: true,
        color: AndroidColor.RED,
        importance: AndroidImportance.HIGH,
      },
    });
  });
});

const displayNotification = async notificationData => {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: notificationData.title ?? 'Hello Duniya',
    body: notificationData.body ?? 'Ohh No!',
    android: {
      channelId,
      // asForegroundService: true,
      color: AndroidColor.RED,
      importance: AndroidImportance.HIGH,
      showTimestamp: true,
      timestamp: Date.now(),
    },
  });
};

AppRegistry.registerComponent(appName, () => App);
