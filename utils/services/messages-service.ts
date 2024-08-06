import { useEffect } from 'react';

import { useChatMessagesQuery } from './ChatMessages.query.generated';
import { useCreateChatMessageMutation } from './CreateChatMessage.mutation.generated';
import { log } from '../logger';
import { Chat } from '../schema/schema-types';

export const useChatMessages = ({ chatId }: { chatId: Chat['id'] }) => {
  const [sendChatMessageResponse, sendChatMessageMutation] = useCreateChatMessageMutation();
  const [messagesResponse, getMessages] = useChatMessagesQuery({
    variables: { chatId },
    pause: true,
    requestPolicy: 'network-only',
  });

  const sendChatMessage = async ({ message }: { message: string }) => {
    try {
      const response = await sendChatMessageMutation({
        chatId,
        message,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data) {
        throw new Error('No data returned');
      }

      if (response.data.sendChatMessage) {
        getMessages();
      }
    } catch (error: any) {
      log('Error sending chat message:', error);
    }
  };

  useEffect(() => {
    getMessages();
  }, []);

  return {
    chatError: Boolean(messagesResponse.error),
    isChatSending: sendChatMessageResponse.fetching,
    messages: messagesResponse.data?.chatMessages,
    loading: messagesResponse.fetching,
    sendChatMessage,
  };
};
