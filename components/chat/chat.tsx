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
import { useChatMessages, useEndChat } from '~/utils/services/use-chat-messages'
import type { MessageOutput } from '~/utils/schema/graphcache'
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
    addMessages,
    isPending: isMessagesLoading,
    messages,
    setMessages,
  } = useChatMessages({ chatId })
  const { mutate: endChat, isPending: isEndingChat } = useEndChat({
    chatId,
    onSuccess: () => {
      setMessages([])
      onChatEnd()
    },
  })
  const flatListRef = useRef<FlatList>(null)

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages.length > 0) {
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
            data={messages}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={renderMessage}
            onContentSizeChange={scrollToBottom}
            getItemLayout={(_, index) => ({
              length: messages.length,
              offset: 100 * index,
              index,
            })}
            onStartShouldSetResponder={() => true}
          />
        )}

        {!isMessagesLoading && messages && messages.length === 0 ? (
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
          onSuccess={(messages: readonly MessageOutput[]) => addMessages(messages)}
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
