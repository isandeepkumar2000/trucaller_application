import {makeObservable, observable, action} from 'mobx';

class AddNotesStore {
  addNotesData: any[] = [];
  studentNotes: string = '';
  selectedFlag: string = '';
  isLoading: boolean = false;
  selectedUnSetTypeFlag: string = '';
  selectedSetTypeFlag: string = '';
  showFlagSetDatePicker: boolean = false;
  showFlagUnsetDatePicker: boolean = false;
  flagSetDate: Date | null = null;
  flagUnsetDate: Date | null = null;
  errorMessage: string = '';
  expandedIndex: number | null = null;
  addRefreshing: boolean = false;

  constructor() {
    makeObservable(this, {
      studentNotes: observable,
      flagSetDate: observable,
      addNotesData: observable,
      flagUnsetDate: observable,
      errorMessage: observable,
      isLoading: observable,
      addRefreshing: observable,
      selectedFlag: observable,
      selectedUnSetTypeFlag: observable,
      selectedSetTypeFlag: observable,
      showFlagSetDatePicker: observable,
      showFlagUnsetDatePicker: observable,
      expandedIndex: observable,
      deleteNote: action.bound,
      setAddRefreshing: action.bound,
      toggleAccordion: action.bound,
      setAddNotesData: action.bound,
      setStudentNotes: action.bound,
      setFlagSetDate: action.bound,
      setFlagUnsetDate: action.bound,
      setErrorMessage: action.bound,
      setIsLoading: action.bound,
      setSelectedFlag: action.bound,
      setSelectedUnSetTypeFlag: action.bound,
      setSelectedSetTypeFlag: action.bound,
      setShowFlagSetDatePicker: action.bound,
      setShowFlagUnsetDatePicker: action.bound,
    });
    this.selectedFlag = 'no_flag';
    this.selectedSetTypeFlag = 'immediately';
    this.selectedUnSetTypeFlag = 'no_unset_date';
  }

  setAddRefreshing(addRefreshing: boolean) {
    this.addRefreshing = this.addRefreshing;
  }

  setAddNotesData(addNotesData: any[]) {
    this.addNotesData = addNotesData;
  }

  setStudentNotes(studentNotes: string) {
    this.studentNotes = studentNotes;
  }
  setSelectedFlag(selectedFlag: string) {
    this.selectedFlag = selectedFlag;
  }
  setSelectedUnSetTypeFlag(selectedUnSetTypeFlag: string) {
    this.selectedUnSetTypeFlag = selectedUnSetTypeFlag;
  }
  setIsLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }
  setSelectedSetTypeFlag(selectedSetTypeFlag: string) {
    this.selectedSetTypeFlag = selectedSetTypeFlag;
  }

  setShowFlagUnsetDatePicker(showFlagUnsetDatePicker: boolean) {
    this.showFlagUnsetDatePicker = showFlagUnsetDatePicker;
  }
  setShowFlagSetDatePicker(showFlagSetDatePicker: boolean) {
    this.showFlagSetDatePicker = showFlagSetDatePicker;
  }
  setFlagSetDate(date: Date | null) {
    this.flagSetDate = date;
  }
  deleteNote(noteId: number) {
    this.addNotesData = this.addNotesData.filter(
      item => item.note_id !== noteId,
    );
  }

  setFlagUnsetDate(date: Date | null) {
    this.flagUnsetDate = date;
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }
  toggleAccordion(index: number) {
    if (this.expandedIndex === index) {
      this.expandedIndex = null;
    } else {
      this.expandedIndex = index;
    }
  }
}

export const addNotesStore = new AddNotesStore();
