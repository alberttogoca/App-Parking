import { StyleSheet, Dimensions } from 'react-native'
import * as theme from './theme';

const { height, width } = Dimensions.get('screen');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: theme.SIZES.base * 2,
    paddingTop: theme.SIZES.base * 2.5,
    paddingBottom: theme.SIZES.base * 1.5,
  },
  headerTitle: {
    color: theme.COLORS.gray,
  },
  headerLocation: {
    fontSize: theme.SIZES.font,
    fontWeight: '500',
    paddingVertical: theme.SIZES.base / 3,
  },
  map: {
    flex: 3,
  },
  parkings: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    paddingBottom: theme.SIZES.base * 2,
  },
  parking: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.white,
    borderRadius: 6,
    padding: theme.SIZES.base,
    marginHorizontal: theme.SIZES.base * 2,
    width: width - (24 * 2),
  },
  buy: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: theme.SIZES.base * 1.5,
    paddingVertical: theme.SIZES.base,
    backgroundColor: theme.COLORS.blue,
    borderRadius: 6,
  },
  buyTotal: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  buyTotalPrice: {
    color: theme.COLORS.white,
    fontSize: theme.SIZES.base * 2,
    fontWeight: '600',
    paddingLeft: theme.SIZES.base / 4,
  },
  buyBtn: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  marker: {
    flexDirection: 'row',
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.SIZES.base * 2,
    paddingVertical: 12,
    paddingHorizontal: theme.SIZES.base * 2,
    borderWidth: 1,
    borderColor: theme.COLORS.white,
  },
  markerPrice: { color: theme.COLORS.blue, fontWeight: 'bold', },
  markerStatus: { color: theme.COLORS.gray },
  shadow: {
    shadowColor: theme.COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  active: {
    borderColor: theme.COLORS.blue,
  },
  hours: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: theme.SIZES.base / 2,
    justifyContent: 'space-evenly',
  },
  hoursTitle: {
    fontSize: theme.SIZES.text,
    fontWeight: '500',
  },
  hoursDropdown: {
    borderRadius: theme.SIZES.base / 2,
    borderColor: theme.COLORS.overlay,
    borderWidth: 1,
    padding: theme.SIZES.base,
    marginRight: theme.SIZES.base / 2,
  },
  hoursDropdownOption: {
    padding: 5,
    fontSize: theme.SIZES.font * 0.8,
  },
  hoursDropdownStyle: {
    marginLeft: -theme.SIZES.base,
    paddingHorizontal: theme.SIZES.base / 2,
    marginVertical: -(theme.SIZES.base + 1),
  },
  parkingInfoContainer: { flex: 1.5, flexDirection: 'row' },
  parkingInfo: {
    justifyContent: 'space-evenly',
    marginHorizontal: theme.SIZES.base * 1.5,
  },
  parkingIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalContainer: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modal: {
    flexDirection: 'column',
    height: height * 0.75,
    padding: theme.SIZES.base * 2,
    backgroundColor: theme.COLORS.white,
    borderTopLeftRadius: theme.SIZES.base,
    borderTopRightRadius: theme.SIZES.base,
  },
  modalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: theme.SIZES.base,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: theme.COLORS.overlay,
    borderBottomColor: theme.COLORS.overlay,
  },
  modalHours: {
    paddingVertical: height * 0.11,
  },
  modalHoursDropdown: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.SIZES.base,
  },
  payBtn: {
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.SIZES.base * 1.5,
    backgroundColor: theme.COLORS.blue,
  },
  payText: {
    fontWeight: '600',
    fontSize: theme.SIZES.base * 1.5,
    color: theme.COLORS.white,
  }
})
