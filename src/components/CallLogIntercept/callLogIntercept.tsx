import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {View, PermissionsAndroid, ToastAndroid, Alert} from 'react-native';
import CallDetectorManager from 'react-native-call-detection';

interface CallLogEntry {
  event: string;
  number: string;
}

const CallLogAccessFile: React.FC = () => {
  // const [callLogData, setCallLogData] = useState<[]>([]);
  // console.log(callLogData, 'callLogData');

  const fetchingPastEventsData = async (number: string) => {
    try {
      const apiUrlFromStorage = await AsyncStorage.getItem('selectedItemInfo');
      if (apiUrlFromStorage) {
        const apiUrl = JSON.parse(apiUrlFromStorage).apiUrl;
        const requestBody = {
          phone_number: number,
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
        console.log('response Names (Console):', response);
        if (response.ok) {
          const responseData = await response.json();
          const studentName = responseData.student_names;
          const parentName = responseData.parent_name;

          // Alert.alert(
          //   'Student Name',
          //   `Student Name: ${studentName} ${parentName}`,
          // );

          // setCallLogData(responseData);
        } else {
          console.log('API Error:', response.status);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

  return <View></View>;
};

export default CallLogAccessFile;
