import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Defs, LinearGradient, Rect, Stop, Svg } from 'react-native-svg';

import { Container } from '~/components/Container';
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
    <Container>
      <Svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          flex: 1,
        }}>
        <Defs>
          <LinearGradient
            id="gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="userSpaceOnUse">
            <Stop offset="0%" stopColor="rgb(0,0,0)" />
            <Stop offset="30%" stopColor="rgb(63,94,251)" />
            <Stop offset="60%" stopColor="rgb(252,70,107)" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#gradient)" />
      </Svg>
      <Box style={{ flex: 1, overflow: 'scroll' }}>
        {!activeChat ? (
          <LoadingFull>
            <Text variant="title">Loading your chat...</Text>
          </LoadingFull>
        ) : null}
        {activeChat ? <Chat chatId={activeChat.id} userId={session!.user.id} /> : null}
      </Box>
    </Container>
  );
}
