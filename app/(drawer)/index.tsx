import { LinearProgress } from '@rneui/themed';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

import { Container } from '~/components/Container';
import { Chat } from '~/components/chat';
import { Box } from '~/theme';
import { useAuth } from '~/utils/auth/auth-context';
import { chatsService } from '~/utils/services/chats-service';

export default function Dashboard() {
  const { session } = useAuth();
  const [activeChat, setActiveChat] = useState<any>(null);
  const [isActiveChatLoading, setIsActiveChatLoading] = useState(true);

  useEffect(() => {
    async function getActiveChat() {
      const chat = await chatsService.getActiveChat(session!.user.id);
      setActiveChat(chat);
      setIsActiveChatLoading(false);
    }
    getActiveChat();
  }, []);

  if (isActiveChatLoading) {
    return (
      <Box style={styles.loading}>
        <LinearProgress color="blue" />
      </Box>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Meow' }} />
      <Container>
        <Box style={styles.chatContainer}>
          <Chat chatId={activeChat.id} userId={session!.user.id} />
        </Box>
      </Container>
    </>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
