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

const borderRadiusSize = 20;

const baseMessageStyle = {
  padding: 14,
  borderBottomRightRadius: 0,
  borderTopRightRadius: borderRadiusSize,
  borderBottomLeftRadius: borderRadiusSize,
  borderTopLeftRadius: borderRadiusSize,
  backgroundColor: '#000',
  borderRadius: 5,
  marginVertical: 8,
};
const styles = StyleSheet.create({
  botMessage: {
    ...baseMessageStyle,
    borderTopLeftRadius: borderRadiusSize,
    borderTopRightRadius: borderRadiusSize,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: borderRadiusSize,
    backgroundColor: '#f9f9f9',
  },
  userMessage: {
    ...baseMessageStyle,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
  },
  userMessageText: {
    color: '#fff',
    fontSize: 20,
  },
  botMessageText: {
    color: '#000',
    fontSize: 18,
    lineHeight: 26,
  },
});
