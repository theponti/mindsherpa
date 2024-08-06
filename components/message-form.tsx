import { useCallback, useState } from 'react';
import { View, ViewStyle } from 'react-native';

import { FormContainer } from './form-container';
import AutoGrowingInput from './text-input-autogrow';
import { UploadFileButton } from './upload-file-button';
import { VoiceInputButton } from './voice-input-button';
import { VoiceRecorder, useVoiceRecorder } from './voice-recorder';

import { Chat } from '~/utils/schema/graphcache';

const MessageForm = ({
  chatId,
  isLoading,
  onSubmit,
  ...props
}: {
  chatId: Chat['id'];
  isLoading: boolean;
  onSubmit: (text: string) => Promise<void>;
  style?: ViewStyle;
}) => {
  const [text, setText] = useState('');
  const { isRecording, startRecording, stopRecording, recordingStatus, saveRecordingResponse } =
    useVoiceRecorder({
      onRecordingComplete: () => {},
    });

  const onSubmitButtonClick = useCallback(async () => {
    await onSubmit(text);
    setText('');
  }, [text]);

  const onMicrophonePress = useCallback(() => {
    if (!isRecording) {
      startRecording();
    }
  }, [isRecording]);

  const onStopRecordingPress = useCallback(() => {
    stopRecording();
  }, [stopRecording]);

  // ! TODO: While voice note is uploading, show a loading indicator, disable the submit button, the microphone button, and the text input
  return (
    <View style={[props.style]}>
      {isRecording ? (
        <VoiceRecorder
          level={recordingStatus?.metering}
          recording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />
      ) : null}
      <FormContainer>
        <UploadFileButton />
        <AutoGrowingInput placeholder="Ask sherpa" value={text} onChangeText={setText} />

        <VoiceInputButton
          buttonType={text.length === 0 || isRecording ? 'voice' : 'text'}
          disabled={isLoading}
          isLoading={isLoading || saveRecordingResponse.fetching}
          isRecording={isRecording}
          onStartRecording={onMicrophonePress}
          onStopRecording={onStopRecordingPress}
          onSubmitButtonClick={onSubmitButtonClick}
        />
      </FormContainer>
    </View>
  );
};

export default MessageForm;
