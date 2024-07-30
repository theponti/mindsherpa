import { useEffect, useRef } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import ChatLoading from './chat-loading';
import { renderMessage } from './chat-message';
import { FeedbackBlock } from './feedback-block';
import MessageForm from './message-form';

import { Text } from '~/theme';
import { useChatMessages } from '~/utils/services/messages-service';

export const Chat = ({ chatId, userId }: { chatId: string; userId: string }) => {
  const {
    chatError,
    isChatSending,
    loading: isMessagesLoading,
    messages,
    sendMessage,
  } = useChatMessages({ chatId, userId });
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 2000 });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isMessagesLoading) {
    return <ChatLoading />;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={styles.container}>
        <View style={styles.messagesWrap}>
          <FlatList
            ref={flatListRef}
            contentContainerStyle={styles.messagesContainer}
            data={messages}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={renderMessage}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
          />
        </View>
        {chatError ? (
          <FeedbackBlock>
            <Text>{chatError}</Text>
          </FeedbackBlock>
        ) : null}
        <MessageForm isLoading={isChatSending} onSubmit={sendMessage} style={styles.messageForm} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesWrap: {
    flex: 1,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingBottom: 50,
    paddingTop: 50,
    paddingHorizontal: 24,
  },
  messageForm: {},
});
