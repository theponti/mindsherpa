import type { PropsWithChildren } from 'react'
import { useCallback, useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { captureException } from '@sentry/react-native'
import { Text, theme } from '~/theme'
import queryClient from '~/utils/query-client'
import { useStartChat } from '~/utils/services/chat/use-chat-messages'
import type { FocusItem } from '~/utils/services/notes/types'
import { FeedbackBlock } from '../feedback-block'
import AudioRecorder from '../media/audio-recorder'
import { useAudioUpload } from '../media/use-audio-upload'
import AutoGrowingInput from '../text-input-autogrow'
import MindsherpaIcon from '../ui/icon'
import { UploadFileButton } from '../upload-file-button'
import { FormSubmitButton } from './note-form-submit-button'
import { useGetUserIntent, type GeneratedIntentsResponse } from './use-get-user-intent'

type NoteFormProps = {
  isRecording: boolean
  setActiveChat: (chatId: string) => void
  setActiveSearch: (search: string) => void
  setIsRecording: (isRecording: boolean) => void
}
export const NoteForm = (props: NoteFormProps) => {
  const { isRecording, setActiveSearch, setIsRecording, setActiveChat } = props
  const [content, setContent] = useState('')
  const [createError, setCreateError] = useState<boolean>(false)
  const [generateError, setGenerateError] = useState<boolean>(false)
  const [intentOutput, setIntentOutput] = useState<string | null>(null)
  const { mutate: generateFocusFromAudio, isPending: isAudioGenerating } = useAudioUpload({
    onSuccess: (data: GeneratedIntentsResponse) => {
      onGeneratedIntents(data)
      setIsRecording(false)
    },
    onError: () => {
      setGenerateError(true)
    },
  })

  const { mutate: generateFocusItems, isPending: isTextGenerating } = useGetUserIntent({
    onSuccess: (data) => {
      onGeneratedIntents(data)
    },
    onError: (error) => {
      console.error('Error generating intent:', error)
      captureException(error)
      setGenerateError(true)
    },
  })

  const onGeneratedIntents = useCallback(
    (data: GeneratedIntentsResponse) => {
      const searchTasks = data.search?.output
      const createTasks = data.create?.output
      const chatMessage = data.chat?.output

      if (chatMessage && chatMessage.length > 0) {
        setIntentOutput(chatMessage)
        return
      }

      if (searchTasks && searchTasks.length > 0 && data.output) {
        setContent('')
        queryClient.setQueryData(['focusItems'], searchTasks)
        setActiveSearch(data.output)
        /**
         * The product should show the user the search results, so we don't want
         * to show any created tasks.
         */
        return
      }

      if (createTasks && createTasks.length > 0) {
        setContent('')
        const previousItems: FocusItem[] = queryClient.getQueryData(['focusItems']) || []
        queryClient.setQueryData(['focusItems'], [...(previousItems || []), ...createTasks])
      }
    },
    [setActiveSearch]
  )

  const onStartRecording = useCallback(() => {
    setIsRecording(true)
  }, [setIsRecording])

  const onStopRecording = useCallback(
    (data: string | null) => {
      setIsRecording(false)
      if (!data) return
      generateFocusFromAudio(data)
    },
    [generateFocusFromAudio, setIsRecording]
  )

  const handleSubmit = () => {
    setGenerateError(false)
    generateFocusItems(content)
  }

  const isGenerating = isTextGenerating || isAudioGenerating

  return (
    <View
      style={[styles.container, { paddingTop: intentOutput && intentOutput.length > 0 ? 16 : 0 }]}
    >
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
        <SherpaMessage
          sherpaMessage={intentOutput}
          userMessage={content}
          onChatCreated={(chatId) => setActiveChat(chatId)}
          onCloseClick={() => setIntentOutput(null)}
        />
      ) : null}
      {generateError ? <GenerateError onCloseClick={() => setGenerateError(false)} /> : null}
      {!isRecording && !intentOutput ? (
        <View style={[styles.inputContainer]}>
          <AutoGrowingInput
            editable={!isRecording && isGenerating}
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

type SherpaMessageProps = {
  sherpaMessage: string
  userMessage: string
  onChatCreated: (chatId: string) => void
  onCloseClick: () => void
}
const SherpaMessage = ({
  sherpaMessage,
  userMessage,
  onChatCreated,
  onCloseClick,
}: SherpaMessageProps) => {
  const { mutate: startChat, isPending } = useStartChat({
    userMessage,
    sherpaMessage,
    onSuccess: (data) => {
      onChatCreated(data.id)
    },
  })

  const onDiscussClick = useCallback(() => {
    startChat()
  }, [startChat])

  return (
    <FeedbackBlock style={{ paddingVertical: 12 }}>
      <Text variant="body" color="fg-primary">
        {sherpaMessage}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', columnGap: 12 }}>
        <Pressable
          disabled={isPending}
          onPress={onCloseClick}
          style={[
            {
              flex: 1,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.colors.quaternary,
              marginTop: 12,
              paddingVertical: 8,
              paddingHorizontal: 12,
              alignItems: 'center',
            },
          ]}
        >
          <Text variant="body" color="gray">
            Close
          </Text>
        </Pressable>
        <Pressable
          disabled={isPending}
          onPress={onDiscussClick}
          style={[
            {
              flex: 1,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.colors.quaternary,
              backgroundColor: isPending ? theme.colors.grayLight : theme.colors['fg-primary'],
              marginTop: 12,
              paddingVertical: 8,
              paddingHorizontal: 12,
              alignItems: 'center',
            },
          ]}
        >
          <Text variant="body" color="white">
            Discuss
          </Text>
        </Pressable>
      </View>
    </FeedbackBlock>
  )
}
