import React from 'react';
import {ToastAndroid, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {observer} from 'mobx-react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AttendanceStatusCode} from '../../utils/AttendanceStatusCode/attendanceStatusCode';

import {styles} from './updateAttendanceScreenStyle';
import {upcomingEventStore} from '../../Store/UpcomingEventStore/upComingEventStore';

interface UpdateUpcomingAttendanceProps {
  eventId: number;
  id: number;
  attendanceApiStatus: string;
}

const UpdateUpcomingAttendance: React.FC<UpdateUpcomingAttendanceProps> =
  observer(({eventId, attendanceApiStatus, id}) => {
    const fetchingUpcomingAttendanceStatus = async (selectedItem: string) => {
      try {
        const apiUrlFromStorage = await AsyncStorage.getItem(
          'selectedItemInfo',
        );
        if (apiUrlFromStorage) {
          const apiUrl = JSON.parse(apiUrlFromStorage).apiUrl;

          const requestBody = {
            studentKey: id,
            eventKey: eventId,
            attendance: selectedItem,
          };

          const token = await AsyncStorage.getItem('token');
          const response = await fetch(
            apiUrl + 'update-upcoming-event-attendance',
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
            const updatedAttendanceStatus = responseData.data || '';

            upcomingEventStore.setSelectedValue(updatedAttendanceStatus);

            ToastAndroid.show(
              'Attendance status updated successfully',
              ToastAndroid.LONG,
            );
          } else {
            // const responseBody = await response.text();
            ToastAndroid.show(
              'Failed to update attendance status',
              ToastAndroid.LONG,
            );
          }
        }
      } catch (error) {
        ToastAndroid.show(
          'An error occurred while updating attendance status',
          ToastAndroid.LONG,
        );
      }
    };

    return (
      <View>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.dropdownIcon}
          data={AttendanceStatusCode}
          backgroundColor={'transparent'}
          dropdownPosition={'top'}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={
            attendanceApiStatus == '1'
              ? 'Present'
              : attendanceApiStatus == '2'
              ? 'Absent'
              : attendanceApiStatus == '3'
              ? 'Absent With Notice'
              : attendanceApiStatus == '5' || attendanceApiStatus == 'null'
              ? 'Unrecorded'
              : 'Unrecorded'
          }
          searchPlaceholder="Search..."
          value={upcomingEventStore.selectedValue}
          onChange={async selectedItem => {
            fetchingUpcomingAttendanceStatus(selectedItem.value);
          }}
        />
      </View>
    );
  });

export default UpdateUpcomingAttendance;
