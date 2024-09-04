import { useCallback, useState, type PropsWithChildren } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { captureException } from '@sentry/react-native'
import { Text, theme } from '~/theme'
import type { FocusItem } from '~/utils/services/notes/types'
import { useFocusItemsCreate } from '../../utils/services/notes/use-focus-item-create'
import { FeedbackBlock } from '../feedback-block'
import AudioRecorder from '../media/audio-recorder'
import { useFocusItemsTextGenerate, type CreateNoteOutput } from '../media/use-audio-upload'
import AutoGrowingInput from '../text-input-autogrow'
import MindsherpaIcon from '../ui/icon'
import { UploadFileButton } from '../upload-file-button'
import FocusItemPreview from './focus-item-preview'
import { FormSubmitButton } from './note-form-submit-button'

type NoteFormProps = {
  isRecording: boolean
  setIsRecording: (isRecording: boolean) => void
  onSubmit: (data: FocusItem[]) => void
}
export const NoteForm = (props: NoteFormProps) => {
  const { isRecording, setIsRecording, onSubmit } = props
  const [content, setContent] = useState('')
  const [createError, setCreateError] = useState<boolean>(false)
  const [generateError, setGenerateError] = useState<boolean>(false)
  const [focusItems, setFocusItems] = useState<CreateNoteOutput['focus_items']>([])
  const { mutateAsync: createFocusItems, isPending: isCreating } = useFocusItemsCreate({
    onSuccess: (data) => {
      onSubmit(data)
      setFocusItems((prev) =>
        prev.filter((item) => !data.some((newItem) => newItem.text === item.text))
      )
      setGenerateError(false)
    },
    onError: (error) => {
      console.log('create error', error)
      setCreateError(true)
    },
  })
  const { mutate: generateFocusItems, isPending: isGenerating } = useFocusItemsTextGenerate({
    onSuccess: (data) => {
      if (data) {
        setFocusItems((prev) => [
          ...prev,
          ...data.focus_items.map((item) => ({
            ...item,
            id: Math.floor(Math.random() * 1000),
          })),
        ])
      }
      setContent('')
    },
    onError: (error) => {
      captureException(error)
      setGenerateError(true)
    },
  })
  const isPending = isCreating || isGenerating

  const onStartRecording = useCallback(() => {
    setIsRecording(true)
  }, [setIsRecording])

  const onStopRecording = useCallback(
    (data: CreateNoteOutput) => {
      setIsRecording(false)
      setFocusItems(data.focus_items)
    },
    [setIsRecording]
  )

  const onFocusItemPreviewDeleteClick = (focusItem: FocusItem) => {
    setFocusItems((prev) => prev.filter((item) => item.id !== focusItem.id))
  }

  const onFocusItemPreviewClick = async (focusItem: CreateNoteOutput['focus_items'][0]) => {
    setCreateError(false)
    createFocusItems([focusItem])
  }

  const handleSubmit = () => {
    setGenerateError(false)
    generateFocusItems(content)
  }

  return (
    <View style={[styles.container, { paddingTop: focusItems.length > 0 ? 16 : 0 }]}>
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
      {generateError ? (
        <NoteFormError>
          <Text variant="body" color="white">
            Sherpa is having a tummy ache. Please try again later.
          </Text>
          <Pressable onPress={() => setGenerateError(false)}>
            <MindsherpaIcon
              name="circle-x"
              size={26}
              color={theme.colors.grayMedium}
              style={noteFormErrorStyles.closeButton}
            />
          </Pressable>
        </NoteFormError>
      ) : null}
      {focusItems.map((item) => (
        <FocusItemPreview
          key={item.id}
          disabled={isPending}
          focusItem={item}
          onDeleteClick={onFocusItemPreviewDeleteClick}
          onCreateClick={onFocusItemPreviewClick}
        />
      ))}
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
    <FeedbackBlock>
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
