import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {observer} from 'mobx-react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import StudentList from './components/HomeScreen/homeScreen';
import NotesScreen from './components/NotesScreen/notesScreen';
import UpcomingScreen from './components/UpcomingScreen/upcomingScreen';
import LoginScreen from './components/LoginScreen/loginFormScreen';
import authStore from './Store/LogicAuthStore/authStore';

const MainStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

function MainScreens() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        headerRight: () => (
          <Icon name="power-off" size={24} color="white" style={{ marginRight: 16 }} />
        ),
      }} >
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

  useEffect(() => {
    AsyncStorage.getItem('isUserLoggedIn').then(isLoggedIn => {
      if (isLoggedIn === 'true') {
        authStore.isLoggedIn = true;
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
        </AuthStack.Navigator>
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
});

export default App;
