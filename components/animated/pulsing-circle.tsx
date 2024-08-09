import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

import { Colors } from '~/utils/styles';

export const PulsingCircle = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 3, duration: 1500, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 550, useNativeDriver: true }),
      ])
    ).start();
  }, [scaleAnim]);

  return <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]} />;
};

const styles = StyleSheet.create({
  circle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.blue,
  },
});
