import { useCallback, useEffect, useRef } from 'react'
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

import { Text } from '~/theme'
import queryClient from '~/utils/query-client'
import { useChatMessages, useEndChat } from '~/utils/services/chat/use-chat-messages'
import { FeedbackBlock } from '../feedback-block'
import { ChatForm } from './chat-form'
import ChatLoading from './chat-loading'
import { renderMessage } from './chat-message'

export type ChatProps = {
  chatId: string
  onChatEnd: () => void
}
export const Chat = (props: ChatProps) => {
  const { chatId, onChatEnd } = props
  const { isPending: isMessagesLoading, data: messages } = useChatMessages({ chatId })
  const { mutate: endChat, isPending: isEndingChat } = useEndChat({
    chatId,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', chatId] })
      onChatEnd()
    },
  })
  const flatListRef = useRef<FlatList>(null)

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 600)
    }
  }, [messages])

  const formattedMessages = messages && messages.length > 0 ? messages : []
  const hasMessages = Boolean(formattedMessages && formattedMessages.length > 0)

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={StyleSheet.absoluteFillObject} />
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        {isMessagesLoading ? (
          <ChatLoading />
        ) : (
          <FlatList
            ref={flatListRef}
            contentContainerStyle={styles.messagesContainer}
            data={formattedMessages}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={renderMessage}
            onContentSizeChange={scrollToBottom}
          />
        )}
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {!isMessagesLoading && !hasMessages ? (
          <FeedbackBlock error={false}>
            <Text variant="body" color="quaternary">
              How can Sherpa help?
            </Text>
          </FeedbackBlock>
        ) : null}

        <ChatForm chatId={chatId} isEndingChat={isEndingChat} onEndChat={endChat} />
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingHorizontal: 24,
    rowGap: 12,
  },
})
