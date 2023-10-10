import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  parentRow: {
    backgroundColor: '#D9EFFF',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    position: 'relative',
  },
  parentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  parentText: {
    fontSize: 17,
    color: '#262B35',
    fontWeight: 'normal',
  },
  studentFlags: {
    maxWidth: 47,
    width: '100%',
    height: 20,
    borderRadius: 50,
    marginRight: 5,
    marginBottom: 7,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    padding: 8,
    borderRadius: 5,
  },
  button: {
    marginBottom: 10,
    marginRight: 8,
  },
  StudentsAlert: {
    marginBottom: 10,
    marginRight: 8,
    padding: 0,
  },
  phoneIcon: {
    backgroundColor: '#0A9856',
    width: 30,
    height: 30,
    textAlign: 'center',
    lineHeight: 31,
    borderRadius: 5,
    color: '#fff',
    marginTop: 1,
    marginRight: 5,
  },
  alertsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  alertButton: {
    marginBottom: 10,
    marginRight: 5,
    padding: 0,
    borderRadius: 5,
  },
  alertButtonText: {
    color: 'white',
    fontSize: 16,
  },
  flagsContainer: {
    flexDirection: 'row',
    marginBottom: 7,
  },
  studentFlag: {
    width: 50,
    height: 20,
    borderRadius: 50,
    marginRight: 5,
    marginBottom: 7,
  },
  studentName: {
    color: '#B6488D',
    fontSize: 20,
    fontWeight: 'bold',
  },
  franchisee: {
    color: '#B6488D',
    fontSize: 15,
  },
  footerButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerButton: {
    marginRight: 10,
    backgroundColor: '#B6488D',
    borderRadius: 5,
    paddingTop: 10,
    paddingRight: 15,
    paddingBottom: 10,
    paddingLeft: 15,
    flexDirection: 'row',
  },
  footerButtonIcon: {
    color: '#fff',
    marginTop: 1,
    marginRight: 5,
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
