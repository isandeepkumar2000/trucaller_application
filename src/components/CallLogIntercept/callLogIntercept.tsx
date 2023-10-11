import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import CallDetectorManager from 'react-native-call-detection';

interface CallLogEntry {
  event: string;
  number: string;
}

const CallLogAccessFile: React.FC = () => {
  const [callLog, setCallLog] = useState<CallLogEntry[]>([]);

  const fetchingPastEventsData = async (number: string | null) => {
    try {
      const apiUrlFromStorage = await AsyncStorage.getItem('selectedItemInfo');
      if (apiUrlFromStorage) {
        const apiUrl = JSON.parse(apiUrlFromStorage).apiUrl;
        const requestBody = {
          studentKey: number,
        };

        const token = await AsyncStorage.getItem('token');

        const response = await fetch(
          apiUrl + 'get-student-search-list-by-phone',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
          },
        );

        if (response.ok) {
          const responseData = await response.json();
          const pastEventData = responseData.data || [];
        } else {
          const errorMessage = `Error: ${response.status} - ${response.statusText}`;
          ToastAndroid.show(errorMessage, ToastAndroid.LONG);
        }
      }
    } catch (error) {
      ToastAndroid.show(
        'An error occurred while fetching data.',
        ToastAndroid.LONG,
      );
    }
  };

  useEffect(() => {
    let callDetector: CallDetectorManager | null = null;

    const handleCallEvent = (event: string, number: string | null) => {
      if (event && number) {
        const callEntry: CallLogEntry = {event, number};
        setCallLog(prevCallLog => [...prevCallLog, callEntry]);
        console.log(`Event: ${event}, Number: ${number}`);
        fetchingPastEventsData(number);
      }
    };

    const requestPhoneStatePermission = async () => {
      try {
        const rationale: PermissionsAndroid.Rationale = {
          title: 'Phone State Permission',
          message: 'This app needs access to your phone state and call logs',
          buttonPositive: 'OK',
        };

        const grantedPhoneState = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
          rationale,
        );

        const grantedCallLog = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
          rationale,
        );

        if (
          grantedPhoneState === PermissionsAndroid.RESULTS.GRANTED &&
          grantedCallLog === PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions Accepted by User');
          callDetector = new CallDetectorManager(handleCallEvent, true);
        } else {
          console.log('Permissions denied by user');
        }
      } catch (error) {
        console.error('Error requesting permissions:', error);
      }
    };

    requestPhoneStatePermission();

    return () => {
      if (callDetector) {
        callDetector.dispose();
      }
    };
  }, []);

  return (
    <View>
      <Text>Call Log:</Text>
      <FlatList
        data={callLog}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <View>
            <Text>Event: {item.event}</Text>
            <Text>Number: {item.number}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default CallLogAccessFile;
