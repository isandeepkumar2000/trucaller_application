import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 15,
  },
  button: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    // paddingHorizontal: 20,
    // paddingTop: 20,
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },

  notesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  notesLabel: {
    color: '#057FE1',
    fontWeight: '400',
    fontSize: 16,
  },
  notesDescription: {
    fontWeight: '400',
    fontSize: 14,
  },

  textInputContainer: {
    backgroundColor: '#f5f5f5',
    height: 80,
    padding: 5,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 10,
    elevation: 5,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    marginBottom: 10,
    marginTop: 0,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    backgroundColor: '#fff',
    height: 50,
    paddingLeft: 20,
    shadowOpacity: 0.3,
    shadowRadius: 1,
    borderRadius: 30,
    elevation: 3,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    // borderColor: '#888',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  datePickerIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#888',
    paddingVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  flagNotesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 10,
  },
  flagNotesLabel: {
    color: '#057FE1',
    fontWeight: '500',
    fontSize: 16,
  },
  flagNotesDescription: {
    fontWeight: '400',
    fontSize: 12,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioButtonContainerFlag: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
  },
  radioButton: {
    width: '30%',
    height: 40,
    justifyContent: 'center',
    margin: 5,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,

    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  radioButtonActive: {
    borderWidth: 2,
  },
  radioButtonText: {
    color: 'black',
    fontSize: 16,
  },
  selectedValueText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  dateTimePicker: {
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
});
