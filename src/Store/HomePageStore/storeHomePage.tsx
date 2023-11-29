import {makeObservable, observable, action} from 'mobx';

class HomePageStore {
  studentData: any[] = [];
  searchQuery: string = '';
  isLoading: boolean = false;
  profilePic: string = '';
  refreshing: boolean = false;

  constructor() {
    makeObservable(this, {
      studentData: observable,
      searchQuery: observable,
      isLoading: observable,
      profilePic: observable,
      refreshing: observable,
      setRefreshing: action.bound,
      setProfilePic: action.bound,
      setSearchQuery: action.bound,
      setStudentData: action.bound,
      setIsLoading: action.bound,
    });
  }
  setRefreshing(refreshing: boolean) {
    this.refreshing = this.refreshing;
  }

  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }
  setStudentData(studentData: any[]) {
    this.studentData = studentData;
  }
  setSearchQuery(searchQuery: string) {
    this.searchQuery = searchQuery;
  }
  setProfilePic(profilePic: string) {
    this.profilePic = profilePic;
  }
}

export const homePageStore = new HomePageStore();
