import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import AutoGrowingInput from '../text-input-autogrow';
import AudioRecorder from '../media/audio-recorder';
import { UploadFileButton } from '../upload-file-button';
import { FormContainer } from './note-form.container';
import { FormSubmitButton } from './note-form-submit-button';

import { type CreateNoteOutput, useCreateTextNote } from '../media/use-audio-upload';

export const NoteForm = ({ onSubmit }: { onSubmit: (note: CreateNoteOutput | null) => void }) => {
  const [content, setContent] = useState('');
  const { mutate, isError, isPending } = useCreateTextNote({
    onSuccess: (data) => {
      onSubmit(data);
      setContent('');
    },
    onError: (error) => {
      console.error('Note upload failed', error);
    },
  });
  const [isRecording, setIsRecording] = useState(false);

  const onStartRecording = useCallback(() => {
    setIsRecording(true);
  }, []);

  const onStopRecording = useCallback(
    (note: CreateNoteOutput | null) => {
      setIsRecording(false);
      onSubmit(note);
    },
    [onSubmit]
  );

  const handleSubmit = () => mutate(content);

  return (
    <FormContainer>
      <View style={[styles.inputContainer]}>
        <AutoGrowingInput
          editable={!isRecording && !isPending}
          placeholder="Drop a note..."
          value={content}
          onChangeText={setContent}
        />
      </View>
      <View style={[styles.actionButtons]}>
        <View style={[styles.mediaButtons]}>
          <UploadFileButton />
          <AudioRecorder onStartRecording={onStartRecording} onStopRecording={onStopRecording} />
        </View>
        <FormSubmitButton
          isRecording={isRecording}
          isLoading={isPending}
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
    columnGap: 16,
    alignSelf: 'flex-start',
  },
});
