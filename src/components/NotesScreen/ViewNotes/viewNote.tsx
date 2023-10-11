import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {observer} from 'mobx-react';
import {styles} from './viewNotesStyle';
import {addNotesStore} from '../../../Store/AddNotesStore/addNotesStore';

import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from 'react-native';
import {performDeleteOperation} from '../../../utils/ApiFunctionCalls/apiFunctionCalls';

interface ViewNotesProps {
  id: number;
}

export const ViewNotes: React.FC<ViewNotesProps> = observer(({id}) => {
  const fetchStudentData = async () => {
    addNotesStore.setIsLoading(true);
    try {
      const apiUrlFromStorage = await AsyncStorage.getItem('selectedItemInfo');
      if (apiUrlFromStorage) {
        const apiUrl = JSON.parse(apiUrlFromStorage).apiUrl;
        const requestBody = {
          studentKey: id,
        };
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(apiUrl + 'view-student-notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });
        const responseBody = await response.json();

        if (response.ok) {
          const notes = responseBody.data || [];
          addNotesStore.setAddNotesData(notes);
        } else {
          const errorMessage = `Error: ${response.status} - ${response.statusText}`;
          ToastAndroid.show(errorMessage, ToastAndroid.LONG);
        }
      }
    } catch (error) {
      ToastAndroid.show(
        'An error occurred while fetching student data.',
        ToastAndroid.LONG,
      );
    } finally {
      addNotesStore.setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [id]);

  const toggleAccordion = (index: number) => {
    addNotesStore.toggleAccordion(index);
  };

  const deleteNote = async (noteId: number) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await performDeleteOperation(noteId);
              addNotesStore.deleteNote(noteId);
            } catch (error) {}
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {addNotesStore.isLoading ? (
          <ActivityIndicator size="large" color="#B6488D" />
        ) : (
          <View style={styles.container}>
            {addNotesStore.addNotesData.map((item: any, index: any) => (
              <View key={item.note_id || index} style={[styles.eventRow]}>
                {item.raised_flag === null || item.raised_flag === '' ? (
                  <View
                    style={[
                      styles.eventLeft,
                      {
                        backgroundColor:
                          item.raised_flag === 'yellow'
                            ? 'yellow'
                            : item.raised_flag === 'golden'
                            ? 'gold'
                            : item.is_new_registration_flag === 1
                            ? '#00FFFF'
                            : '#cfcfcf',
                      },
                    ]}>
                    <TouchableOpacity
                      disabled={false}
                      onPress={() => deleteNote(item.note_id)}
                      style={[styles.iconStyle]}>
                      <Icon
                        name="trash"
                        size={20}
                        style={{
                          color:
                            item.raised_flag === 'yellow' ? 'black' : '#fff',
                          fontSize: 0,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ) : item.raised_flag === 'golden' ? (
                  <TouchableOpacity
                    onPress={() => deleteNote(item.note_id)}
                    style={[
                      styles.eventLeft,
                      {
                        backgroundColor: 'gold',
                      },
                    ]}>
                    <TouchableOpacity style={styles.iconStyle}>
                      <Icon
                        name="trash"
                        size={20}
                        style={{
                          color:
                            item.raised_flag === 'yellow' ? '#363636' : '#fff',
                        }}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => deleteNote(item.note_id)}
                    style={[
                      styles.eventLeft,
                      {
                        backgroundColor: item.raised_flag,
                      },
                    ]}>
                    <TouchableOpacity style={styles.iconStyle}>
                      <Icon
                        name="trash"
                        size={20}
                        style={{
                          color:
                            item.raised_flag === 'yellow' ? 'black' : '#fff',
                        }}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}

                <View style={[styles.eventRight]}>
                  <Text style={[styles.eventLeftHeading]}>
                    {item.notes_added_by}{' '}
                    <Text
                      style={[
                        styles.eventSubDetail,
                        {paddingLeft: 0, fontSize: 14, fontWeight: 'normal'},
                      ]}>
                      {'('}
                      {item.flag_added_date}
                      {')'}
                    </Text>
                  </Text>
                  {addNotesStore.expandedIndex === index ? (
                    <Text style={styles.eventSubDetail}>{item.notes}</Text>
                  ) : (
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.eventSubDetail}>
                      {item.notes}
                    </Text>
                  )}
                  <TouchableOpacity
                    onPress={() => toggleAccordion(index)}
                    style={styles.viewMoreButton}>
                    <Text style={styles.viewMoreButtonText}>
                      {addNotesStore.expandedIndex === index
                        ? 'View Less..'
                        : 'View More..'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
});
