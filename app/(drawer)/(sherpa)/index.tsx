import { useRouter } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { LoadingFull } from '~/components/LoadingFull'
import BlurredGradientBackground from '~/components/chat/blurred-background'
import { Chat } from '~/components/chat/chat'
import { ViewHeader } from '~/components/view-header'
import { Text } from '~/theme'
import type { Chat as ChatType } from '~/utils/services/chat/types'
import { useActiveChat } from '~/utils/services/chat/use-chat-messages'

export default function Sherpa() {
  const router = useRouter()
  const [activeChat, setActiveChat] = useState<ChatType | null>(null)
  const { isPending: isLoadingActiveChat, refetch: getActiveChat } = useActiveChat()

  useEffect(() => {
    async function initialLoad() {
      const response = await getActiveChat()

      if (response.data) {
        setActiveChat(response.data)
      }
    }
    initialLoad()
  }, [getActiveChat])

  const onChatEnd = useCallback(() => {
    router.push('/(drawer)/focus')
  }, [router])

  return (
    <BlurredGradientBackground>
      <ViewHeader />
      {isLoadingActiveChat ? (
        <LoadingFull>
          <Text variant="title">Loading your chat...</Text>
        </LoadingFull>
      ) : null}
      {activeChat ? <Chat chatId={activeChat.id} onChatEnd={onChatEnd} /> : null}
    </BlurredGradientBackground>
  )
}
