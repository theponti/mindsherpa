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

import ChatLoading from './chat-loading';
import { renderMessage } from './chat-message';
import { FeedbackBlock } from '../feedback-block';

import { Text } from '~/theme';
import { useChatMessages } from '~/utils/services/messages-service';
import { ChatSummary } from './chat-summary';
import { NoteForm } from '../notes/note-form';

export const Chat = ({ chatId }: { chatId: string }) => {
  const {
    chatError,
    isChatSending,
    loading: isMessagesLoading,
    messages,
    sendChatMessage,
    summary,
  } = useChatMessages({ chatId });
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
  }, [scrollToBottom, messages]);

  return (
    <View style={styles.container}>
      {summary ? <ChatSummary summary={summary} /> : null}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>

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
        {chatError ? (
          <FeedbackBlock>
            <Text>{chatError}</Text>
          </FeedbackBlock>
        ) : null}
        <NoteForm onSubmit={(message: string) => sendChatMessage({ message })} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 12,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    paddingHorizontal: 24,
    rowGap: 12,
  },
});
