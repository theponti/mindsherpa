import { StyleSheet, View } from 'react-native'
import Markdown from 'react-native-markdown-display'
import type { MessageOutput } from '~/components/chat/use-chat-messages'
import { theme } from '~/theme'
import { borderStyle } from '~/theme/styles'

const ChatMessage = ({ message }: { message: MessageOutput }) => {
  const { role, message: content } = message
  const formattedRole = role.toLowerCase()
  const chatBubbleStyle = formattedRole === 'user' ? styles.userMessage : styles.botMessage

  return (
    <View style={[borderStyle.border, chatBubbleStyle, {}]}>
      <Markdown
        style={{
          body: formattedRole === 'user' ? styles.userMessageText : styles.botMessageText,
        }}
      >
        {content}
      </Markdown>
    </View>
  )
}

export const renderMessage = ({ item }: { item: MessageOutput }) => {
  return <ChatMessage message={item} />
}

const borderRadiusSize = 8

const baseMessageStyle = {
  padding: 14,
  borderBottomRightRadius: 0,
  borderTopRightRadius: borderRadiusSize,
  borderBottomLeftRadius: borderRadiusSize,
  borderTopLeftRadius: borderRadiusSize,
}
const styles = StyleSheet.create({
  botMessage: {
    ...baseMessageStyle,
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.blue,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: borderRadiusSize,
    borderTopLeftRadius: borderRadiusSize,
    borderTopRightRadius: borderRadiusSize,
  },
  userMessage: {
    ...baseMessageStyle,
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.white,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  userMessageText: {
    fontSize: 18,
    lineHeight: 24,
    color: theme.colors.black,
  },
  botMessageText: {
    fontSize: 18,
    lineHeight: 24,
    color: theme.colors.black,
  },
})
