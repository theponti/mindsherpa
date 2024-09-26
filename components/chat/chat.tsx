import { useCallback, useRef, useState } from 'react'
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'

import queryClient from '~/utils/query-client'
import { useChatMessages, useEndChat } from '~/utils/services/chat/use-chat-messages'
import { Button } from '../Button'
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
  const { mutate: endChat } = useEndChat({
    chatId,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', chatId] })
      onChatEnd()
    },
  })
  const flatListRef = useRef<FlatList>(null)

  const formattedMessages = messages && messages.length > 0 ? messages : []

  const onEndChatPress = useCallback(() => {
    endChat()
  }, [endChat])

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          animated: true,
          index: messages.length - 1,
          viewOffset: -20,
        })
      }, 0)
    }
  }, [messages])

  return (
    <View style={{ flex: 1 }}>
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
          onLayout={scrollToBottom}
          onContentSizeChange={scrollToBottom}
          onScrollToIndexFailed={scrollToBottom}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 115 : 0}
        style={{ marginBottom: 24, paddingHorizontal: 12 }}
      >
        <ChatForm chatId={chatId} onEndChat={endChat} />
      </KeyboardAvoidingView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 24,
          marginBottom: 24,
        }}
      >
        <Button title="End Chat" onPress={onEndChatPress} />
      </View>
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
