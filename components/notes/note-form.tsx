import { useCallback, useState, type PropsWithChildren } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { captureException } from '@sentry/react-native'
import { Text, theme } from '~/theme'
import queryClient from '~/utils/query-client'
import type { FocusItem } from '~/utils/services/notes/types'
import { FeedbackBlock } from '../feedback-block'
import AudioRecorder from '../media/audio-recorder'
import AutoGrowingInput from '../text-input-autogrow'
import MindsherpaIcon from '../ui/icon'
import { UploadFileButton } from '../upload-file-button'
import { FormSubmitButton } from './note-form-submit-button'
import { GeneratedIntentsResponse, useGetUserIntent } from './use-get-user-intent'

type NoteFormProps = {
  isRecording: boolean
  setIsRecording: (isRecording: boolean) => void
}
export const NoteForm = (props: NoteFormProps) => {
  const { isRecording, setIsRecording } = props
  const [content, setContent] = useState('')
  const [createError, setCreateError] = useState<boolean>(false)
  const [generateError, setGenerateError] = useState<boolean>(false)
  const [intentOutput, setIntentOutput] = useState<string | null>(null)
  const { data: intent, mutate: generateFocusItems, isPending: isGenerating } = useGetUserIntent({
    onSuccess: (data) => {
      onGeneratedIntents(data)
      setContent('')
    },
    onError: (error) => {
      captureException(error)
      setGenerateError(true)
    },
  })

  const onStartRecording = useCallback(() => {
    setIsRecording(true)
  }, [setIsRecording])

  const onGeneratedIntents = useCallback(
    (data: GeneratedIntentsResponse) => {
      const searchTasks = data.search?.output
      const createTasks = data.create?.output
      
      if (searchTasks && searchTasks.length > 0) {
        queryClient.setQueryData(['focusItems'], searchTasks)
        setIntentOutput(data.output)
      }

      if (createTasks && createTasks.length > 0) {
        const previousItems: FocusItem[] = queryClient.getQueryData(['focusItems']) || []
        queryClient.setQueryData(['focusItems'], [...(previousItems || []), ...createTasks])
      }
    },
    [queryClient]
  )

  const onStopRecording = useCallback(
    (data: GeneratedIntentsResponse) => {
      setIsRecording(false)
      onGeneratedIntents(data)
    },
    [setIsRecording]
  )

  const handleSubmit = () => {
    setGenerateError(false)
    generateFocusItems(content)
  }

  return (
    <View style={[
      styles.container, 
      { paddingTop: intentOutput && intentOutput.length > 0 ? 16 : 0 }
      ]}> 
      {createError ? (
        <NoteFormError>
          <Text variant="body" color="white">
            There was an issue saving your focus items.
          </Text>
          <Pressable onPress={() => setCreateError(false)}>
            <MindsherpaIcon
              name="circle-x"
              size={26}
              color={theme.colors.grayMedium}
              style={noteFormErrorStyles.closeButton}
            />
          </Pressable>
        </NoteFormError>
      ) : null}
      {intentOutput ? (
        <SherpaMessage message={intentOutput} onCloseClick={() => setIntentOutput(null)} />
      ) : null}
      {generateError ? <GenerateError onCloseClick={() => setGenerateError(false)} /> : null}
      {!isRecording ? (
        <View style={[styles.inputContainer]}>
          <AutoGrowingInput
            editable={!isRecording && !isGenerating}
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
          isLoading={isGenerating}
          onSubmitButtonClick={handleSubmit}
        />
      </View>
    </View>
  )
}

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
    paddingVertical: 4,
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
})

const NoteFormError = ({ children }: PropsWithChildren) => {
  return (
    <FeedbackBlock error>
      <View style={[noteFormErrorStyles.container]}>{children}</View>
    </FeedbackBlock>
  )
}

const noteFormErrorStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
  },
  closeButton: {
    paddingHorizontal: 8,
  },
})

const GenerateError = ({ onCloseClick }: { onCloseClick: () => void }) => {
  return (
    <NoteFormError>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', columnGap: 12 }}>
          <MindsherpaIcon
            name="circle-exclamation"
            size={26}
            color={theme.colors.tomato}
            style={noteFormErrorStyles.closeButton}
          />
          <View style={{ flex: 1, paddingLeft: 12 }}>
            <Text variant="body" color="black">
              Sherpa is having a tummy ache.
            </Text>
            <Text variant="body" color="black">
              Please try again later.
            </Text>
          </View>
        </View>
        <Pressable
          onPress={onCloseClick}
          style={[
            {
              borderRadius: 8,
              borderWidth: 1,
              borderColor: theme.colors.tomato,
              marginTop: 24,
              paddingVertical: 8,
              alignItems: 'center',
            },
          ]}
        >
          <Text variant="body" color="black">
            Close
          </Text>
        </Pressable>
      </View>
    </NoteFormError>
  )
}

const SherpaMessage = ({ message, onCloseClick }: { message: string, onCloseClick: () => void }) => {
  return (
    <FeedbackBlock style={{ paddingVertical: 12 }}>
      <Text variant="body" color="white">
        {message}
      </Text>
      <View style={{ flexDirection: 'row' }}> 
        <Pressable
          onPress={onCloseClick}
          style={[
            {
              flex: 1,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: theme.colors.white,
              marginTop: 12,
              paddingVertical: 8,
              paddingHorizontal: 12,
              alignItems: 'center',
            },
          ]}
        >
          <Text variant="body" color="white">
            Close
          </Text>
        </Pressable>
      </View>
    </FeedbackBlock>
  )
}