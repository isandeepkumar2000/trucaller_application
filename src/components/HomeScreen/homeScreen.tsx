import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {observer} from 'mobx-react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NoDataFound from '../../Images/No.png';
import {styles} from './homeScreenStyle';
import {homePageStore} from '../../Store/HomePageStore/storeHomePage';
import {StudentListComponent} from './StudentList/studentList';

import {
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  ToastAndroid,
  Image,
  Text,
  useColorScheme,
  RefreshControl,
} from 'react-native';

export const StudentList = observer(() => {
  const colorScheme = useColorScheme();

  const getTextColor = () => {
    return colorScheme === 'dark' ? '#b6488d' : '#b6488d';
  };

  const getBackgroundColor = () => {
    return colorScheme === 'dark' ? '#FFFFFF' : '#FFFFFF';
  };

  const [searchInitiated, setSearchInitiated] = useState(false);

  const onRefresh = React.useCallback(() => {
    homePageStore.setRefreshing(true);
    fetchHomePageData();

    setTimeout(() => {
      homePageStore.setRefreshing(false);
    }, 2000);
  }, []);

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
          setSearchInitiated(true);
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

  const handleSearch = () => {
    if (homePageStore.searchQuery === '') {
      ToastAndroid.show('Enter student name to search', ToastAndroid.LONG);
    } else {
      fetchHomePageData();
    }
  };

  const handleInputSubmit = () => {
    handleSearch();
  };

  const handleInputChange = (text: string) => {
    homePageStore.setSearchQuery(text);
    homePageStore.setStudentData([]);
    setSearchInitiated(false);
  };

  return (
    <SafeAreaView
      style={[styles.saferView, {backgroundColor: getBackgroundColor()}]}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl
            refreshing={homePageStore.refreshing}
            onRefresh={onRefresh}
            colors={['#B6488D']}
            tintColor="#B6488D"
            title="Pull to refresh"
            titleColor="#B6488D"
          />
        }>
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
              paddingRight: 15,
              paddingLeft: 15,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderBottomLeftRadius: 0,
              position: 'relative',
            }}>
            <TextInput
              placeholder="Enter student name to search"
              style={[styles.inputStyles, {color: getTextColor()}]}
              onChangeText={handleInputChange}
              value={homePageStore.searchQuery}
              onSubmitEditing={handleInputSubmit}
              placeholderTextColor={getTextColor()}

              // placeholderTextColor={getTextColor()}
            />
            <Pressable
              onPress={handleSearch}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                height: 55,
                width: 55,
                backgroundColor: '#0a9856',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                borderBottomLeftRadius: 0,
              }}>
              <Icon name="search" size={25} style={{color: '#fff'}} />
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
          <View
            style={[styles.container, {backgroundColor: getBackgroundColor()}]}>
            {homePageStore.searchQuery.trim() === '' ? (
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 28,
                  paddingHorizontal: 50,
                  paddingVertical: 260,
                  fontWeight: '500',
                  color: getTextColor(),
                }}>
                Enter student name to search
              </Text>
            ) : searchInitiated && homePageStore.studentData.length == 0 ? (
              <Image
                source={NoDataFound}
                style={{
                  width: '100%',
                  height: 305,
                  alignSelf: 'center',
                  marginTop: 80,
                }}
              />
            ) : (
              <StudentListComponent
                studentdataList={homePageStore.studentData}
              />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
});
