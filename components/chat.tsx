import { useState } from 'react';
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
import MessageForm from './message-form';

import { Text } from '~/theme';
import { log } from '~/utils/logger';
import { Message, messagesService, useChatMessages } from '~/utils/services/messages-service';

export const Chat = ({ chatId, userId }: { chatId: string; userId: string }) => {
  const [chatError, setChatError] = useState(null);

  // ========= Data ====================================================================
  const {
    fetchMessages,
    loading: isMessagesLoading,
    messages,
  } = useChatMessages({ chatId, userId });

  // ========= Handlers ================================================================
  const handleSend = async (text: string) => {
    try {
      const content = text.trim();
      if (content.length > 0) {
        const { error } = await messagesService.create({ chatId, content, userId });

        if (error) {
          throw new Error(error.message);
        }

        fetchMessages();
      }
    } catch (error: any) {
      log('Error sending message:', error.message);
      setChatError(error.message);
    }
  };

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
          contentContainerStyle={styles.messagesContainer}
        />
        {chatError ? (
          <View style={styles.error}>
            <Text>{chatError}</Text>
          </View>
        ) : null}
        <MessageForm onSubmit={handleSend} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const ChatMessage = ({ message }: { message: Message }) => {
  const { role, content } = message;
  const chatBubbleStyle = role === 'user' ? styles.userMessage : styles.botMessage;

  return (
    <View style={chatBubbleStyle}>
      <Text style={styles.messageText}>{content}</Text>
    </View>
  );
};

const renderMessage = ({ item }: { item: Message }) => {
  return <ChatMessage message={item} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    // paddingVertical: 24,
    marginTop: 16,
    marginBottom: 26,
  },
  messages: {
    paddingHorizontal: 24,
    flex: 1,
  },
  botMessage: {
    fontSize: 16,
    padding: 10,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  userMessage: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 4,
  },
  messageText: {
    color: '#fff',
  },
  error: {
    display: 'flex',
    gap: 4,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    marginVertical: 4,
  },
  messagesContainer: {
    // Prevent messages from being hidden behind the keyboard.
    paddingBottom: 150,
    paddingTop: 16,
  },
});
