import { useCallback, useState, type PropsWithChildren } from 'react'
import { Pressable, StyleSheet, View, type ViewProps } from 'react-native'

import { Text, theme } from '~/theme'
import type { FocusItemInput } from '~/utils/services/notes/types'
import { useSendMessage } from '~/utils/services/use-chat-messages'
import { FeedbackBlock } from '../feedback-block'
import type { CreateNoteOutput } from '../media/use-audio-upload'
import { FormSubmitButton } from '../notes/note-form-submit-button'
import AutoGrowingInput from '../text-input-autogrow'
import MindsherpaIcon from '../ui/icon'
import { UploadFileButton } from '../upload-file-button'
import AudioTranscriber from './audio-transcriber'

type ChatFormProps = {
  chatId: string
  isEndingChat: boolean
  onEndChat: () => void
}
export const ChatForm = (props: ChatFormProps) => {
  const { chatId, isEndingChat } = props
  const [isRecording, setIsRecording] = useState(false)
  const [transcribeError, setTranscribeError] = useState<boolean>(false)
  const { isChatSending, message, setMessage, sendChatMessage, sendChatError, setSendChatError } =
    useSendMessage({ chatId })

  const onRecordingStateChange = useCallback((isRecording: boolean) => {
    setIsRecording(isRecording)
  }, [])

  const onAudioTranscribed = useCallback(
    (transcription: string) => {
      setMessage(transcription)
    },
    [setMessage]
  )

  const handleSubmit = () => {
    sendChatMessage()
  }

  const handleTranscribeError = () => {
    setTranscribeError(true)
  }

  return (
    <View style={[styles.container]}>
      {sendChatError ? (
        <NoteFormError>
          <Text variant="body" color="white">
            There was an issue sending your message to Sherpa.
          </Text>
          <Pressable onPress={() => setSendChatError(false)}>
            <MindsherpaIcon
              name="circle-x"
              size={26}
              color={theme.colors.grayMedium}
              style={noteFormErrorStyles.closeButton}
            />
          </Pressable>
        </NoteFormError>
      ) : null}
      {transcribeError ? (
        <NoteFormError>
          <Text variant="body" color="white">
            There was an issue transcribing your input.
          </Text>
          <Pressable onPress={() => setTranscribeError(false)}>
            <MindsherpaIcon
              name="circle-x"
              size={26}
              color={theme.colors.grayMedium}
              style={noteFormErrorStyles.closeButton}
            />
          </Pressable>
        </NoteFormError>
      ) : null}
      {!isRecording ? (
        <View style={[styles.inputContainer]}>
          <AutoGrowingInput
            editable={!isRecording && !isChatSending}
            placeholder="Drop a note..."
            value={message}
            onChangeText={setMessage}
          />
        </View>
      ) : null}
      <View style={[styles.actionButtons]}>
        <View style={[styles.mediaButtons]}>
          <UploadFileButton />
          <AudioTranscriber
            onError={handleTranscribeError}
            onRecordingStateChange={onRecordingStateChange}
            onAudioTranscribed={onAudioTranscribed}
          />
        </View>
        <View style={[{ flexDirection: 'row', columnGap: 12 }]}>
          {!isRecording ? (
            <Pressable
              onPress={props.onEndChat}
              style={{
                backgroundColor: theme.colors.white,
                borderWidth: 1,
                borderColor: theme.colors.gray,
                borderRadius: 90,
                paddingHorizontal: 12,
                paddingVertical: 12,
              }}
            >
              {isEndingChat ? (
                <MindsherpaIcon name="spinner" size={20} color={theme.colors.grayDark} />
              ) : (
                <MindsherpaIcon name="broom-wide" size={20} color={theme.colors.grayDark} />
              )}
            </Pressable>
          ) : null}
          <FormSubmitButton
            isRecording={isRecording}
            isLoading={isChatSending}
            onSubmitButtonClick={handleSubmit}
          />
        </View>
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
  focusItem: FocusItemInput
  onDeleteClick: (focusItem: FocusItemInput) => void
  onCreateClick: (focusItem: CreateNoteOutput['items'][0]) => void
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
        {focusItem.due_date ? <Text variant="caption">Due: {focusItem.due_date}</Text> : null}
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
