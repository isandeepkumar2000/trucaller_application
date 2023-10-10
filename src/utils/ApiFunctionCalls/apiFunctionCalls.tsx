import AsyncStorage from '@react-native-async-storage/async-storage';
import {homePageStore} from '../../Store/HomePageStore/storeHomePage';
import {ToastAndroid} from 'react-native';

export const performDeleteOperation = async (noteId: any) => {
  try {
    const apiUrlFromStorage = await AsyncStorage.getItem('selectedItemInfo');
    if (apiUrlFromStorage) {
      const apiUrl = JSON.parse(apiUrlFromStorage).apiUrl;
      const token = await AsyncStorage.getItem('token');
      const requestBody = {
        noteKey: noteId,
      };

      const response = await fetch(apiUrl + `delete-student-note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log('Note deleted successfully');
      } else {
        console.error(`Error: ${response.status} - ${response.statusText}`);
      }
    }
  } catch (error) {
    console.error('An error occurred while deleting the note:', error);
  }
};
