import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Pressable,
} from 'react-native';
import React, {useEffect} from 'react';
import {observer} from 'mobx-react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import {styles} from './pastEventStyle';
import {upcomingEventStore} from '../../../Store/UpcomingEventStore/upComingEventStore';

interface PastEventProps {
  id: number;
}

const PastEvent: React.FC<PastEventProps> = observer(({id}) => {
  const toggleAccordion = (index: any) => {
    if (upcomingEventStore.expandedIndex === index) {
      upcomingEventStore.setExpandedIndex(null);
    } else {
      upcomingEventStore.setExpandedIndex(index);
    }
  };
  const arrayLength = upcomingEventStore.pastEventData.length;

  const fetchingPastEventsData = async () => {
    upcomingEventStore.setIsLoading(true);
    try {
      const apiUrlFromStorage = await AsyncStorage.getItem('selectedItemInfo');
      if (apiUrlFromStorage) {
        const apiUrl = JSON.parse(apiUrlFromStorage).apiUrl;
        const requestBody = {
          studentKey: id,
        };

        const token = await AsyncStorage.getItem('token');

        const response = await fetch(apiUrl + 'view-student-past-events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const responseData = await response.json();
          const pastEventData = responseData.data || [];
          upcomingEventStore.setPastEventdata(pastEventData);
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
    } finally {
      upcomingEventStore.setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchingPastEventsData();
  }, []);

  return (
    <SafeAreaView style={[styles.saferView]}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {upcomingEventStore.isLoading ? (
          <ActivityIndicator size="large" color="#B6488D" />
        ) : (
          <View>
            <View style={styles.pageHeadingRow}>
              <Text style={styles.pageHeading}>
                Total Events
                <Text style={styles.eventCounting}> ({arrayLength})</Text>
              </Text>
            </View>
            {upcomingEventStore.pastEventData.map((item: any, index: any) => (
              <View
                style={[
                  {
                    marginBottom: 15,
                    padding: 0,
                    paddingBottom: 25,
                    borderRadius: 25,
                    backgroundColor: '#D9EFFF',
                  },
                ]}
                key={item.id || index}>
                <View style={[styles.eventRow, {marginBottom: 0}]}>
                  <View style={styles.eventLeft}>
                    <View>
                      <Text style={styles.eventLeftHeading}>
                        {item.event_type} - [ {item.event_name} -{' '}
                        {item.event_tutor_name} ]
                      </Text>
                    </View>

                    <Text style={styles.eventSubDetail}>
                      {item.event_date}, {item.start_time} to {item.end_time}
                    </Text>
                  </View>
                  <View style={{alignItems: 'center'}}>
                    <Pressable
                      style={styles.iconStyle}
                      onPress={() => toggleAccordion(index)}>
                      {upcomingEventStore.expandedIndex === index ? (
                        <Icon name="minus" size={18} style={{color: '#fff'}} />
                      ) : (
                        <Icon name="plus" size={18} style={{color: '#fff'}} />
                      )}
                    </Pressable>
                  </View>
                </View>
                {upcomingEventStore.expandedIndex === index && (
                  <View style={{borderRadius: 0}}>
                    <View style={[styles.attendenceButton]}>
                      <Text style={[styles.attendenceButtonContent]}>
                        {item.attendance_status}
                      </Text>
                    </View>

                    {/* content starts */}
                    <View style={[styles.lessonNoteRow]}>
                      {/* lesson notes section stats */}
                      <View style={styles.lessonContent}>
                        <Text style={styles.sectionHeading}>Lesson Notes</Text>

                        {item.lesson_notes === '' ? (
                          <Text
                            style={{
                              color: '#0073DA',
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                              fontSize: 16,
                            }}>
                            {item.lesson_notes}
                          </Text>
                        ) : (
                          <Text style={styles.lessonText}>
                            No Notes for this lesson given yet
                          </Text>
                        )}

                        {item.attendance_book ||
                        item.attendance_book_page_no === 1 ? (
                          <View
                            style={[styles.buttonContainer, {marginTop: 5}]}>
                            <TouchableOpacity
                              disabled={true}
                              style={[
                                styles.button,
                                {marginBottom: 10, marginRight: 8},
                              ]}>
                              <Text
                                style={[styles.attendenceButtonContent,
                                  styles.buttonText,
                                  {borderRadius: 5, },
                                ]}>
                                {item.attendance_book}{' '}
                                {item.attendance_book_page_no}{' '}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : null}

                        {item.event_level !== '' ? (
                          <View
                            style={[
                              styles.buttonContainer,
                              {marginTop: 5, marginBottom: 0},
                            ]}>
                            <TouchableOpacity
                              disabled={true}
                              style={[
                                styles.button,
                                {marginBottom: 0, marginRight: 8},
                              ]}>
                              <Text
                                style={[styles.attendenceButtonContent,
                                  styles.buttonText, 
                                  {
                                    borderRadius: 5,
                                    marginBottom: 0,
                                    backgroundColor: '#0A9856',
                                  },
                                ]}>
                                {item.event_level}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : null}
                      </View>
                      <View style={styles.lessonContent}>
                        <Text style={styles.sectionHeading}>
                          Lesson Feedback
                        </Text>
                        {item.lesson_notes === '' ? (
                          <Text style={styles.lessonText}>
                            {' '}
                            {item.lesson_feedback}{' '}
                          </Text>
                        ) : (
                          <Text style={styles.lessonText}>
                            {' '}
                            No Lesson Feedback Given Yet{' '}
                          </Text>
                        )}
                      </View>
                      <View
                        style={[
                          styles.lessonContent,
                          {
                            width: '100%',
                            borderBottomWidth: 0,
                            paddingBottom: 0,

                            marginTop: 5,
                          },
                        ]}>
                        <Text style={styles.sectionHeading}>
                          Group Feedback
                        </Text>

                        {item.group_feedback !== '' ? (
                          <Text style={styles.lessonText}>
                            {' '}
                            {item.group_feedback}{' '}
                          </Text>
                        ) : (
                          <Text style={styles.lessonText}>
                            {' '}
                            No Lesson Feedback Given Yet{' '}
                          </Text>
                        )}

                        {item.group_level_name !== '' ? (
                          <View
                            style={[styles.buttonContainer, {marginTop: 5}]}>
                            <TouchableOpacity
                              disabled={true}
                              style={[
                                styles.button,
                                {marginBottom: 10, marginRight: 8},
                              ]}>
                              <Text
                                style={[styles.attendenceButtonContent,
                                  styles.buttonText,
                                  {borderRadius: 5, backgroundColor: 'orange'},
                                ]}>
                                {item.group_level_name}{' '}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
});

export default PastEvent;
