import { useEffect, useState } from 'react';
import { gql, useClient } from 'urql';

import { groqService } from '../ai/groq';
import { log } from '../logger';
import { storage } from '../storage';
import { supabase } from '../supabase';

export class Messages {
  async create({
    chatId,
    content,
    role,
    userId,
  }: {
    chatId: number;
    content: string;
    role: 'user' | 'system' | 'assistant';
    userId: string;
  }) {
    log('message_create_start', { chatId, content, role, userId });
    const { data, error } = await supabase
      .from('messages')
      .insert({ user_id: userId, chat_id: chatId, content, role });
    if (error) {
      log('message_create_error', { error });
    }
    log('message_create_success', { data });
    return { data, error };
  }

  async getMessages({ chatId, userId }: { chatId: number; userId: string }) {
    log('message_get_start', { chatId, userId });
    const { data, error } = await supabase
      .from('messages')
      .select()
      .eq('user_id', userId)
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
      .limit(100);
    if (error) {
      log('message_get_error', { error });
    }
    log('message_get_success', { data: data?.map((message) => message.content.slice(0, 100)) });
    return { data, error };
  }
}

export const messagesService = new Messages();

export const useChatMessages = ({ chatId, userId }: { chatId: number; userId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatSending, setIsChatSending] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>();
  const client = useClient();

  const sendChatMessage = async ({ message }: { message: string }) => {
    setChatError(null);
    setIsChatSending(true);

    try {
      const response = await client.executeMutation({
        key: 1,
        query: gql`
          mutation SendChatMessage($message: String!, $chatId: Int!) {
            sendChatMessage(message: $message, chatId: $chatId) {
              id
              content
              createdAt
              userId
              chatId
              role
            }
          }
        `,
        variables: {
          chatId,
          message,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data) {
        throw new Error('No data returned');
      }

      if (response.data.sendChatMessage) {
        console.log('sendChatMessage', JSON.stringify(response.data.sendChatMessage, null, 2));
        const newMessages = [...messages, ...(response.data.sendChatMessage as Message[])];

        storage.set('chatHistory', JSON.stringify(newMessages));

        setMessages(newMessages);
      }
    } catch (error: any) {
      log('Error sending chat message:', error);
      setChatError(error.message);
    } finally {
      setIsChatSending(false);
    }
  };

  const fetchMessages = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    const { data, error } = await messagesService.getMessages({
      chatId,
      userId,
    });

    if (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
      return;
    }

    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (chatId) {
      fetchMessages();
    }
  }, [chatId]);

  const sendMessage = async (text: string) => {
    try {
      setIsChatSending(true);
      const content = text.trim();

      if (content.length === 0) {
        return;
      }

      const { error } = await messagesService.create({
        chatId,
        content,
        role: 'user',
        userId,
      });

      if (error) {
        throw new Error(error.message);
      }

      // 1. Call groq with chat history and new message
      const groqResponse = await groqService.chat({
        chatHistory: { messages: [...messages, { role: 'user', content: text }] },
        message: text,
      });

      // 2. Update chat history with groqs response
      await messagesService.create({
        chatId,
        content: groqResponse,
        role: 'assistant',
        userId,
      });

      // 3. Save chat history to mmkv
      storage.set('chatHistory', JSON.stringify([...messages, { role: 'user', content: text }]));

      // 4. Update messages with new message
      fetchMessages();
    } catch (error: any) {
      log('Error sending message:', error.message);
      setChatError(error.message);
    } finally {
      setIsChatSending(false);
    }
  };

  return {
    chatError,
    fetchMessages,
    isChatSending,
    messages,
    loading,
    sendChatMessage,
    sendMessage,
  };
};

export type Message = {
  id: string;
  role: 'user' | 'system';
  content: string;
  chat_id: number;
  user_id: string;
};
