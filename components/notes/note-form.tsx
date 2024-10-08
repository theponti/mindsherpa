import { captureException } from '@sentry/react-native'
import type { PropsWithChildren } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { Text, theme } from '~/theme'
import queryClient from '~/utils/query-client'
import type { FocusItem } from '~/utils/services/notes/types'
import { useKeyboardVisible } from '~/utils/use-keyboard-listener'
import { FeedbackBlock } from '../feedback-block'
import type { ActiveSearch } from '../focus/focus-search'
import AudioRecorder from '../media/audio-recorder'
import AutoGrowingInput from '../text-input-autogrow'
import MindsherpaIcon from '../ui/icon'
import { UploadFileButton } from '../upload-file-button'
import { NoteFormMessage } from './note-form-message'
import { FormSubmitButton } from './note-form-submit-button'
import { useGetUserIntent, type GeneratedIntentsResponse } from './use-get-user-intent'

type NoteFormProps = {
  isRecording: boolean
  setActiveChat: (chatId: string) => void
  setActiveSearch: (search: ActiveSearch) => void
  setIsRecording: (isRecording: boolean) => void
}
export const NoteForm = (props: NoteFormProps) => {
  const { isRecording, setActiveSearch, setIsRecording, setActiveChat } = props
  const [content, setContent] = useState('')
  const [createError, setCreateError] = useState<boolean>(false)
  const [generateError, setGenerateError] = useState<boolean>(false)
  const [intentOutput, setIntentOutput] = useState<string | null>(null)
  const { isKeyboardVisible } = useKeyboardVisible()
  const buttonsPaddingBottom = useSharedValue(0)
  const { audioIntentMutation, textIntentMutation } = useGetUserIntent({
    onSuccess: (data) => {
      onGeneratedIntents(data)
    },
    onError: (error) => {
      console.error('Error generating intent:', error)
      captureException(error)
      setGenerateError(true)
    },
  })
  const { mutate: generateFocusFromAudio, isPending: isAudioIntentGenerating } = audioIntentMutation
  const { mutate: generateFocusItems, isPending: isTextIntentGenerating } = textIntentMutation

  const buttonsStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: buttonsPaddingBottom.value,
    }
  })

  useEffect(() => {
    buttonsPaddingBottom.value = withSpring(isKeyboardVisible ? 4 : 16)
  }, [buttonsPaddingBottom, isKeyboardVisible])

  const onGeneratedIntents = useCallback(
    (data: GeneratedIntentsResponse) => {
      const searchTasks = data.search?.output
      const createTasks = data.create?.output
      const chatMessage = data.chat?.output

      if (chatMessage && chatMessage.length > 0) {
        setIntentOutput(chatMessage)
        return
      }

      if (searchTasks && data.output && data.search?.input.keyword) {
        setContent('')
        queryClient.setQueryData(['focusItems'], searchTasks)
        setActiveSearch({
          count: searchTasks.length,
          keyword: data.search?.input.keyword,
        })
        /**
         * The product should show the user the search results, so this function returns
         * instead of displaying the newly created tasks.
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

  const isGenerating = isTextIntentGenerating || isAudioIntentGenerating

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
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
        <NoteFormMessage
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
            value={content}
            onChangeText={setContent}
          />
        </View>
      ) : null}
      <Animated.View style={[styles.actionButtons, buttonsStyle]}>
        <View style={[styles.mediaButtons]}>
          <UploadFileButton />
          <AudioRecorder onStartRecording={onStartRecording} onStopRecording={onStopRecording} />
        </View>
        <FormSubmitButton
          isRecording={isRecording}
          isLoading={isGenerating}
          onSubmitButtonClick={handleSubmit}
        />
      </Animated.View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    minWidth: '100%',
    maxHeight: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 240,
    gap: 8,
    borderColor: theme.colors.grayMedium,
    borderWidth: 1,
    borderRadius: 20,
  },
  inputContainer: {},
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
