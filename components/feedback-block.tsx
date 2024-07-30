import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '~/utils/styles';

export const FeedbackBlock = ({ children }: PropsWithChildren) => {
  return <View style={styles.error}>{children}</View>;
};

const styles = StyleSheet.create({
  error: {
    display: 'flex',
    gap: 4,
    padding: 10,
    backgroundColor: Colors.redLight,
    borderRadius: 5,
    marginVertical: 4,
  },
});
