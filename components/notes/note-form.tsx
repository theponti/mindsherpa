import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { theme } from '~/theme';
import AutoGrowingInput from '../text-input-autogrow';
import AudioRecorder from '../media/audio-recorder';
import { type CreateNoteOutput, useCreateTextNote } from '../media/use-audio-upload';
import { UploadFileButton } from '../upload-file-button';
import { FormSubmitButton } from './note-form-submit-button';

type NoteFormProps = {
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  onSubmit: (note: CreateNoteOutput | null) => void;
};
export const NoteForm = (props: NoteFormProps) => {
  const { isRecording, setIsRecording, onSubmit } = props;
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

  const onStartRecording = useCallback(() => {
    setIsRecording(true);
  }, [setIsRecording]);

  const onStopRecording = useCallback(
    (note: CreateNoteOutput | null) => {
      setIsRecording(false);
      onSubmit(note);
    },
    [onSubmit, setIsRecording]
  );

  const handleSubmit = () => mutate(content);

  return (
    <View style={[styles.container]}>
      <View style={[{ flex: 1, height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.1)' }]} />
      {!isRecording ? (
        <View style={[styles.inputContainer]}>
          <AutoGrowingInput
            editable={!isRecording && !isPending}
            placeholder="Drop a note..."
            value={content}
            onChangeText={setContent}
          />
        </View>
      ) : null}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 8,
    borderColor: theme.colors.grayMedium,
    borderWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  inputContainer: {},
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 4,
  },
  mediaButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 16,
    alignSelf: 'flex-start',
    marginRight: 16,
  },
});
