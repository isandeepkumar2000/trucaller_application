import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AddNotesSection} from './AddNotes/addNotesSection';
import {styles} from './notesScreenStyle';
import {observer} from 'mobx-react';
import {ViewNotes} from './ViewNotes/viewNote';
import {
  View,
  Text,
  TouchableHighlight,
  SafeAreaView,
  ScrollView,
  useColorScheme,
} from 'react-native';

const NotesScreen = observer(() => {
  const colorScheme = useColorScheme();
  const dynamicStyles = styles(colorScheme);
  const route = useRoute();
  const {firstname, lastname, id, joining_date} = route.params;
  const [activeComponent, setActiveComponent] = useState('AddNotes');

  const switchToAddNotes = () => {
    setActiveComponent('AddNotes');
  };

  const switchToViewNotes = () => {
    setActiveComponent('ViewNotes');
  };

  return (
    <SafeAreaView style={dynamicStyles.notessafeAreaView}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{backgroundColor: '#ECEFF8'}}>
        <View style={[dynamicStyles.header]}>
          <Text
            style={
              dynamicStyles.nameHeading
            }>{`${firstname} ${lastname}`}</Text>

          <Text style={dynamicStyles.EnrolledDate}>
            Enrolled on {`${joining_date}`}
          </Text>
        </View>

        <View style={[dynamicStyles.parentRow, {backgroundColor: '#ECEFF8'}]}>
          <View style={dynamicStyles.buttonContainer}>
            <TouchableHighlight
              onPress={switchToAddNotes}
              style={[
                dynamicStyles.button,
                {
                  backgroundColor:
                    activeComponent === 'AddNotes' ? '#2196F3' : '#70B8FB',
                  width: 'auto',
                  paddingTop: 20,
                  borderTopLeftRadius: 50,
                  borderTopRightRadius: 50,
                  borderBottomRightRadius: 50,
                  borderBottomLeftRadius: 50,
                  height: 60,
                  position: 'relative',
                },
              ]}>
              <>
                {activeComponent === 'AddNotes' && (
                  <Text style={{position: 'absolute', top: 40, left: 70}}>
                    <Icon
                      name="caret-down"
                      size={50}
                      style={{color: '#2196F3'}}
                    />
                  </Text>
                )}

                <Text style={dynamicStyles.buttonText}>New Note</Text>
              </>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={switchToViewNotes}
              style={[
                dynamicStyles.button,
                {
                  backgroundColor:
                    activeComponent === 'ViewNotes' ? '#2196F3' : '#70B8FB',
                  width: 'auto',
                  paddingTop: 20,
                  borderTopLeftRadius: 50,
                  borderTopRightRadius: 50,
                  borderBottomRightRadius: 50,
                  borderBottomLeftRadius: 50,
                  height: 60,
                },
              ]}>
              <>
                {activeComponent === 'ViewNotes' && (
                  <Text style={{position: 'absolute', top: 40, left: 70}}>
                    <Icon
                      name="caret-down"
                      size={50}
                      style={{color: '#2196F3'}}
                    />
                  </Text>
                )}
                <Text style={dynamicStyles.buttonText}>View Notes</Text>
              </>
            </TouchableHighlight>
          </View>
          {activeComponent === 'AddNotes' && (
            <View>
              <AddNotesSection id={id} />
            </View>
          )}
          {activeComponent === 'ViewNotes' && <ViewNotes id={id} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

export default NotesScreen;
