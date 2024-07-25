import { StyleSheet, View } from 'react-native';

import { Text } from '~/theme';
import { Message } from '~/utils/services/messages-service';

const ChatMessage = ({ message }: { message: Message }) => {
  const { role, content } = message;
  const chatBubbleStyle = role === 'user' ? styles.userMessage : styles.botMessage;

  return (
    <View style={chatBubbleStyle}>
      <Text style={role === 'user' ? styles.userMessageText : styles.botMessageText}>
        {content}
      </Text>
    </View>
  );
};

export const renderMessage = ({ item }: { item: Message }) => {
  return <ChatMessage message={item} />;
};

const styles = StyleSheet.create({
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
  userMessageText: {
    color: '#fff',
  },
  botMessageText: {
    color: '#000',
  },
});
