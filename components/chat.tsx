import { LinearProgress } from '@rneui/themed';
import { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withClamp,
  withSpring,
} from 'react-native-reanimated';

import { Button } from './Button';

import { Box } from '~/theme';
import { log } from '~/utils/logger';
import { Message, messagesService, useChatMessages } from '~/utils/services/messages-service';

export const Chat = ({ chatId, userId }: { chatId: string; userId: string }) => {
  const [chatError, setChatError] = useState(null);
  const [text, setText] = useState('');

  // ========= Data ====================================================================
  const {
    fetchMessages,
    loading: isMessagesLoading,
    messages,
  } = useChatMessages({ chatId, userId });

  // ========= Handlers ================================================================
  const handleSend = async () => {
    try {
      const content = text.trim();
      if (content.length > 0) {
        const { error } = await messagesService.create({ chatId, content, userId });

        if (error) {
          throw new Error(error.message);
        }
        fetchMessages();
        setText('');
      }
    } catch (error: any) {
      log('Error sending message:', error.message);
      setChatError(error.message);
    }
  };

  const onSherpaFormSubmit = async (text: string) => {
    try {
      const content = text.trim();
      if (content.length > 0) {
        const { error } = await messagesService.create({ chatId, content, userId });
        // ! TODO - Query Sherpa API for response

        if (error) {
          throw new Error(error.message);
        }
        fetchMessages();
        setText('');
      }
    } catch (error: any) {
      log('Error sending message:', error.message);
      setChatError(error.message);
    }
  };

  if (isMessagesLoading) {
    return (
      <Box style={styles.loading}>
        <LinearProgress />
      </Box>
    );
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
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter message"
            value={text}
            onChangeText={setText}
          />
          <Button title="Send" onPress={handleSend} style={styles.button} />
        </View>
        <SherpaForm onSubmit={onSherpaFormSubmit} />
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const SherpaForm = ({ onSubmit }: { onSubmit: (text: string) => void }) => {
  const [text, setText] = useState('');
  const width = useSharedValue(200);

  const onSubmitButtonClick = useCallback(() => {
    onSubmit(text);
  }, [text]);

  const formStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withClamp({ min: 0, max: 200 }, withSpring(width.value, { duration: 2000 })),
      },
    ],
  }));

  useEffect(() => {
    width.value = 0;
  });

  return (
    <Animated.View style={[styles.form, formStyles]}>
      <TextInput
        style={styles.input}
        placeholder="Ask sherpa"
        value={text}
        onChangeText={setText}
      />
      <Button title="Send" onPress={onSubmitButtonClick} style={styles.button} />
    </Animated.View>
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
    paddingHorizontal: 24,
    // paddingVertical: 24,
    marginTop: 16,
    marginBottom: 26,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messages: {
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
    padding: 10,
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
  form: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 5,
    height: 50,
  },
  button: {
    height: 50,
    borderRadius: 8,
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
