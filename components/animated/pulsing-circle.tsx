import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { Colors } from '~/utils/styles';

export const PulsingCircle = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, [scaleAnim]);

  return <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]} />;
};

const styles = StyleSheet.create({
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.grayLight,
  },
});
