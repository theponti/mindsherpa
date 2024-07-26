import { StyleSheet } from 'react-native';

export const Colors = {
  black: '#000000',
  blue: '#007AFF',
  brown: '#A52A2A',
  darkGray: '#38434D',
  gray: '#808080',
  lime: '#00FF00',
  orange: '#FFA500',
  pink: '#FF00FF',
  purple: '#6366F1',
  sky: '#87CEEB',
  white: '#fff',
};

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
});