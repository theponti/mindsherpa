import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withClamp,
  withSpring,
} from 'react-native-reanimated';

import { Button } from './Button';

const MessageForm = ({ onSubmit }: { onSubmit: (text: string) => void }) => {
  const [text, setText] = useState('');
  const translateY = useSharedValue(200);

  const onSubmitButtonClick = useCallback(() => {
    onSubmit(text);
  }, [text]);

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
    <Animated.View style={[styles.form, formStyles]}>
      <TouchableOpacity>
        <MaterialIcons name="mic" size={24} color="black" />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Ask sherpa"
        value={text}
        onChangeText={setText}
      />
      <Button title="Send" onPress={onSubmitButtonClick} style={styles.button} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
  },
  form: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    height: 60,
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 50,
  },
});
export default MessageForm;
