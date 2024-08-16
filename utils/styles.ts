import { StyleSheet } from 'react-native'

export const Colors = {
  backgroundColor: '#f8f9fa',
  black: '#000000',
  blue: 'rgba(217, 231, 255, 1.00)',
  blueDark: '#344054',
  brown: '#A52A2A',
  darkGray: '#38434D',
  gray: '#808080',
  grayMedium: '#edeef1',
  grayDark: "rgba(83, 93, 115, 1.00)",
  grayLight: 'rgba(239, 241, 245, 1.00)',
  green: '#008000',
  greenLight: '#00FF00',
  lime: '#00FF00',
  orange: '#FFA500',
  pink: '#FF00FF',
  primary: "rgba(40, 49, 67, 1.00)",
  purple: '#6366F1',
  red: '#FF0000',
  redLight: '#FF4500',
  sky: '#87CEEB',
  tomato: 'rgba(245, 99, 69, 1.00)',
  white: '#fff',
  quaternary: '#9097a6',
}

export const defaultStyles = StyleSheet.create({
  btn: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  pageContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
})

export const borderStyle = StyleSheet.create({
  noBorder: {
    borderBottomWidth: 0,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayMedium,
  },
  border: {
    borderColor: Colors.grayMedium,
    borderWidth: 1,
    borderRadius: 12,
  },
})

export const listStyles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    columnGap: 12,
  },
  text: {
    flex: 1,
    alignItems: 'center',
    fontSize: 20,
    color: Colors.primary,
  },
})
