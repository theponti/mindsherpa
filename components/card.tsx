import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Colors, borderStyle } from '~/utils/styles';

export const Card = ({ children }: { children: React.ReactNode }) => (
  <Animated.View entering={FadeIn} exiting={FadeOut} style={[borderStyle.border, styles.container]}>
    {children}
  </Animated.View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
});
