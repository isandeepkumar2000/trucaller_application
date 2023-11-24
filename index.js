import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AndroidColor,
  EventType,
} from '@notifee/react-native';
import {name as appName} from './app.json';
import App from './src/App';

notifee.onBackgroundEvent(async ({type, detail, event}) => {
  console.log('Background Event:', event);
  const {notification, pressAction} = detail;

  if (
    type === notifee.BackgroundEventType &&
    EventType.ACTION_PRESS &&
    pressAction.id === 'mark-as-read'
  ) {
    const notificationId = event.detail.notification.id;
    await notifee.cancelNotification(notificationId);
    console.log('Notification cleared:', notificationId);
  }
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(
    'Message handled in the background:',
    JSON.stringify(remoteMessage.data),
  );
  DisplayNotification(remoteMessage);
});

const DisplayNotification = async remoteMessage => {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    actions: [
      {
        title: 'Mark as Read',
        pressAction: {
          id: 'read',
        },
      },
    ],
  });

  await notifee.displayNotification({
    title: remoteMessage.data.title,
    body: remoteMessage.data.body,
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
