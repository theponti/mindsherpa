import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { FormContainer } from '../form-container';
import AutoGrowingInput from '../text-input-autogrow';
import { SpeakButton, UploadFileButton } from '../upload-file-button';
import { FormSubmitButton } from '../voice-input-button';
import { useVoiceRecorder } from '../voice-recorder';

import { useCreateNoteMutation } from '~/utils/services/notes/CreateNote.mutation.generated';

export const NoteForm = ({ onSubmit }: { onSubmit: (note: any) => void }) => {
  const [content, setContent] = useState('');
  const [createNoteResponse, createNote] = useCreateNoteMutation();
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder({
    onRecordingComplete: () => {},
  });

  const onMicrophonePress = useCallback(() => {
    if (!isRecording) {
      startRecording();
    }
  }, [isRecording]);

  const onStopRecordingPress = useCallback(() => {
    stopRecording();
  }, [stopRecording]);

  const handleSubmit = async () => {
    const { data, error } = await createNote({ input: { content } });

    if (error) {
      console.error(error);
    }

    if (data?.createNote) {
      onSubmit(data.createNote);
      setContent('');
    }
  };

  return (
    <FormContainer>
      <View style={[styles.inputContainer]}>
        <AutoGrowingInput placeholder="Drop a note..." value={content} onChangeText={setContent} />
      </View>
      <View style={[styles.actionButtons]}>
        <View style={[styles.mediaButtons]}>
          <UploadFileButton />
          {!isRecording && <SpeakButton onPress={onMicrophonePress} />}
        </View>
        <FormSubmitButton
          buttonType={isRecording ? 'voice' : 'text'}
          disabled={createNoteResponse.fetching}
          isLoading={createNoteResponse.fetching}
          isRecording={isRecording}
          onStopRecording={onStopRecordingPress}
          onSubmitButtonClick={handleSubmit}
        />
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  inputContainer: {},
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 4,
  },
  mediaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 4,
    alignSelf: 'flex-start',
  },
});
