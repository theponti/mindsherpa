import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withClamp,
  withSpring,
} from 'react-native-reanimated';

import { Colors } from '~/utils/styles';

export const FormContainer = ({ children }: { children: React.ReactNode }) => {
  const translateY = useSharedValue(200);

  const formStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withClamp(
          { min: 0, max: 200 },
          withSpring(translateY.value, { duration: 2000 })
        ),
      },
    ],
  }));

  useEffect(() => {
    translateY.value = 0;
  });

  return (
    <Animated.View style={[formContainerStyles.container, formStyles]}>{children}</Animated.View>
  );
};

const formContainerStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 8,
    marginHorizontal: 12,
    gap: 8,
    height: 60,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: 20,
  },
});
