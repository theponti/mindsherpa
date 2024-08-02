import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';

import { LoadingFull } from '~/components/LoadingFull';
import { Chat } from '~/components/chat';
import { Text } from '~/theme';
import { useAuth } from '~/utils/auth/auth-context';
import { chatsService } from '~/utils/services/chats-service';

export default function Dashboard() {
  const { session, isLoadingAuth } = useAuth();
  const [activeChat, setActiveChat] = useState<any>(null);

  useEffect(() => {
    async function getActiveChat() {
      const chat = await chatsService.getActiveChat(session!.user.id);
      setActiveChat(chat);
    }
    getActiveChat();
  }, []);

  if (!isLoadingAuth && !session) {
    return <Redirect href="(auth)" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: 60 }}>
      {!activeChat ? (
        <LoadingFull>
          <Text variant="title">Loading your chat...</Text>
        </LoadingFull>
      ) : null}
      {activeChat ? <Chat chatId={activeChat.id} userId={session!.user.id} /> : null}
    </SafeAreaView>
  );
}
