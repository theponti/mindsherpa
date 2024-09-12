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
import { useChatMessages, useEndChat } from '~/utils/services/use-chat-messages'
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
  const {
    isPending: isMessagesLoading,
    data: messages,
  } = useChatMessages({ chatId })
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
      flatListRef.current.scrollToIndex({
        index: messages.length > 2 ? messages.length - 1 : 1,
        viewOffset: -100,
      })
    }
  }, [messages])

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom()
    }, 500)
  }, [scrollToBottom])

  const formattedMessages = messages && messages.length > 0 ? messages : []
  const hasMessages = Boolean(formattedMessages && formattedMessages.length > 0)
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      style={styles.container}
    >
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
            getItemLayout={(_, index) => ({
              length: formattedMessages.length,
              offset: 100 * index,
              index,
            })}
            onStartShouldSetResponder={() => true}
          />
        )}

        {!isMessagesLoading && !hasMessages ? (
          <FeedbackBlock error={false}>
            <Text variant="body" color="quaternary">
              How can Sherpa help?
            </Text>
          </FeedbackBlock>
        ) : null}

        <ChatForm
          chatId={chatId}
          isEndingChat={isEndingChat}
          onEndChat={endChat}
        />
      </View>
    </KeyboardAvoidingView>
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
