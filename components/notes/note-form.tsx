import { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import { FormContainer } from '../form-container'
import AutoGrowingInput from '../text-input-autogrow'
import AudioRecorder from '../media/audio-recorder'
import { UploadFileButton } from '../upload-file-button'
import { FormSubmitButton } from './note-form-submit-button'

import { type CreateVoiceNoteResponse, useCreateTextNote } from '../media/use-audio-upload'

export const NoteForm = ({ onSubmit }: { onSubmit: (note: any) => void }) => {
  const [content, setContent] = useState('')
  const { mutate, isError, isPending } = useCreateTextNote({
    onSuccess: (data) => {
      onSubmit(data)
      setContent('')
    },
    onError: (error) => {
      console.error('Note upload failed', error)
    },
  })
  const [isRecording, setIsRecording] = useState(false)

  const onStartRecording = useCallback(() => {
    setIsRecording(true)
  }, [])

  const onStopRecording = useCallback((note: any) => {
    setIsRecording(false)
    onSubmit(note)
  }, [])

  const handleSubmit = () => mutate(content)

  return (
    <FormContainer>
      <View style={[styles.inputContainer]}>
        <AutoGrowingInput placeholder="Drop a note..." value={content} onChangeText={setContent} />
      </View>

      <View style={[styles.actionButtons]}>
        <View style={[styles.mediaButtons]}>
          <UploadFileButton />
          <AudioRecorder onStartRecording={onStartRecording} onStopRecording={onStopRecording} />
        </View>
        <FormSubmitButton
          buttonType={isRecording ? 'voice' : 'text'}
          disabled={isPending || isRecording}
          isLoading={isPending}
          onSubmitButtonClick={handleSubmit}
        />
      </View>
    </FormContainer>
  )
}

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
})
