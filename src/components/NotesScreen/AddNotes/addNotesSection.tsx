import React, {useState} from 'react';
import {observer} from 'mobx-react';
import RadioGroup from 'react-native-radio-buttons-group';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  useColorScheme,
} from 'react-native';
import {addNotesStore} from '../../../Store/AddNotesStore/addNotesStore';
import {AddNotesProps} from '../../../utils/DataTypeInterface/students_Data_Type';

import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableHighlight,
  ToastAndroid,
} from 'react-native';
import {
  AdminOnlyButton,
  FlagNotes,
  FlagSetType,
  FlagUnSetType,
} from '../../../utils/FlagRadioButton/flagRadioButton';
import {styles} from './addNotesstyle';

export const AddNotesSection: React.FC<AddNotesProps> = observer(({id}) => {
  const colorScheme = useColorScheme();
  const dynamicStyles = styles(colorScheme);
  const [minUnsetDate, setMinUnsetDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const {
    studentNotes,
    selectedFlag,
    selectedUnSetTypeFlag,
    selectedSetTypeFlag,
    showFlagSetDatePicker,
    showFlagUnsetDatePicker,
    selectedAdminOnly,
    setStudentNotes,
    setSelectedFlag,
    setSelectedUnSetTypeFlag,
    setSelectedSetTypeFlag,
    setShowFlagSetDatePicker,
    setShowFlagUnsetDatePicker,
    setSelectedAdminOnly,
  } = addNotesStore;

  const onSetChange = (event: Event, selectedDate?: Date) => {
    if (selectedDate) {
      const currentDate = selectedDate;
      setShowFlagSetDatePicker(false);
      addNotesStore.setFlagSetDate(currentDate);
    }
  };

  const onUnsetChange = (event: Event, selectedDate?: Date) => {
    if (selectedDate) {
      const currentDate = selectedDate;
      setShowFlagUnsetDatePicker(false);
      addNotesStore.setFlagUnsetDate(currentDate);
    }
  };

  const showFlagSetDatePickerHandler = () => {
    if (selectedSetTypeFlag === '2') {
      setShowFlagSetDatePicker(true);
    } else if (selectedSetTypeFlag === '1') {
      const currentDate = new Date();
      addNotesStore.setFlagSetDate(currentDate);
    }
  };

  const showFlagUnsetDatePickerHandler = () => {
    if (addNotesStore.flagSetDate) {
      const minimumDate = new Date(addNotesStore.flagSetDate);
      minimumDate.setDate(minimumDate.getDate() + 1);
      setShowFlagUnsetDatePicker(true);
      setMinUnsetDate(minimumDate);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'DD/MM/YYYY';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const getTextColor = () => {
    return colorScheme === 'dark' ? '#b6488d' : '#b6488d';
  };

  const getDateColor = () => {
    return colorScheme === 'dark' ? '#000000' : '#000000';
  };

  const handleRadioButtonChange = (value: string) => {
    setSelectedFlag(value);
  };

  const handleRadioButtonSetChange = (value: string) => {
    setSelectedSetTypeFlag(value);
  };

  const handleRadioButtonUnSetChange = (value: string) => {
    setSelectedUnSetTypeFlag(value);
  };

  const handleRadioButtonAdminOnly = (value: string) => {
    setSelectedAdminOnly(value);
  };

  const onPressCancelButton = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to cancel?',
      [
        {
          text: 'Yes',
          onPress: () => {
            navigation.navigate('studentList');
          },
        },
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  const handleSubmit = async () => {
    try {
      if (!studentNotes) {
        ToastAndroid.showWithGravity(
          'The student notes field is required.',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
        return;
      }
      addNotesStore.setErrorMessage('');
      const apiUrlFromStorage = await AsyncStorage.getItem('selectedItemInfo');
      let flagSetType;
      let flagSetDate;
      let flagUnsetType;
      let flagUnsetDate;
      let studentNotesFlag;
      let adminOnly;

      if (selectedAdminOnly === '1') {
        adminOnly = 'yes';
      } else if (selectedAdminOnly === '2') {
        adminOnly = 'no';
      }

      switch (selectedFlag) {
        case '1':
          studentNotesFlag = 'no_flag';
          break;
        case '2':
          studentNotesFlag = 'new_registration';
          break;
        case '3':
          studentNotesFlag = 'gray';
          break;
        case '4':
          studentNotesFlag = 'blue';
          break;
        case '5':
          studentNotesFlag = 'yellow';
          break;
        case '6':
          studentNotesFlag = 'red';
          break;
        case '7':
          studentNotesFlag = 'green';
          break;
        case '8':
          studentNotesFlag = 'purple';
          break;
        case '9':
          studentNotesFlag = 'orange';
          break;
        case '10':
          studentNotesFlag = 'brown';
          break;
        case '11':
          studentNotesFlag = 'golden';
          break;
        case '12':
          studentNotesFlag = 'pink';
          break;

        default:
          break;
      }

      if (selectedUnSetTypeFlag === '1') {
        flagUnsetType = 'no_unset_date';
        flagUnsetDate = formatDate(new Date());
      } else if (selectedUnSetTypeFlag === '2') {
        flagUnsetType = 'specify_unset_date';
        flagUnsetDate = formatDate(addNotesStore.flagUnsetDate);
      }

      if (selectedSetTypeFlag === '1') {
        flagSetType = 'immediately';
        flagSetDate = formatDate(new Date());
      } else if (selectedSetTypeFlag === '2') {
        flagSetType = 'future_date';
        flagSetDate = formatDate(addNotesStore.flagSetDate);
      }

      if (apiUrlFromStorage) {
        const apiUrl = JSON.parse(apiUrlFromStorage).apiUrl;
        const requestBody = {
          studentKey: id.toString(),
          studentNotes: studentNotes,
          studentNotesFlag: studentNotesFlag,
          flagSetType: flagSetType,
          flagSetDate: flagSetDate,
          flagUnsetType: flagUnsetType,
          flagUnsetDate: flagUnsetDate,
          adminOnly: adminOnly,
        };

        console.log('requestBody', requestBody);
        const token = await AsyncStorage.getItem('token');
        const response = await fetch(apiUrl + 'add-student-notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          setIsLoading(false);
          ToastAndroid.showWithGravity(
            'Data successfully submitted',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
          setSelectedFlag('no_flag');
          setStudentNotes('');
          navigation.navigate('studentList');
        }
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const FlagSetDate = () => {
    return (
      <>
        <View style={{marginTop: 10}}>
          <View
            style={[
              dynamicStyles.flagNotesContainer,
              {marginTop: 10, marginBottom: 0},
            ]}>
            <Text style={dynamicStyles.flagNotesLabel}>Flag set Type</Text>
            <Text style={dynamicStyles.flagNotesDescription}>
              Please select the flag set type here
            </Text>
          </View>
          <RadioGroup
            radioButtons={FlagSetType}
            onPress={handleRadioButtonSetChange}
            selectedId={selectedSetTypeFlag}
            containerStyle={dynamicStyles.radioButtonContainerFlag}
          />
          {selectedSetTypeFlag !== '1' && (
            <>
              <View
                style={[dynamicStyles.flagNotesContainer, {marginBottom: 0}]}>
                <Text style={dynamicStyles.flagNotesLabel}>Flag set Date</Text>
                <Text style={dynamicStyles.flagNotesDescription}>
                  Please select the flag set date here
                </Text>
              </View>
              <View
                style={{
                  borderStyle: 'solid',
                  padding: 5,
                }}>
                <TouchableHighlight
                  onPress={showFlagSetDatePickerHandler}
                  style={dynamicStyles.dateContainer}>
                  <View style={dynamicStyles.datePickerContainer}>
                    <Text style={dynamicStyles.datePickerIcon}>📅</Text>
                    <Text
                      style={[
                        dynamicStyles.selectedDateText,
                        {color: getDateColor()},
                      ]}>
                      {addNotesStore.flagSetDate
                        ? formatDate(addNotesStore.flagSetDate)
                        : 'DD/MM/YYYY'}
                    </Text>
                  </View>
                </TouchableHighlight>
                {showFlagSetDatePicker && (
                  <DateTimePicker
                    testID="flagSetDatePicker"
                    value={addNotesStore.flagSetDate || new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={onSetChange}
                    minimumDate={new Date()}
                  />
                )}
              </View>
            </>
          )}
        </View>
      </>
    );
  };

  const FlatUnsetType = () => {
    return (
      <>
        <View style={[dynamicStyles.flagNotesContainer, {marginBottom: 0}]}>
          <Text style={dynamicStyles.flagNotesLabel}>Flag Unset Type</Text>
          <Text style={dynamicStyles.flagNotesDescription}>
            Please select the flag unset type here
          </Text>
        </View>
        <View>
          <RadioGroup
            radioButtons={FlagUnSetType}
            onPress={handleRadioButtonUnSetChange}
            selectedId={selectedUnSetTypeFlag}
            containerStyle={dynamicStyles.radioButtonContainerFlag}
          />
        </View>

        {selectedUnSetTypeFlag !== '1' && (
          <>
            <View style={dynamicStyles.flagNotesContainer}>
              <Text style={dynamicStyles.flagNotesLabel}>Flag Unset Date</Text>
              <Text style={dynamicStyles.flagNotesDescription}>
                Please select the flag unset date here
              </Text>
            </View>
            <View
              style={{
                borderStyle: 'solid',
                padding: 5,
                // backgroundColor: 'black',
              }}>
              <TouchableHighlight
                onPress={showFlagUnsetDatePickerHandler}
                style={dynamicStyles.dateContainer}>
                <View style={dynamicStyles.datePickerContainer}>
                  <Text style={dynamicStyles.datePickerIcon}>📅</Text>
                  <Text
                    style={[
                      dynamicStyles.selectedDateText,
                      {color: getDateColor()},
                    ]}>
                    {addNotesStore.flagUnsetDate
                      ? formatDate(addNotesStore.flagUnsetDate)
                      : 'DD/MM/YYYY'}
                  </Text>
                </View>
              </TouchableHighlight>
              {showFlagUnsetDatePicker && (
                <DateTimePicker
                  testID="flagUnsetDatePicker"
                  value={addNotesStore.flagUnsetDate || new Date()}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onUnsetChange}
                  minimumDate={minUnsetDate}
                />
              )}
            </View>
          </>
        )}
      </>
    );
  };

  return (
    <View style={dynamicStyles.container}>
      {isLoading && <ActivityIndicator size="large" color="#B6488D" />}
      <View>
        <View style={[dynamicStyles.textInputContainer, {marginTop: 20}]}>
          <TextInput
            multiline
            placeholder="Please enter the notes here"
            style={dynamicStyles.textInput}
            value={studentNotes}
            onChangeText={text => setStudentNotes(text)}
            placeholderTextColor={getTextColor()}
            // placeholderTextColor={dynamicStyles.textl}
          />
        </View>
      </View>
      <View>
        <View style={dynamicStyles.flagNotesContainer}>
          <Text style={dynamicStyles.flagNotesLabel}>Flag Notes</Text>
          <Text style={dynamicStyles.flagNotesDescription}>
            Please select the note's flag here
          </Text>
        </View>
      </View>
      <RadioGroup
        radioButtons={FlagNotes}
        onPress={handleRadioButtonChange}
        selectedId={selectedFlag}
        containerStyle={dynamicStyles.radioButtonContainer}
      />
      {selectedFlag === 'new_registration' || selectedFlag === '1' ? null : (
        <View>
          {FlagSetDate()}
          {FlatUnsetType()}
        </View>
      )}

      {addNotesStore.errorMessage ? (
        <Text style={dynamicStyles.errorMessage}>
          {addNotesStore.errorMessage}
        </Text>
      ) : null}
      <View style={[dynamicStyles.AdminOnlyNotes]}>
        <Text style={dynamicStyles.flagNotesLabel}>Admin Only</Text>
        <RadioGroup
          radioButtons={AdminOnlyButton}
          onPress={handleRadioButtonAdminOnly}
          selectedId={selectedAdminOnly}
          containerStyle={dynamicStyles.radioButtonContainerFlag}
        />
      </View>

      <View style={dynamicStyles.buttonContainer}>
        <Pressable
          onPress={onPressCancelButton}
          style={({pressed}) => [
            dynamicStyles.button,
            {
              backgroundColor: '#0073DA',
              height: 58,
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              borderBottomRightRadius: 40,
              borderBottomLeftRadius: 40,
            },
          ]}>
          <Text style={dynamicStyles.buttonText}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit}
          style={({pressed}) => [
            dynamicStyles.button,
            {
              backgroundColor: pressed ? 'pink' : '#B6488D',
              marginLeft: 20,
              height: 58,
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              borderBottomRightRadius: 40,
              borderBottomLeftRadius: 40,
            },
          ]}>
          <Text style={dynamicStyles.buttonText}>Submit</Text>
        </Pressable>
      </View>
    </View>
  );
});
