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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.container}>
        <View style={[styles.messagesWrap]}>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messagesContainer}
          />
        </View>
        {chatError ? (
          <View style={styles.error}>
            <Text>{chatError}</Text>
          </View>
        ) : null}
        <MessageForm
          isLoading={isChatSending}
          onSubmit={sendMessage}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            marginBottom: 26,
          }}
        />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
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
  messagesWrap: {
    flex: 1,
  },
  messagesContainer: {
    // Prevent messages from being hidden behind the keyboard.
    paddingBottom: 250,
    paddingTop: 16,
    paddingHorizontal: 24,
    flexGrow: 1,
  },
});
