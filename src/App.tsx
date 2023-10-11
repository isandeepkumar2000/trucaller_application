import React, {useEffect, useState} from 'react';
import {action, runInAction} from 'mobx';
import {observer} from 'mobx-react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import StudentList from './components/HomeScreen/homeScreen';
import NotesScreen from './components/NotesScreen/notesScreen';
import UpcomingScreen from './components/UpcomingScreen/upcomingScreen';
import LoginScreen from './components/LoginScreen/loginFormScreen';
import authStore from './Store/LogicAuthStore/authStore';

import {
  ActivityIndicator,
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

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
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
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
          {/* <AuthStack.Screen
            name="CallLogAccessFile"
            component={CallLogAccessFile}
          /> */}
        </AuthStack.Navigator>
      )}
      {authStore.isLoggedIn && (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="power-off" size={22} color="white" />
        </TouchableOpacity>
      )}
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
});

export default App;
