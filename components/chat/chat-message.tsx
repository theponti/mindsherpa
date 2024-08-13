import { StyleSheet, View } from 'react-native';

import { Text } from '~/theme';
import { Message } from '~/utils/schema/graphcache';
import { Colors, borderStyle } from '~/utils/styles';

const ChatMessage = ({ message }: { message: Message }) => {
  const { role, message: content } = message;
  const formattedRole = role.toLowerCase();
  const chatBubbleStyle = formattedRole === 'user' ? styles.userMessage : styles.botMessage;

  return (
    <View style={[borderStyle.border, chatBubbleStyle, {}]}>
      <Text
        variant="body"
        style={formattedRole === 'user' ? styles.userMessageText : styles.botMessageText}>
        {content}
      </Text>
    </View>
  );
};

export const renderMessage = ({ item }: { item: Message }) => {
  return <ChatMessage message={item} />;
};

const borderRadiusSize = 8;

const baseMessageStyle = {
  padding: 14,
  borderBottomRightRadius: 0,
  borderTopRightRadius: borderRadiusSize,
  borderBottomLeftRadius: borderRadiusSize,
  borderTopLeftRadius: borderRadiusSize,
};
const styles = StyleSheet.create({
  botMessage: {
    ...baseMessageStyle,
    alignSelf: 'flex-start',
    backgroundColor: Colors.blue,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: borderRadiusSize,
    borderTopLeftRadius: borderRadiusSize,
    borderTopRightRadius: borderRadiusSize,
  },
  userMessage: {
    ...baseMessageStyle,
    alignSelf: 'flex-end',
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  userMessageText: {
    color: Colors.black,
  },
  botMessageText: {
    color: Colors.black,
  },
});