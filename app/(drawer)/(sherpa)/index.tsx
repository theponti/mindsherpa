import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { LoadingFull } from '~/components/LoadingFull';
import { Chat } from '~/components/chat/chat';
import { ViewHeader } from '~/components/view-header';
import { Text } from '~/theme';
import { useAppContext } from '~/utils/app-provider';
import type { ChatOutput } from '~/utils/schema/graphcache';
import { useActiveChat } from '~/utils/services/use-chat-messages';

export default function Sherpa() {
  const { session, isLoadingAuth } = useAppContext();
  const [activeChat, setActiveChat] = useState<ChatOutput | null>(null);
  const { isPending: isLoadingActiveChat, refetch: getActiveChat } = useActiveChat();

  useEffect(() => {
    async function initialLoad() {
      const resposnse = await getActiveChat();

      if (resposnse.data) {
        setActiveChat(resposnse.data);
      }
    }
    initialLoad();
  }, [getActiveChat]);

  if (!isLoadingAuth && !session) {
    return <Redirect href="/(auth)" />;
  }

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
  );
}
