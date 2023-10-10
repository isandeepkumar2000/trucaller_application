import React, {useState} from 'react';
import {observer} from 'mobx-react';
import {styles} from './addNotesstyle';
import RadioGroup from 'react-native-radio-buttons-group';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, Alert, Button} from 'react-native';
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableHighlight,
  ToastAndroid,
} from 'react-native';
import {
  FlagNotes,
  FlagSetType,
  FlagUnSetType,
} from '../../../utils/FlagRadioButton/flagRadioButton';
import {addNotesStore} from '../../../Store/AddNotesStore/addNotesStore';

interface AddNotesProps {
  id: number;
}

const AddNotesSection: React.FC<AddNotesProps> = observer(({id}) => {
  const [minUnsetDate, setMinUnsetDate] = useState<Date>(new Date());

  const navigation = useNavigation();
  const {
    studentNotes,
    selectedFlag,
    selectedUnSetTypeFlag,
    selectedSetTypeFlag,
    showFlagSetDatePicker,
    showFlagUnsetDatePicker,
    setStudentNotes,
    setSelectedFlag,
    setSelectedUnSetTypeFlag,
    setSelectedSetTypeFlag,
    setShowFlagSetDatePicker,
    setShowFlagUnsetDatePicker,
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
    setShowFlagSetDatePicker(true);
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

  const handleRadioButtonChange = (value: string) => {
    setSelectedFlag(value);
  };

  const handleRadioButtonSetChange = (value: string) => {
    setSelectedSetTypeFlag(value);
  };

  const handleRadioButtonUnSetChange = (value: string) => {
    setSelectedUnSetTypeFlag(value);
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
      if (apiUrlFromStorage) {
        const apiUrl = JSON.parse(apiUrlFromStorage).apiUrl;
        const requestBody = {
          studentKey: id.toString(),
          studentNotes: studentNotes,
          studentNotesFlag: selectedFlag,
          flagSetType: selectedSetTypeFlag,
          flagSetDate: formatDate(addNotesStore.flagSetDate),
          flagUnsetType: selectedUnSetTypeFlag,
          flagUnsetDate: formatDate(addNotesStore.flagUnsetDate),
        };

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
      addNotesStore.setIsLoading(false);
    } catch (error) {
      addNotesStore.setIsLoading(false);
    }
  };

  const FlagSetDate = () => {
    return (
      <>
        <View style={{marginTop: 10}}>
          <View
            style={[
              styles.flagNotesContainer,
              {marginTop: 10, marginBottom: 0},
            ]}>
            <Text style={styles.flagNotesLabel}>Flag set Type</Text>
            <Text style={styles.flagNotesDescription}>
              Please select the flag set type here
            </Text>
          </View>
          <RadioGroup
            radioButtons={FlagSetType}
            onPress={handleRadioButtonSetChange}
            selectedId={selectedSetTypeFlag}
            containerStyle={styles.radioButtonContainerFlag}
          />
          {selectedSetTypeFlag !== 'immediately' && (
            <>
              <View style={[styles.flagNotesContainer, {marginBottom: 0}]}>
                <Text style={styles.flagNotesLabel}>Flag set Date</Text>
                <Text style={styles.flagNotesDescription}>
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
                  style={styles.dateContainer}>
                  <View style={styles.datePickerContainer}>
                    <Text style={styles.datePickerIcon}>📅</Text>
                    <Text style={styles.selectedDateText}>
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
        <View style={[styles.flagNotesContainer, {marginBottom: 0}]}>
          <Text style={styles.flagNotesLabel}>Flag Unset Type</Text>
          <Text style={styles.flagNotesDescription}>
            Please select the flag unset type here
          </Text>
        </View>
        <View>
          <RadioGroup
            radioButtons={FlagUnSetType}
            onPress={handleRadioButtonUnSetChange}
            selectedId={selectedUnSetTypeFlag}
            containerStyle={styles.radioButtonContainerFlag}
          />
        </View>

        {selectedUnSetTypeFlag !== 'no_unset_date' && (
          <>
            <View style={styles.flagNotesContainer}>
              <Text style={styles.flagNotesLabel}>Flag Unset Date</Text>
              <Text style={styles.flagNotesDescription}>
                Please select the flag unset date here
              </Text>
            </View>
            <View
              style={{
                borderStyle: 'solid',
                padding: 5,
              }}>
              <TouchableHighlight
                onPress={showFlagUnsetDatePickerHandler}
                style={styles.dateContainer}>
                <View style={styles.datePickerContainer}>
                  <Text style={styles.datePickerIcon}>📅</Text>
                  <Text style={styles.selectedDateText}>
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
    <View style={styles.container}>
      {addNotesStore.isLoading && (
        <ActivityIndicator size="large" color="#B6488D" />
      )}
      <View>
        {/* <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes</Text>
          <Text style={styles.notesDescription}>
            Please enter the notes here
          </Text>
        </View> */}
        <View style={[styles.textInputContainer, {marginTop:20}]}>
          <TextInput
            multiline
            placeholder="Please enter the notes here"
            style={styles.textInput}
            value={studentNotes}
            onChangeText={text => setStudentNotes(text)}
          />
        </View>
      </View>
      <View>
        <View style={styles.flagNotesContainer}>
          <Text style={styles.flagNotesLabel}>Flag Notes</Text>
          <Text style={styles.flagNotesDescription}>
            Please select the note's flag here
          </Text>
        </View>
      </View>
      <RadioGroup
        radioButtons={FlagNotes}
        onPress={handleRadioButtonChange}
        selectedId={selectedFlag}
        containerStyle={styles.radioButtonContainer}
      />
      {selectedFlag === 'new_registration' ||
      selectedFlag === 'no_flag' ? null : (
        <View>
          {FlagSetDate()}
          {FlatUnsetType()}
        </View>
      )}

      {addNotesStore.errorMessage ? (
        <Text style={styles.errorMessage}>{addNotesStore.errorMessage}</Text>
      ) : null}

      <View style={styles.buttonContainer}>
        <Pressable
          onPress={onPressCancelButton}
          style={({pressed}) => [
            styles.button,
            {
              backgroundColor: '#0073DA',
              height: 58,
              borderRadius: 40,
            },
          ]}>
          <Text style={styles.buttonText}>Cancel</Text>
        </Pressable>
        <Pressable
          onPress={handleSubmit}
          style={({pressed}) => [
            styles.button,
            {
              backgroundColor: pressed ? 'pink' : '#B6488D',
              marginLeft: 20,
              height: 58,
              borderRadius: 40,
            },
          ]}>
          <Text style={styles.buttonText}>Add A Note</Text>
        </Pressable>
      </View>
    </View>
  );
});

export default AddNotesSection;
