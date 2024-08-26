import { useCallback, useEffect, useRef } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Text } from '~/theme';
import { useChatMessages } from '~/utils/services/use-chat-messages';
import type { MessageOutput } from '~/utils/schema/graphcache';
import { FeedbackBlock } from '../feedback-block';
import { ChatForm } from './chat-form';
import ChatLoading from './chat-loading';
import { renderMessage } from './chat-message';

export const Chat = ({ chatId }: { chatId: string }) => {
  const { addMessages, loading: isMessagesLoading, messages } = useChatMessages({ chatId });
  const flatListRef = useRef<FlatList>(null);

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 500);
  }, [messages, scrollToBottom]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      style={styles.container}>
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
            onLayout={scrollToBottom}
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
          onSuccess={(messages: readonly MessageOutput[]) => addMessages(messages)}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

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
});
