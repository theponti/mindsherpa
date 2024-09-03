import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { LoadingFull } from '~/components/LoadingFull'
import { Chat } from '~/components/chat/chat'
import { ViewHeader } from '~/components/view-header'
import { Text } from '~/theme'
import type { Chat as ChatType } from '~/utils/services/chat/types'
import { useActiveChat } from '~/utils/services/use-chat-messages'

export default function Sherpa() {
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

  return (
    <View style={{ flex: 1 }}>
      <ViewHeader />
      {isLoadingActiveChat ? (
        <LoadingFull>
          <Text variant="title">Loading your chat...</Text>
        </LoadingFull>
      ) : null}
      {activeChat ? <Chat chatId={activeChat.id} onChatEnd={getActiveChat} /> : null}
    </View>
  )
}
