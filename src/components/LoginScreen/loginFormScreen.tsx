import React from 'react';
import {observer} from 'mobx-react';
import Icon from 'react-native-vector-icons/Feather';
import TopBG from '../../Images/TopBg.png';
import {Dropdown} from 'react-native-element-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {data} from '../../utils/Api_Drop_Down_Menu/api_Url_Drop_Down_Menu';
import {styles} from './loginformStyle';
import {
  Text,
  TextInput,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {authStore} from '../../Store/LogicAuthStore/authStore';

type LoginScreenProps = {
  navigation: any;
};

export const LoginScreen = observer(({navigation}: LoginScreenProps) => {
  const handleLogin = async () => {
    if (!authStore.email || !authStore.password || !authStore.selectedItem) {
      ToastAndroid.showWithGravity(
        'Please fill all the details ',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
    }
    authStore.setIsLoading(true);
    try {
      await authStore.login();
      if (authStore.isLoggedIn) {
        const selectedLocationObject = data.find(
          item => item.value === authStore.selectedItem,
        );

        if (selectedLocationObject) {
          const selectedItemInfo = {
            label: authStore.selectedItem,
            apiUrl: selectedLocationObject.apiUrl,
          };
          await AsyncStorage.setItem(
            'selectedItemInfo',
            JSON.stringify(selectedItemInfo),
          );
          navigation.navigate('studentList');
        }
      }
    } catch (error) {}
  };

  return (
    <SafeAreaView style={styles.saferView}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={{height: '50%'}}>
          <Image source={TopBG} style={styles.topBgImage} />
          <View style={styles.centeredText}>
            <Text style={styles.headingText}>Login</Text>
            <Text style={styles.subheadingText}>Login to your Account</Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Icon
                name="mail"
                size={20}
                color="#B6488D"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholderTextColor="black"
                placeholder="Email"
                onChangeText={text => authStore.setEmail(text)}
                value={authStore.email}
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon
                name="key"
                size={20}
                color="#B6488D"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Password"
                placeholderTextColor="black"
                onChangeText={text => authStore.setPassword(text)}
                value={authStore.password}
                secureTextEntry={!authStore.isPasswordVisible}
              />
              <Pressable onPress={authStore.togglePasswordVisibility}>
                <Icon
                  name={authStore.isPasswordVisible ? 'eye' : 'eye-off'}
                  size={20}
                  color="#B6488D"
                />
              </Pressable>
            </View>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.dropdownIcon}
              data={data}
              backgroundColor={'transparent'}
              dropdownPosition={'top'}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select item"
              searchPlaceholder="Search..."
              value={authStore.selectedItem}
              onChange={item => authStore.setSelectedItem(item.value)}
              renderLeftIcon={() => (
                <Icon
                  name="map-pin"
                  size={20}
                  color="#B6488D"
                  style={styles.DropIcon}
                />
              )}
            />
            <Pressable
              onPress={handleLogin}
              style={({pressed}) => [
                {
                  backgroundColor: pressed ? 'lightgray' : '#B6488D',
                  borderColor: 'white',
                  borderWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 16,
                  borderRadius: 50,
                },
                styles.loginButton,
              ]}>
              {authStore.isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Icon
                    name="log-in"
                    size={20}
                    color="white"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.loginButtonText}>Login Now</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});
