import { useEffect, useState } from 'react';

import { supabase } from '../supabase';

export class Messages {
  async create({
    chatId,
    content,
    role,
    userId,
  }: {
    chatId: string;
    content: string;
    role: 'user' | 'system';
    userId: string;
  }) {
    return supabase.from('messages').insert({ user_id: userId, chat_id: chatId, content, role });
  }

  async getMessages({ chatId, userId }: { chatId: string; userId: string }) {
    return supabase
      .from('messages')
      .select()
      .eq('user_id', userId)
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
      .limit(100);
  }
}

export const messagesService = new Messages();

export const useChatMessages = ({ chatId, userId }: { chatId: string; userId: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>();

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

  return { fetchMessages, messages, loading };
};

export type Message = {
  id: string;
  role: 'user' | 'system';
  content: string;
  chat_id: number;
  user_id: string;
};
