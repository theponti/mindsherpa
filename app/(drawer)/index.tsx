import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { LoadingFull } from '~/components/LoadingFull';
import { Chat } from '~/components/chat';
import { Box } from '~/theme';
import { useAuth } from '~/utils/auth/auth-context';
import { chatsService } from '~/utils/services/chats-service';

export default function Dashboard() {
  const { session } = useAuth();
  const [activeChat, setActiveChat] = useState<any>(null);

  useEffect(() => {
    async function getActiveChat() {
      const chat = await chatsService.getActiveChat(session!.user.id);
      setActiveChat(chat);
    }
    getActiveChat();
  }, []);

  if (!activeChat) {
    return (
      <Box style={styles.loading}>
        <LoadingFull title="Loading chat" />
      </Box>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Chats' }} />
      <Box flex={1}>
        <Chat chatId={activeChat.id} userId={session!.user.id} />
      </Box>
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
