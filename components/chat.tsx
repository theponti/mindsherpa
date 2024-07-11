import { LinearProgress } from '@rneui/themed';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';

import { Button } from './Button';

import { Box } from '~/theme';
import { testBorder } from '~/utils';
import { messagesService, useChatMessages } from '~/utils/services/messages-service';

export const Chat = ({ chatId, userId }: { chatId: string; userId: string }) => {
  const [chatError, setChatError] = useState(null);
  const { loading: isMessagesLoading, messages } = useChatMessages({ chatId, userId });

  const onInputChange = async (e: any) => {
    try {
      const message = e.target.value;
      await messagesService.create(userId, message);
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
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
      <View style={styles.container}>
        <Box style={styles.messages}>
          {messages.map((message: any) => (
            <Box key={message.id}>{message.content}</Box>
          ))}
        </Box>
        <Box style={styles.form}>
          <TextInput
            placeholder="What's on your mind?"
            onChange={onInputChange}
            style={styles.input}
          />
          <Button style={styles.button} title="Post" />
        </Box>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messages: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'scroll',
    gap: 8,
    padding: 24,
    ...testBorder,
  },
  form: {
    maxWidth: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    ...testBorder,
  },
  button: {
    borderRadius: 10,
    color: 'white',
    minWidth: 50,
  },
});
