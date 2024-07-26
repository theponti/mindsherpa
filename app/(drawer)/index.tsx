import { Redirect, Stack } from 'expo-router';
import { useEffect, useState } from 'react';

import { LoadingFull } from '~/components/LoadingFull';
import { Chat } from '~/components/chat';
import { Box, Text } from '~/theme';
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
    return <Redirect href="(auth)/index" />;
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Chats' }} />
      <Box flex={1}>
        {!activeChat ? (
          <LoadingFull>
            <Text variant="title">Loading your chat...</Text>
          </LoadingFull>
        ) : null}
        {activeChat ? <Chat chatId={activeChat.id} userId={session!.user.id} /> : null}
      </Box>
    </>
  );
}
