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
import { gql, useClient, useMutation } from 'urql';

import TextInput from './text-input';
import { VoiceRecorder, useVoiceRecorder } from './voice-recorder';

import { useAuth } from '~/utils/auth/auth-context';

const uploadVoiceNoteMutation = gql`
  mutation UploadVoiceNote($audio_file: Upload!, $chatId: String!) {
    uploadVoiceNote(audio_file: $audio_file, chatId: $chatId) {
      id
    }
  }
`;

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
  const { saveRecording, saveRecordingResponse } = useVoiceNoteMutation();
  const { isRecording, startRecording, stopRecording, recordingStatus, soundURI } =
    useVoiceRecorder({
      onRecordingComplete: saveRecording,
    });
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

  // ! TODO: While voice note is uploading, show a loading indicator, disable the submit button, the microphone button, and the text input
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

const useVoiceNoteMutation = () => {
  const { session } = useAuth();
  const client = useClient();
  const [uploadVoiceNoteResponse, uploadVoiceNote] = useMutation(uploadVoiceNoteMutation);

  const saveRecording = useCallback(
    async (uri: string) => {
      const response = await fetch(uri);
      const blob = await response.blob();
      const { data, error } = await uploadVoiceNote(
        {
          blob,
          userId: session!.user.id,
        },
        {
          fetchOptions: {
            headers: {
              Authorization: `Bearer ${session!.access_token}`,
            },
          },
        }
      );

      // ! TODO: Save a `voiceNote` record
      // ! TODO: Save a `message` record with the voice_note_id
      // ! TODO: Convert voiceNote to text

      if (error) {
        console.error('Error uploading recording: ', error);
      } else {
        console.log('Recording uploaded: ', data);
      }
    },
    [client]
  );

  return {
    saveRecording,
    saveRecordingResponse: uploadVoiceNoteResponse,
  };
};
export default MessageForm;
