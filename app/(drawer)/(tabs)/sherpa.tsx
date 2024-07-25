import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import ChatLoading from '~/components/chat-loading';
import { renderMessage } from '~/components/chat-message';
import MessageForm from '~/components/message-form';
import { useChatMessages } from '~/utils/services/messages-service';

export const Sherpa = ({ chatId, userId }: { chatId: string; userId: string }) => {
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.container}>
        <FlatList
          style={styles.messages}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
        />
        {chatError ? (
          <View style={styles.error}>
            <Text>{chatError}</Text>
          </View>
        ) : null}
        <MessageForm isLoading={isChatSending} onSubmit={sendMessage} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 16,
    marginBottom: 26,
  },
  messages: {
    paddingHorizontal: 24,
    flex: 1,
  },
  error: {
    display: 'flex',
    gap: 4,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    marginVertical: 4,
  },
});
