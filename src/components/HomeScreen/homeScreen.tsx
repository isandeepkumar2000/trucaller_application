import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {observer} from 'mobx-react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'lodash.debounce';
import NoDataFound from '../../Images/no_data_found.png';
import {styles} from './homeScreenStyle';
import StudentListComponent from './StudentList/studentList';
import {homePageStore} from '../../Store/HomePageStore/storeHomePage';

import {
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  ToastAndroid,
  Image,
} from 'react-native';

const StudentList = observer(() => {
  const fetchHomePageData = async () => {
    homePageStore.setIsLoading(true);
    try {
      const apiUrlFromStorage = await AsyncStorage.getItem('selectedItemInfo');
      if (apiUrlFromStorage) {
        const apiUrl = JSON.parse(apiUrlFromStorage).apiUrl;
        const requestBody = {
          student_name: homePageStore.searchQuery,
        };
        const token = await AsyncStorage.getItem('token');

        const response = await fetch(apiUrl + 'get-student-search-list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {
          const responseData = await response.json();
          const students = responseData.data || [];
          const profilePic =
            students.length > 0 ? students[0].profile_pic : null;
          homePageStore.setProfilePic(profilePic);
          homePageStore.setStudentData(students);
        } else {
          console.error(`Error: ${response.status} - ${response.statusText}`);
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
      homePageStore.setIsLoading(false);
    }
  };
  const debouncedFetchHomePageData = debounce(fetchHomePageData, 100);

  const handleSearch = () => {
    fetchHomePageData();
    if (homePageStore.searchQuery === '') {
      ToastAndroid.showWithGravity(
        'Please type at least 3 letters of your name',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
    } else {
      debouncedFetchHomePageData();
    }
  };
  useEffect(() => {
    if (homePageStore.searchQuery.trim().length >= 3) {
      debouncedFetchHomePageData();
    }
  }, [homePageStore.searchQuery]);

  return (
    <SafeAreaView style={[styles.saferView]}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 20,
            backgroundColor: '#b6488d',
          }}>
          <View
            style={{
              width: '100%',
              backgroundColor: '#fff',
              display: 'flex',
              paddingRight: 25,
              paddingLeft: 25,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderRadius: 10,
            }}>
            <TextInput
              placeholder="Please type your Name"
              style={styles.inputStyles}
              onChangeText={text => homePageStore.setSearchQuery(text)}
              value={homePageStore.searchQuery}
            />
            <Pressable
              onPress={handleSearch}
              style={({pressed}) => [
                {
                  backgroundColor: pressed ? '#B6488D' : 'white',
                  borderRadius: 50,
                  padding: 10,
                },
              ]}>
              <Icon name="search" size={22} style={{color: '#B6488D'}} />
            </Pressable>
          </View>
        </View>
        {homePageStore.isLoading ? (
          <ActivityIndicator
            size="large"
            color="#B6488D"
            style={styles.loader}
          />
        ) : (
          <View style={styles.container}>
            {homePageStore.studentData.length === 0 ? (
              <Image
                source={NoDataFound}
                style={{width: 200, height: 200, alignSelf: 'center'}}
              />
            ) : (
              <StudentListComponent fetchedDataa={homePageStore.studentData} />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
});

export default StudentList;
