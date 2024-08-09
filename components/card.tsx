import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Colors } from '~/utils/styles';

export const Card = ({ children }: { children: React.ReactNode }) => (
  <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.container]}>
    {children}
  </Animated.View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
    borderColor: '#edeef1',
    borderWidth: 1,
    borderRadius: 32,
  },
});
