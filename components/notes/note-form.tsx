import { Mic, Notebook, Send } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { FormContainer } from '../form-container';
import AutoGrowingInput from '../text-input-autogrow';
import { UploadFileButton } from '../upload-file-button';
import { VoiceInputButton } from '../voice-input-button';
import { useVoiceRecorder } from '../voice-recorder';

import { useCreateNoteMutation } from '~/utils/services/notes/CreateNote.mutation.generated';
import { Colors } from '~/utils/styles';

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
      <UploadFileButton />

      <AutoGrowingInput placeholder="Drop a note..." value={content} onChangeText={setContent} />

      <VoiceInputButton
        buttonType={content.length === 0 || isRecording ? 'voice' : 'text'}
        disabled={createNoteResponse.fetching}
        isLoading={createNoteResponse.fetching}
        isRecording={isRecording}
        onStartRecording={onMicrophonePress}
        onStopRecording={onStopRecordingPress}
        onSubmitButtonClick={handleSubmit}
      />
    </FormContainer>
  );
};
