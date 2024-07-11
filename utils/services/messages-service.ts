import { useEffect, useState } from 'react';

import { supabase } from '../supabase';

export class Messages {
  async create(userId: string, message: string) {
    return supabase.from('messages').insert({ user_id: userId, message });
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
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await messagesService.getMessages({ chatId, userId });
      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
      setLoading(false);
    };

    fetchMessages();
  }, [chatId]);

  return { messages, loading };
};
