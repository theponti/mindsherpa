import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withClamp,
  withSpring,
} from 'react-native-reanimated';

import TextInput from './text-input';
import { VoiceRecorder, useVoiceRecorder } from './voice-recorder';

const MessageForm = ({
  isLoading,
  onSubmit,
  ...props
}: {
  isLoading: boolean;
  onSubmit: (text: string) => void;
  style: ViewStyle;
}) => {
  const [text, setText] = useState('');
  const { isRecording, startRecording, stopRecording, recordingStatus, soundURI } =
    useVoiceRecorder();
  const translateY = useSharedValue(200);

  const onSubmitButtonClick = useCallback(() => {
    onSubmit(text);
  }, [text]);

  const onMicrophonePress = useCallback(() => {
    if (!isRecording) {
      startRecording();
    }
  }, [isRecording]);

  const onStopRecordingPress = useCallback(() => {
    stopRecording();
  }, [stopRecording]);

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
    <View style={[props.style]}>
      {isRecording ? (
        <VoiceRecorder
          level={recordingStatus?.metering}
          recording={isRecording}
          soundURI={soundURI}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />
      ) : null}
      <Animated.View style={[styles.form, formStyles]}>
        <TouchableOpacity>
          <MaterialIcons name="attach-file" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Ask sherpa"
          value={text}
          onChangeText={setText}
        />
        {isLoading ? (
          <ActivityIndicator size="small" color="black" />
        ) : text.length > 0 && !isLoading ? (
          <TouchableOpacity onPress={onSubmitButtonClick} style={[styles.sendButton]}>
            <MaterialIcons name="send" size={24} color="black" />
          </TouchableOpacity>
        ) : null}
        {text.length === 0 && isRecording ? (
          <TouchableOpacity onPress={onStopRecordingPress} style={[styles.sendButton]}>
            <MaterialIcons name="stop" size={24} color="black" />
          </TouchableOpacity>
        ) : null}
        {text.length === 0 && !isRecording ? (
          <TouchableOpacity onPress={onMicrophonePress} style={[styles.sendButton]}>
            <MaterialIcons name="mic" size={24} color="black" />
          </TouchableOpacity>
        ) : null}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 8,
  },
  form: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
    height: 60,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    color: 'black',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 50,
  },
  sendButton: {
    backgroundColor: '#efefef',
    borderRadius: 50,
    padding: 8,
    borderColor: '#b3b3b3',
    borderWidth: 1,
  },
});

export default MessageForm;
