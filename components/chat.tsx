import { LinearProgress } from '@rneui/themed';
import { useState } from 'react';
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

import { Button } from './Button';

import { Box } from '~/theme';
import { messagesService, useChatMessages } from '~/utils/services/messages-service';

export const Chat = ({ chatId, userId }: { chatId: string; userId: string }) => {
  const [chatError, setChatError] = useState(null);
  const [text, setText] = useState('');

  // ========= Data ====================================================================
  const { loading: isMessagesLoading, messages } = useChatMessages({ chatId, userId });

  // ========= Handlers ================================================================
  const handleSend = async () => {
    try {
      const content = text.trim();
      if (content.length > 0) {
        await messagesService.create({ chatId, content, userId });
        setText('');
      }
    } catch (error: any) {
      setChatError(error);
    }
  };

  if (isMessagesLoading) {
    return (
      <Box style={styles.loading}>
        <LinearProgress />
      </Box>
    );
  }

  if (chatError) {
    return (
      <Box style={styles.loading}>
        <Box>{chatError}</Box>
      </Box>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.container}>
        <FlatList
          style={styles.messages}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.message}>
              <Text>{item.text}</Text>
            </View>
          )}
        />
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter message"
            value={text}
            onChangeText={setText}
          />
          <Button title="Send" onPress={handleSend} style={styles.button} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  messages: {
    flex: 1,
  },
  message: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderRadius: 5,
    marginVertical: 4,
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
});
