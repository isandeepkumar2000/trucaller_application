import React from 'react';
import {View, Text, Linking} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {StudentFlagsData} from '../../../utils/Color_Folder/students_Flag';
import {Student} from '../../../utils/DataType/students_Data_Type';
import {observer} from 'mobx-react';
import {useNavigation} from '@react-navigation/native';
import {statusLabels} from '../../../utils/statusLabel/statusLabel';
import {Pressable} from 'react-native';
import {styles} from './studentListStyle';

interface StudentListComponentProps {
  fetchedDataa: Student[];
}

const StudentListComponent: React.FC<StudentListComponentProps> = observer(
  ({fetchedDataa}) => {
    const navigation = useNavigation();

    const handleAddNotes = (
      firstname: string,
      lastname: string,
      id: string,
      joining_date: string,
    ) => {
      navigation.navigate('NotesScreen', {
        firstname,
        lastname,
        id,
        joining_date,
      });
    };

    const handleUpcomingNotes = (
      firstname: string,
      lastname: string,
      id: string,
      joining_date: string,
    ) => {
      navigation.navigate('UpcomingNotesScreen', {
        firstname,
        lastname,
        id,
        joining_date,
      });
    };

    return (
      <>
        {fetchedDataa.map((item: any) => (
          <View key={item.id} style={styles.parentRow}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
              }}>
              <Text
                style={{
                  backgroundColor: statusLabels[item.status]?.backgroundColor,
                  color: statusLabels[item.status]?.color,
                  paddingTop: 8,
                  paddingBottom: 8,
                  paddingRight: 20,
                  paddingLeft: 20,
                  borderTopRightRadius: 8,
                }}>
                {statusLabels[item.status]?.label}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 10,
              }}>
              <View>
                <Text style={styles.studentName}>
                  {item.firstname} {item.lastname}
                </Text>
                <Text style={styles.franchisee}>
                  <Text>{item.joining_date}</Text>
                </Text>
              </View>
            </View>

            <View>
              {item.parent_details.map((subItem: any, subIndex: number) => (
                <View key={subIndex} style={styles.parentDetails}>
                  <Text style={styles.parentText}>
                    {subItem.firstname} {subItem.lastname}
                  </Text>
                  <Pressable
                    onPress={() => {
                      const phoneNumber = subItem.phone;
                      const countryCode = subItem.phone_country;
                      if (phoneNumber && countryCode) {
                        const fullPhoneNumber = `${countryCode}${phoneNumber}`;
                        Linking.openURL(`tel:${fullPhoneNumber}`)
                          .then(() => {})
                          .catch(error => {});
                      }
                    }}
                    disabled={false}
                    style={[styles.button, {marginBottom: 10, marginRight: 8}]}>
                    <Icon name="phone" size={18} style={styles.phoneIcon} />
                  </Pressable>
                </View>
              ))}
            </View>

            <View
              style={[
                styles.buttonContainer,
                {
                  borderBottomWidth: 1,
                  marginTop: 5,
                  borderStyle: 'dashed',
                  paddingBottom: 20,
                  borderColor: '#BFBFBF',
                },
              ]}>
              {item.feedback_flag === 1 ? (
                <Pressable disabled={true} style={[styles.button]}>
                  <Text
                    style={[
                      styles.buttonText,
                      {borderRadius: 5, backgroundColor: '#8BC34A'},
                    ]}>
                    Feedback Pending
                  </Text>
                </Pressable>
              ) : null}

              {item.courier_flag === 1 ? (
                <Pressable disabled={true} style={[styles.button]}>
                  <Text
                    style={[
                      styles.buttonText,
                      {borderRadius: 5, backgroundColor: '#2196F3'},
                    ]}>
                    Courier Pending
                  </Text>
                </Pressable>
              ) : null}

              {item.improvement_session_flag === 1 ? (
                <Pressable disabled={true} style={[styles.button]}>
                  <Text
                    style={[
                      styles.buttonText,
                      {borderRadius: 5, backgroundColor: '#2196F3'},
                    ]}>
                    Improvement Session Flag
                  </Text>
                </Pressable>
              ) : null}

              {item.meeting_flag === 1 ? (
                <Pressable disabled={true} style={[styles.button]}>
                  <Text
                    style={[
                      styles.buttonText,
                      {borderRadius: 5, backgroundColor: '#9C27B0'},
                    ]}>
                    Meeting Flag
                  </Text>
                </Pressable>
              ) : null}

              {item.payment_flag === 1 ? (
                <Pressable disabled={true} style={[styles.button]}>
                  <Text
                    style={[
                      styles.buttonText,
                      {borderRadius: 5, backgroundColor: '#F44336'},
                    ]}>
                    Payment Pending
                  </Text>
                </Pressable>
              ) : null}

              {item.makeup_flag === 1 ? (
                <Pressable disabled={true} style={[styles.button]}>
                  <Text
                    style={[
                      styles.buttonText,
                      {borderRadius: 5, backgroundColor: '#F3CF51'},
                    ]}>
                    Makeup Session Needed
                  </Text>
                </Pressable>
              ) : null}

              {item.attendance_flag === 1 ? (
                <Pressable disabled={true} style={[styles.button]}>
                  <Text
                    style={[
                      styles.buttonText,
                      {borderRadius: 5, backgroundColor: '#607D8B'},
                    ]}>
                    Absent without Notice
                  </Text>
                </Pressable>
              ) : null}
            </View>

            <View
              style={[
                styles.buttonContainer,
                {paddingTop: 20, paddingBottom: 30, borderColor: '#BFBFBF'},
              ]}>
              {item.notes_flags.map((flagText: any, index: any) => (
                <View
                  key={index}
                  style={[
                    styles.studentFlags,
                    {
                      backgroundColor: StudentFlagsData[flagText],
                      borderWidth: 1,
                      borderColor: '#000',
                      borderStyle: 'solid',
                    },
                  ]}></View>
              ))}
            </View>

            {/* Footer buttons section */}
            <View style={styles.footerButtons}>
              <Pressable style={{width:'48%'}}>
                <View>
                  <Pressable
                  style={[styles.footerButton,  {width:'100%', justifyContent:'center'}]}
                    onPress={() =>
                      handleAddNotes(
                        item.firstname,
                        item.lastname,
                        item.id,
                        item.joining_date,
                      )
                    }>
                      <Icon name="copy" size={18} style={styles.footerButtonIcon} />
                    <Text style={styles.footerButtonText}>Notes</Text>
                  </Pressable>
                </View>
              </Pressable>

              <Pressable style={{width:'48%'}}>
                <View>
                  <Pressable
                  style={[
                    styles.footerButton,
                    {
                      backgroundColor: '#057FE1',
                      width:'100%',
                      justifyContent:'center'
                    },
                  ]}
                    onPress={() =>
                      handleUpcomingNotes(
                        item.firstname,
                        item.lastname,
                        item.id,
                        item.joining_date,
                      )
                    }>
                       <Icon
                    name="calendar"
                    size={18}
                    style={styles.footerButtonIcon}
                  />
                    <Text style={styles.footerButtonText}> Events</Text>
                  </Pressable>
                </View>
              </Pressable>
            </View>
          </View>
        ))}
      </>
    );
  },
);

export default StudentListComponent;
