import { type PropsWithChildren, useCallback, useState } from 'react'
import { StyleSheet, View, type ViewProps } from 'react-native'
import { Pressable } from 'react-native'

import { Text, theme } from '~/theme'
import type { FocusOutputItem } from '~/utils/schema/graphcache'
import { FeedbackBlock } from '../feedback-block'
import { useFocusItemsCreate } from '../focus/use-focus-item-create'
import AudioRecorder from '../media/audio-recorder'
import { type CreateNoteOutput, useFocusItemsTextGenerate } from '../media/use-audio-upload'
import AutoGrowingInput from '../text-input-autogrow'
import { UploadFileButton } from '../upload-file-button'
import MindsherpaIcon from '../ui/icon'
import { FormSubmitButton } from './note-form-submit-button'

type NoteFormProps = {
  isRecording: boolean
  setIsRecording: (isRecording: boolean) => void
  onSubmit: (data: FocusOutputItem[]) => void
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
      setCreateError(false)
      const newFocusItems = focusItems.filter(
        (item) => !data.some((newItem) => newItem.text === item.text)
      )
      setFocusItems(newFocusItems)
    },
    onError: () => {
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

  const onFocusItemPreviewDeleteClick = (focusItem: FocusOutputItem) => {
    setFocusItems((prev) => prev.filter((item) => item.id !== focusItem.id))
  }

  const onFocusItemPreviewClick = async (focusItem: CreateNoteOutput['focus_items'][0]) => {
    createFocusItems([focusItem])
  }

  const handleSubmit = () => {
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
            There was an issued generating focus items from your input.
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
})

type FocusItemPreviewProps = {
  disabled: boolean
  focusItem: FocusOutputItem
  onDeleteClick: (focusItem: FocusOutputItem) => void
  onCreateClick: (focusItem: CreateNoteOutput['focus_items'][0]) => void
} & ViewProps
const FocusItemPreview = ({
  disabled,
  focusItem,
  onDeleteClick,
  onCreateClick,
  ...props
}: FocusItemPreviewProps) => {
  const onDeleteIconPress = () => {
    onDeleteClick(focusItem)
  }

  const onIconPress = () => {
    onCreateClick(focusItem)
  }

  return (
    <View style={[focusItemStyles.item]} {...props}>
      <View style={[focusItemStyles.info]}>
        <Text variant="body" color="black">
          {focusItem.text}
        </Text>
        {focusItem.dueDate ? <Text variant="caption">Due: {focusItem.dueDate}</Text> : null}
      </View>
      <Pressable disabled={disabled} style={[focusItemStyles.icon]} onPress={onDeleteIconPress}>
        <MindsherpaIcon name="trash" size={24} color={theme.colors.red} />
      </Pressable>
      <Pressable disabled={disabled} style={[focusItemStyles.icon]} onPress={onIconPress}>
        <MindsherpaIcon name="list-tree" size={24} color={theme.colors.black} />
      </Pressable>
    </View>
  )
}

const focusItemStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: theme.colors.blueLight,
    borderRadius: 16,
  },
  info: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  icon: {
    justifyContent: 'center',
    marginRight: 20,
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
