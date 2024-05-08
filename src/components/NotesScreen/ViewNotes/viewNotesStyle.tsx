import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    padding: 16,
    paddingHorizontal: 0,
  },

  eventRow: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexGrow: 1,
    backgroundColor: '#D9EFFF',

    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    position: 'relative',
    marginBottom: 15,
  },
  eventLeft: {
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    justifyContent: 'center',
  },
  eventRight: {
    width: '84%',

    paddingLeft: 0,
    paddingBottom: 25,
    paddingRight: 25,
  },
  iconStyle: {
    width: 40,
    paddingLeft: 12,
    justifyContent: 'center',
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },

  adminOnlyView: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
    marginBottom: 20,
    width: '28%',
  },

  RaiseFlagView: {
    backgroundColor: 'lightgreen',
    marginTop: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
  },

  UnSetRaiseFlagView: {
    backgroundColor: '#f09e2b',
    marginTop: 5,
    borderRadius: 5,
    width: '100%',
  },

  deletedFlagView: {
    backgroundColor: '#6cf0bd',
    marginTop: 5,
    borderRadius: 5,
    width: '100%',
  },

  RaiseFlagText: {
    color: 'black',
    fontSize: 12,
    marginBottom: 2,
    fontWeight: '600',
    padding: 5,
  },

  adminOnlyText: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 2,
    fontWeight: '600',
  },

  eventLeftHeading: {
    color: '#B6488D',
    fontSize: 20,
    marginBottom: 2,
    fontWeight: '600',
    paddingTop: 0,
  },
  eventSubDetail: {
    color: '#262B35',
    fontSize: 16,
    lineHeight: 20,
    overflow: 'hidden',
  },
  viewMoreButton: {
    marginTop: 8,
    paddingTop: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  viewMoreButtonText: {
    color: '#B6488D',
    fontWeight: 'bold',
  },
});
