import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withClamp,
  withSpring,
} from 'react-native-reanimated';

import { VoiceRecorder, useVoiceRecorder } from './voice-recorder';

const MessageForm = ({ onSubmit }: { onSubmit: (text: string) => void }) => {
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
    <View>
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
        {text.length > 0 ? (
          <TouchableOpacity onPress={onSubmitButtonClick} style={[styles.sendButton]}>
            <MaterialIcons name="send" size={24} color="black" />
          </TouchableOpacity>
        ) : null}
        {isRecording ? (
          <TouchableOpacity onPress={onStopRecordingPress} style={[styles.sendButton]}>
            <MaterialIcons name="stop" size={24} color="black" />
          </TouchableOpacity>
        ) : null}
        {!isRecording ? (
          <TouchableOpacity onPress={onMicrophonePress} style={[styles.sendButton]}>
            <MaterialIcons name="mic" size={24} color="black" />
          </TouchableOpacity>
        ) : null}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  sendButton: {
    backgroundColor: '#efefef',
    borderRadius: 50,
    padding: 8,
    borderColor: '#b3b3b3',
    borderWidth: 1,
  },
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
