import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import StudentList from './components/HomeScreen/homeScreen';
import NotesScreen from './components/NotesScreen/notesScreen';
import UpcomingScreen from './components/UpcomingScreen/upcomingScreen';
import LoginScreen from './components/LoginScreen/loginFormScreen';
import authStore from './Store/LogicAuthStore/authStore';
import React, {useEffect, useState} from 'react';
import {action, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import CallDetectorManager from 'react-native-call-detection';

import {
  ActivityIndicator,
  View,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Text,
  Modal,
  ToastAndroid,
} from 'react-native';
import callStore, {
  fetchingPastEventsData,
} from './Store/CallLogsStore/callLogsStore';
import {homePageStore} from './Store/HomePageStore/storeHomePage';
import {Pressable} from 'react-native';
import {
  NotificationListner,
  getFCMToken,
  requestUserPermission,
} from './utils/NotificationService/notificationService';

const MainStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

function MainScreens() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <MainStack.Screen
        name="studentList"
        component={StudentList}
        options={{
          headerShown: true,
          headerTitleStyle: {color: '#fff'},
          headerTitleAlign: 'center',
          headerTitle: 'Search Student List',
          headerStyle: {backgroundColor: '#b6488d'},
          headerTintColor: 'white',
          headerShadowVisible: false,
        }}
      />
      <MainStack.Screen
        name="NotesScreen"
        component={NotesScreen}
        options={{
          headerShown: true,
          headerTitleStyle: {color: '#fff'},
          headerTitleAlign: 'center',
          headerTitle: 'Student Notes',
          headerStyle: {backgroundColor: '#b6488d'},
          headerTintColor: 'white',
          headerShadowVisible: false,
        }}
      />
      <MainStack.Screen
        name="UpcomingNotesScreen"
        component={UpcomingScreen}
        options={{
          headerShown: true,
          headerTitleStyle: {color: '#fff'},
          headerTitleAlign: 'center',
          headerTitle: 'Event Calendar',
          headerStyle: {backgroundColor: '#b6488d'},
          headerTintColor: 'white',
          headerShadowVisible: false,
        }}
      />
    </MainStack.Navigator>
  );
}

const LoaderComponent = () => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color="#b6488d" />
  </View>
);

const App = observer(() => {
  useEffect(() => {
    requestUserPermission();
    getFCMToken();
    NotificationListner();
  }, []);

  useEffect(() => {
    let callDetector: CallDetectorManager | null = null;

    const handleCallEvent = (event: string, number: string | null) => {
      if (event && number) {
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

  const handleLogout = action(async () => {
    try {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              try {
                await AsyncStorage.removeItem('token');
                await AsyncStorage.removeItem('isUserLoggedIn');
                runInAction(() => {
                  authStore.isLoggedIn = false;
                });
              } catch (error) {
                console.error(error);
              }
            },
          },
        ],
        {cancelable: false},
      );
    } catch (error) {
      console.error(error);
    }
  });

  useEffect(() => {
    AsyncStorage.getItem('isUserLoggedIn').then(isLoggedIn => {
      if (isLoggedIn === 'true') {
        runInAction(() => {
          authStore.isLoggedIn = true;
        });
      }
      callStore.setIsAppLoading(false);
    });
  }, []);

  if (callStore.isAppLoading) {
    return <LoaderComponent />;
  }

  return (
    <NavigationContainer>
      {authStore.isLoggedIn ? (
        <MainScreens />
      ) : (
        <AuthStack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
        </AuthStack.Navigator>
      )}
      {authStore.isLoggedIn && (
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="power-off" size={22} color="white" />
        </Pressable>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={callStore.modalVisible}
        onRequestClose={() => {
          callStore.setModalVisible(false);
        }}>
        <View
          style={[
            styles.modalContainer,
            {padding: 10, backgroundColor: 'rgba(0,0,0,.8)'},
          ]}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 8,
              display: 'flex',
              padding: 0,
              width: '90%',
            }}>
            <Text
              style={{
                backgroundColor: '#b6488d',
                width: '100%',
                borderTopLeftRadius: 6,
                borderTopRightRadius: 6,
                paddingHorizontal: 20,
                paddingVertical: 12,
                fontSize: 16,
                fontWeight: 'bold',
                color: '#ffffff',
              }}>
              Sip Abacus LMS Modal
            </Text>

            <View
              style={{
                padding: 20,
                paddingBottom: 0,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{fontWeight: 'bold', fontSize: 16, marginBottom: 10}}>
                  Student Name:
                </Text>
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#b6488d',
                  }}>
                  {callStore.studentDetails.studentName}
                </Text>
              </View>
              <View
                style={{
                  marginBottom: 10,
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <Text style={{fontWeight: 'bold', fontSize: 16}}>
                  Parent Name:{' '}
                </Text>
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#b6488d',
                  }}>
                  {callStore.studentDetails.parentName}
                </Text>
              </View>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: 20,
                paddingTop: 0,
              }}>
              <Pressable
                style={[
                  styles.viewDetailsButton,
                  {width: '48%', alignItems: 'center'},
                ]}
                onPress={() => {
                  const {studentName} = callStore.studentDetails;
                  if (studentName) {
                    callStore.setStudentName(studentName);
                    homePageStore.setSearchQuery(studentName);
                    callStore.setModalVisible(false);
                  } else {
                    ToastAndroid.show(
                      'Student name is empty.',
                      ToastAndroid.LONG,
                    );
                  }
                }}>
                <Text
                  style={{color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'}}>
                  View Details
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.closeButton,
                  {
                    width: '48%',
                    alignItems: 'center',
                  },
                ]}
                onPress={() => {
                  callStore.setModalVisible(false);
                }}>
                <Text
                  style={{color: '#FFFFFF', fontSize: 16, fontWeight: 'bold'}}>
                  Close
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* <ForgroundHandler /> */}
    </NavigationContainer>
  );
});

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    padding: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    border: '1px solid black',
    height: 40,
    padding: 35,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 10,
    elevation: 5,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    marginBottom: 0,
    marginTop: 0,
  },
  viewDetailsButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
