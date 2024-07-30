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

  if (isMessagesLoading) {
    return <ChatLoading />;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        style={styles.container}>
        <View style={[styles.messagesWrap]}>
          <FlatList
            scrollEnabled
            data={messages}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesContainer}
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
    overflow: 'scroll',
  },
  messagesWrap: {
    flex: 1,
  },
  messagesContainer: {
    // Prevent messages from being hidden behind the keyboard.
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 25,
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  messageForm: {},
});
