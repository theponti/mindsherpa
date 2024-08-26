import { useEffect, useState } from 'react';

import { log } from '../logger';
import { useChatMessagesQuery } from './chat/ChatMessages.query.generated';
import {
  type CreateChatMessageMutation,
  useCreateChatMessageMutation,
} from './chat/CreateChatMessage.mutation.generated';
import type { MessageOutput } from '../schema/graphcache';

export const useSendMessage = ({
  chatId,
  onSuccess,
  onError,
}: {
  chatId: string;
  onSuccess: (messages: readonly MessageOutput[]) => void;
  onError: () => void;
}) => {
  const [message, setMessage] = useState('');
  const [sendChatError, setSendChatError] = useState(false);
  const [sendChatMessageResponse, sendChatMessageMutation] = useCreateChatMessageMutation();

  const sendChatMessage = async () => {
    try {
      const response = await sendChatMessageMutation({
        chatId,
        message,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data || !response.data.sendChatMessage) {
        throw new Error('No data returned');
      }

      setMessage('');
      onSuccess(response.data.sendChatMessage);
    } catch (error) {
      log('Error sending chat message:', error);
      setSendChatError(true);
      onError();
    }
  };

  return {
    message,
    isChatSending: sendChatMessageResponse.fetching,
    sendChatMessage,
    sendChatMessageResponse,
    setMessage,

    // Error handling
    sendChatError,
    setSendChatError,
  };
};

export const useChatMessages = ({ chatId }: { chatId: string }) => {
  const [messages, setMessages] = useState<MessageOutput[]>([]);
  const [messagesResponse, getMessages] = useChatMessagesQuery({
    variables: { chatId },
    pause: true,
    requestPolicy: 'network-only',
  });

  const addMessages = (newMessages: readonly MessageOutput[]) => {
    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
  };

  useEffect(() => {
    getMessages();
  }, [getMessages]);

  useEffect(() => {
    if (messagesResponse.data?.chatMessages.messages) {
      setMessages([...messagesResponse.data.chatMessages.messages]);
    }
  }, [messagesResponse.data]);

  return {
    addMessages,
    loading: messagesResponse.fetching,
    messages,
    messagesError: messagesResponse.error,
  };
};
