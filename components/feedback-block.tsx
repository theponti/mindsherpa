import { type PropsWithChildren, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

import { theme } from '~/theme';

export const FeedbackBlock = ({ error, children }: PropsWithChildren<{ error?: boolean }>) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
  });

  if (error === false) {
    return <Animated.View style={[styles.info, { opacity }]}>{children}</Animated.View>;
  }
  return <Animated.View style={[styles.error, { opacity }]}>{children}</Animated.View>;
};

const styles = StyleSheet.create({
  error: {
    gap: 4,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
    backgroundColor: theme.colors.tomato,
    borderRadius: 5,
    marginVertical: 8,
  },
  info: {
    gap: 4,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
    backgroundColor: theme.colors.grayLight,
    color: theme.colors.black,
    borderRadius: 5,
    marginVertical: 8,
  },
});
