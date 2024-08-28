import { type MutationOptions, useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useAppContext } from '~/utils/app-provider/AppProvider';
import { log } from '../logger';
import type { ChatOutput, MessageOutput } from '../schema/graphcache';
import { request } from '../query-client';
import { useChatMessagesQuery } from './chat/ChatMessages.query.generated';
import { useCreateChatMessageMutation } from './chat/CreateChatMessage.mutation.generated';

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
      setSendChatError(false);
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
  const { session } = useAppContext();
  const [messages, setMessages] = useState<MessageOutput[]>([]);
  const { refetch, isError, isPending } = useQuery<MessageOutput[]>({
    queryKey: ['chatMessages', chatId],
    queryFn: async () => {
      const { data } = await request<MessageOutput[]>({
        method: 'GET',
        url: `/chat/${chatId}`,
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      setMessages(data);
      return data;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const addMessages = (newMessages: readonly MessageOutput[]) => {
    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
  };

  return {
    addMessages,
    isPending,
    isError,
    messages,
    refetch,
    setMessages,
  };
};

export const useEndChat = ({
  chatId,
  ...props
}: { chatId: string } & MutationOptions<ChatOutput>) => {
  const { session } = useAppContext();
  return useMutation<ChatOutput>({
    mutationKey: ['endChat', chatId],
    mutationFn: async () => {
      const response = await request<ChatOutput>({
        method: 'POST',
        url: '/chat/end',
        data: JSON.stringify({ chat_id: chatId }),
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      return response.data;
    },
    ...props,
  });
};

export const useActiveChat = () => {
  const { session } = useAppContext();
  return useQuery<ChatOutput>({
    queryKey: ['activeChat'],
    queryFn: async () => {
      const { data } = await request<ChatOutput>({
        method: 'GET',
        url: '/chat/active',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      return data;
    },
  });
};
