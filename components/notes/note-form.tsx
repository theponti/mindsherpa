import { useCallback, useState, type PropsWithChildren } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { captureException } from '@sentry/react-native'
import { Text, theme } from '~/theme'
import type { FocusItem, FocusItemInput } from '~/utils/services/notes/types'
import { useFocusItemsCreate } from '../../utils/services/notes/use-focus-item-create'
import { FeedbackBlock } from '../feedback-block'
import AudioRecorder from '../media/audio-recorder'
import type { CreateNoteOutput } from '../media/use-audio-upload'
import { useGetUserIntent } from '../media/use-get-user-intent'
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
  const [focusItems, setFocusItems] = useState<CreateNoteOutput['items']>([])
  const { mutateAsync: createFocusItems, isPending: isCreating } = useFocusItemsCreate({
    onSuccess: (data) => {
      onSubmit(data)
      setFocusItems((prev) =>
        prev.filter((item) => !data.some((newItem) => newItem.text === item.text))
      )
      setGenerateError(false)
    },
    onError: (error) => {
      captureException(error)
      setCreateError(true)
    },
  })
  const { mutate: generateFocusItems, isPending: isGenerating } = useGetUserIntent({
    onSuccess: (data) => {
      if (data) {
        const createTasks = data.intents.reduce<FocusItemInput[]>((result, item) => {
          if (item.function_name === 'create_tasks') {
            const tasks = Array.isArray(item.parameters?.tasks) ? item.parameters?.tasks : []
            for (const task of tasks) {
              result.push(task)
            }
          }
          return result
        }, [])

        if (createTasks.length > 0) {
          setFocusItems((prev) => [
            ...prev,
            ...createTasks.map((item) => ({
              ...item,
              id: Math.floor(Math.random() * 1000),
            })),
          ])
        }
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
      setFocusItems(data.items)
    },
    [setIsRecording]
  )

  const onFocusItemPreviewDeleteClick = (focusItem: FocusItemInput) => {
    setFocusItems((prev) => prev.filter((item) => item.text !== focusItem.text))
  }

  const onFocusItemPreviewClick = async (focusItem: FocusItemInput) => {
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
      {generateError ? <GenerateError onCloseClick={() => setGenerateError(false)} /> : null}
      {focusItems.map((item) => (
        <FocusItemPreview
          key={item.text}
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
