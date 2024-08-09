import type { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '~/utils/styles';

type ScreenContentProps = PropsWithChildren<object>;

export const ScreenContent = ({ children }: ScreenContentProps) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    // backgroundColor: Colors.backgroundColor,
    backgroundColor: '#F8FBFF',
  },
});
