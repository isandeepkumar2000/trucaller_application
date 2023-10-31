import {makeObservable, observable, action, runInAction} from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {data} from '../../utils/Api_Drop_Down_Menu/api_Url_Drop_Down_Menu';
import {ToastAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
class AuthStore {
  email: string = '';
  device_type: string = '';
  device_token: string = '';
  password: string = '';
  isLoggedIn: boolean = false;
  errorMessage: string = '';
  isPasswordVisible: boolean = false;
  isLoading: boolean = false;
  selectedItem: string | null = null;
  locationData = new Map<string, any>();
  modalVisible: boolean = false;
  selectedLocationObject: any;

  constructor() {
    makeObservable(this, {
      email: observable,
      password: observable,
      isLoggedIn: observable,
      errorMessage: observable,
      isPasswordVisible: observable,
      modalVisible: observable,
      isLoading: observable,
      selectedItem: observable,
      locationData: observable,
      device_token: observable,
      device_type: observable,

      setModalVisible: action.bound,
      setDevice_token: action.bound,
      setDevice_type: action.bound,
      setEmail: action.bound,
      setPassword: action.bound,
      togglePasswordVisibility: action.bound,
      setSelectedItem: action.bound,
      setIsLoading: action.bound,
      setLocationData: action.bound,
      login: action.bound,
    });

    this.loadSelectedItem();
  }

  setModalVisible(modalVisible: boolean) {
    this.modalVisible = modalVisible;
  }

  setEmail(email: string) {
    this.email = email;
  }

  setDevice_token(device_token: string) {
    this.device_token = device_token;
  }
  setDevice_type(email: string) {
    this.email = email;
  }

  setPassword(password: string) {
    this.password = password;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  setSelectedItem(item: string | null) {
    this.selectedItem = item;
    if (item) {
      const selectedLocationObject = data.find(
        location => location.value === item,
      );
      if (selectedLocationObject) {
        const apiData = {
          label: selectedLocationObject.label,
          apiUrl: selectedLocationObject.apiUrl,
          value: selectedLocationObject.value,
        };
        AsyncStorage.setItem('selectedItem', JSON.stringify(apiData));
      }
    } else {
      AsyncStorage.removeItem('selectedItem');
    }
  }

  setIsLoading(value: boolean) {
    this.isLoading = value;
  }

  setLocationData(locationLabel: string, data: any) {
    runInAction(() => {
      this.locationData.set(locationLabel, data);
    });
  }

  login = async () => {
    try {
      const selectedLocationObject = data.find(
        item => item.value === this.selectedItem,
      );

      if (selectedLocationObject) {
        const apiUrl = selectedLocationObject.apiUrl + 'user-login';

        const FCMToken = await messaging().getToken();
        const deviceType = 'android';

        await AsyncStorage.setItem('deviceType', deviceType);

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            device_type: deviceType,
            device_token: FCMToken,
          }),
        });
        if (response.status === 200) {
          const responseData = await response.json();
          if (responseData.status === 'Success') {
            runInAction(() => {
              this.isLoggedIn = true;
              this.errorMessage = '';
            });
            await AsyncStorage.setItem('token', responseData.token);
            await AsyncStorage.setItem('isUserLoggedIn', 'true');
          } else {
            runInAction(() => {
              this.isLoggedIn = false;
              this.errorMessage = 'Invalid password';
            });
          }
        } else {
          runInAction(() => {
            this.isLoggedIn = false;
            this.errorMessage = 'An error occurred';
          });

          let errorMessage = 'An error occurred while processing your request.';
          try {
            const errorResponseData = await response.json();
            if (errorResponseData.message) {
              errorMessage = errorResponseData.message;
            }
          } catch (error) {}
          ToastAndroid.showWithGravityAndOffset(
            errorMessage,
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25,
            50,
          );
        }
      }
    } catch (error) {
      runInAction(() => {
        this.isLoggedIn = false;
      });
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  };

  async loadSelectedItem() {
    try {
      const storedApiData = await AsyncStorage.getItem('selectedItem');
      if (storedApiData !== null) {
        const apiData = JSON.parse(storedApiData);
        runInAction(() => {
          this.selectedItem = apiData.label;
        });
      }
    } catch (error) {}
  }
}

export const authStore = new AuthStore();
