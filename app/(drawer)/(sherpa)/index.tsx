import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native';

import { LoadingFull } from '~/components/LoadingFull';
import { ScreenContent } from '~/components/ScreenContent';
import { Chat } from '~/components/chat/chat';
import { ViewHeader } from '~/components/view-header';
import { Text } from '~/theme';
import { useAppContext } from '~/utils/app-provider';
import { useChatsQuery } from '~/utils/services/chat/Chats.query.generated';

export default function Sherpa() {
  const { session, isLoadingAuth } = useAppContext();
  const [getChatResponse, getChats] = useChatsQuery({
    pause: true,
    requestPolicy: 'network-only',
  });

  useEffect(() => {
    if (session) {
      getChats();
    }
  }, [session, getChats]);

  const activeChat = getChatResponse.data?.chats[0];

  if (!isLoadingAuth && !session) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <ViewHeader />
      {getChatResponse.fetching ? (
        <LoadingFull>
          <Text variant="title">Loading your chat...</Text>
        </LoadingFull>
      ) : null}
      {activeChat ? <Chat chatId={activeChat.id} /> : null}
    </View>
  );
}
