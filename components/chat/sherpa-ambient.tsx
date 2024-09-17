import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useCallback } from 'react'
import { StyleSheet, View, type ViewStyle } from 'react-native'
import { Text } from '~/theme'
import queryClient from '~/utils/query-client'
import { useChatMessages, useEndChat } from '~/utils/services/chat/use-chat-messages'
import { LoadingContainer } from '../LoadingFull'
import { PulsingCircle } from '../animated/pulsing-circle'
import { ChatForm } from './chat-form'

const RadialGradientView = ({
  children,
  style,
}: { children: React.ReactNode; style?: ViewStyle }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.gradientContainer}>
        <BlurView intensity={80}>
          <LinearGradient
            colors={['rgba(163, 171, 254, 0.5)', 'rgba(163, 171, 254, 0.05)']}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          />
        </BlurView>
      </View>
      <View style={styles.textContainer}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  gradient: {
    width: 300,
    height: 300,
    borderRadius: 900,
    opacity: 0.5,
  },
})

export const SherpaAmbient = React.memo(
  ({ chatId, onEndChat }: { chatId: string; onEndChat: () => void }) => {
    const { data: messages, isLoading } = useChatMessages({ chatId })
    const { mutate: endChat, isPending } = useEndChat({
      chatId,
      onSuccess: () => {
        onEndChat()
        queryClient.invalidateQueries({ queryKey: ['chatMessages', chatId] })
      },
    })
    const assistantMessage = messages?.findLast((message) => message.role === 'assistant')
    const onChatEnd = useCallback(() => {
      endChat()
    }, [endChat])

    if (isLoading) {
      return (
        <LoadingContainer>
          <PulsingCircle />
        </LoadingContainer>
      )
    }

    return (
      <View style={{ flex: 1 }}>
        <RadialGradientView
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 32,
          }}
        >
          <Text variant="text-md" color="fg-primary">
            {assistantMessage?.message}
          </Text>
        </RadialGradientView>
        <ChatForm chatId={chatId} isEndingChat={isPending} onEndChat={onChatEnd} />
      </View>
    )
  }
)
