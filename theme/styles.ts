import { StyleSheet } from 'react-native';
import { theme } from './index';

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
    backgroundColor: theme.colors.white,
  },
});

export const borderStyle = StyleSheet.create({
  noBorder: {
    borderBottomWidth: 0,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grayMedium,
  },
  border: {
    borderColor: theme.colors.grayMedium,
    borderWidth: 1,
    borderRadius: 12,
  },
});

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
    color: theme.colors.primary,
  },
});
