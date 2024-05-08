import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {observer} from 'mobx-react';
import {styles} from './viewNotesStyle';
import {addNotesStore} from '../../../Store/AddNotesStore/addNotesStore';
import {ViewNotesProps} from '../../../utils/DataTypeInterface/students_Data_Type';
import {homePageStore} from './../../../Store/HomePageStore/storeHomePage';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
  Alert,
  RefreshControl,
} from 'react-native';

export const ViewNotes: React.FC<ViewNotesProps> = observer(({id}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const performDeleteOperation = async (noteId: any) => {
    setIsDeleting(true);
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
        } else {
          console.error(`Error: ${response.status} - ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('An error occurred while deleting the note:', error);
    }
  };

  const onRefresh = React.useCallback(() => {
    homePageStore.setRefreshing(true);
    fetchViewNotesData();
    setTimeout(() => {
      homePageStore.setRefreshing(false);
    }, 2000);
  }, []);

  const fetchViewNotesData = async () => {
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
        console.log('responseBody', responseBody);

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
        'An error occurred while fetching student data',
        ToastAndroid.LONG,
      );
    } finally {
      addNotesStore.setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchViewNotesData();
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

              ToastAndroid.show(
                'Note successfully deleted ',
                ToastAndroid.LONG,
              );
              setIsDeleting(false);
            } catch (error) {
              console.error('Error deleting note:', error);
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={homePageStore.refreshing}
            onRefresh={onRefresh}
            colors={['#B6488D']}
            tintColor="#B6488D"
            title="Pull to refresh"
            titleColor="#B6488D"
          />
        }>
        {isDeleting || addNotesStore.isLoading ? (
          <ActivityIndicator size="large" color="#B6488D" />
        ) : (
          <View style={styles.container}>
            {addNotesStore.addNotesData.map((item: any, index: any) => (
              <View key={item.note_id || index} style={[styles.eventRow]}>
                {item.is_new_registration_flag === 1 ? (
                  <TouchableOpacity
                    onPress={() => deleteNote(item.note_id)}
                    style={[
                      styles.iconStyle,
                      {
                        backgroundColor: '#00FFFF',
                        borderTopLeftRadius: 25,
                        borderBottomLeftRadius: 25,
                      },
                    ]}>
                    <Icon
                      onPress={() => deleteNote(item.note_id)}
                      name="trash"
                      size={20}
                      style={{color: 'black'}}
                    />
                  </TouchableOpacity>
                ) : item.raised_flag === null ? (
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
                ) : item.raised_flag === 'golden' ||
                  item.is_new_registration_flag === 1 ? (
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
                        onPress={() => deleteNote(item.note_id)}
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
                        onPress={() => deleteNote(item.note_id)}
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
                <View
                  style={[
                    styles.eventRight,
                    item.only_admin === 1
                      ? {paddingTop: 5, paddingBottom: 10}
                      : {paddingTop: 25},
                  ]}>
                  {item.only_admin === 1 ? (
                    <View style={[styles.adminOnlyView]}>
                      <Text style={[styles.adminOnlyText]}>Admin Only</Text>
                    </View>
                  ) : null}
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
                  <View>
                    {item.future_flag_to_be_raised !== null ? (
                      <View style={[styles.RaiseFlagView]}>
                        <Text style={[styles.RaiseFlagText]}>
                          Raise Flag ({item.future_flag_to_be_raised}) -
                          {item.future_flag_to_be_set_from}
                        </Text>
                      </View>
                    ) : null}
                    {item.future_flag_to_be_unset_from !== null ? (
                      <View style={[styles.UnSetRaiseFlagView]}>
                        <Text style={[styles.RaiseFlagText]}>
                          Unset Flag - {item.future_flag_to_be_unset_from}
                        </Text>
                      </View>
                    ) : null}

                    {item.flag_deleted === 1 ? (
                      <View style={[styles.deletedFlagView]}>
                        <Text style={[styles.RaiseFlagText]}>
                          {item.deleted_color} Flag removed by {item.deleted_by}{' '}
                          on {item.flag_deleted_time}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
});
