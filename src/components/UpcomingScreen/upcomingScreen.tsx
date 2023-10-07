import React, {useState} from 'react';
import {useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import PastEvent from './PastEvent/pastEvent';
import UpcomingEvents from './UpcomingEvents/upcomingEvents';
import {observer} from 'mobx-react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {styles} from './upcomingScreenStyle';
import {homePageStore} from '../../Store/HomePageStore/storeHomePage';

const UpcomingScreen = observer(() => {
  const imageUrl =
    homePageStore.profilePic ||
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTul_uww9SaBJW6cIxV_KEOK0nabcl99DJHeA&usqp=CAU';

  const route = useRoute();
  const {firstname, lastname, id, joining_date} = route.params;
  const [activeComponent, setActiveComponent] = useState('UpcomingEvents');

  const switchToUpcomingEvents = () => {
    setActiveComponent('UpcomingEvents');
  };

  const switchToPastEvent = () => {
    setActiveComponent('PastEvent');
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.topBar}>
          <View style={styles.headerImage}>
            <Image
              source={{uri: imageUrl}}
              style={{
                width: 86,
                height: 86,
                borderRadius: 60,
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: '#fff',
                borderWidth: 5,
              }}
              resizeMode="cover"
            />

            <View style={{marginLeft: 20}}>
              <Text
                style={styles.nameHeading}>{`${firstname} ${lastname}`}</Text>
              <Text style={[styles.EnrolledDate]}>
                Enrolled on {joining_date}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.parentRow, {backgroundColor: '#ECEFF8'}]}>
          <View style={styles.buttonContainer}>
            <TouchableHighlight
              onPress={switchToUpcomingEvents}
              style={[
                styles.button,
                {
                  backgroundColor:
                    activeComponent === 'UpcomingEvents'
                      ? '#2196F3'
                      : '#70B8FB',
                  width: 'auto',
                  paddingTop: 20,
                  borderRadius: 50,
                  height: 60,
                  position: 'relative',
                },
              ]}>
              <>
                <>
                  {activeComponent === 'UpcomingEvents' && (
                    <Text style={{position: 'absolute', top: 40, left: 70}}>
                      <Icon
                        name="caret-down"
                        size={50}
                        style={{color: '#2196F3'}}
                      />
                    </Text>
                  )}

                  <Text style={styles.buttonText}>Upcoming Event </Text>
                </>
              </>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={switchToPastEvent}
              style={[
                styles.button,
                {
                  backgroundColor:
                    activeComponent === 'PastEvent' ? '#2196F3' : '#70B8FB',
                  width: 'auto',
                  paddingTop: 20,
                  borderRadius: 50,
                  height: 60,
                },
              ]}>
              <>
                {activeComponent === 'PastEvent' && (
                  <Text style={{position: 'absolute', top: 40, left: 70}}>
                    <Icon
                      name="caret-down"
                      size={50}
                      style={{color: '#2196F3'}}
                    />
                  </Text>
                )}
                <Text style={styles.buttonText}>Past Event</Text>
              </>
            </TouchableHighlight>
          </View>
          {activeComponent === 'UpcomingEvents' && (
            <View>
              <UpcomingEvents id={id} />
            </View>
          )}
          {activeComponent === 'PastEvent' && <PastEvent id={id} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

export default UpcomingScreen;
