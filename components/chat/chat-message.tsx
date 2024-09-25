import { StyleSheet, View } from 'react-native'
import Markdown from 'react-native-markdown-display'
import { Text, theme } from '~/theme'
import { borderStyle } from '~/theme/styles'
import type { MessageOutput } from '~/utils/services/chat/use-chat-messages'

const ChatMessage = ({ message }: { message: MessageOutput }) => {
  const { role, message: content } = message
  const formattedRole = role.toLowerCase()
  const chatBubbleStyle = formattedRole === 'user' ? styles.userMessage : styles.botMessage

  return (
    <View style={[chatBubbleStyle]}>
      <Markdown
        style={{
          body: formattedRole === 'user' ? styles.userMessageText : styles.botMessageText,
        }}
      >
        {content}
      </Markdown>
      {message.focus_items && message.focus_items.length > 0 ? (
        <View style={[styles.focusItems]}>
          {message.focus_items.map((focusItem) => (
            <View key={focusItem.id} style={[styles.focusItem]}>
              <Text variant="body" color="fg-primary">
                {focusItem.text}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  )
}

export const renderMessage = ({ item }: { item: MessageOutput }) => {
  return <ChatMessage message={item} />
}

const styles = StyleSheet.create({
  botMessage: {
    alignSelf: 'flex-start',
  },
  userMessage: {
    alignSelf: 'flex-start',
  },
  userMessageText: {
    fontSize: 18,
    lineHeight: 24,
    color: theme.colors.grayDark,
  },
  botMessageText: {
    fontSize: 24,
    lineHeight: 24,
    color: theme.colors.black,
  },
  focusItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  focusItem: {
    backgroundColor: theme.colors.grayLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
})
