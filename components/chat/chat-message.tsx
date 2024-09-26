import { Pressable, StyleSheet, View } from 'react-native'
import Markdown from 'react-native-markdown-display'
import { Text, theme } from '~/theme'
import type { MessageOutput } from '~/utils/services/chat/use-chat-messages'
import MindsherpaIcon from '../ui/icon'

const ChatMessage = ({ message }: { message: MessageOutput }) => {
  const { role, message: content } = message
  const formattedRole = role.toLowerCase()
  const isUser = formattedRole === 'user'
  const chatBubbleStyle = isUser ? styles.userMessage : styles.botMessage

  return (
    <View style={[chatBubbleStyle]}>
      <Markdown
        style={{
          body: isUser ? styles.userMessageText : styles.botMessageText,
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

export const renderMessage = ({ item, index }: { item: MessageOutput; index: number }) => {
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

const ChatMessageActions = ({ message }: { message: MessageOutput }) => {
  const onAddToFocusPress = () => {
    console.log('add to focus')
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'flex-end',
        columnGap: 12,
      }}
    >
      <Pressable
        onPress={onAddToFocusPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          columnGap: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderColor: theme.colors.grayDark,
          borderWidth: 1,
          borderRadius: 12,
        }}
      >
        <Text variant="body" color="fg-primary">
          Add to focus
        </Text>
        <MindsherpaIcon name="wand-magic-sparkles" size={20} color={theme.colors.grayDark} />
      </Pressable>
    </View>
  )
}
