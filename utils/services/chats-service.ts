import { log } from '../logger';
import { supabase } from '../supabase';

class Chats {
  async getChats() {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data?.session?.user) {
      console.error('Error fetching chats:', error);
      return;
    }

    return supabase.from('chats').select().eq('user_id', data.session.user.id);
  }

  async create(userId: string) {
    return supabase.from('chats').insert({ user_id: userId }).select();
  }

  async getActiveChat(userId: string) {
    const getActiveChatResponse = await supabase
      .from('chats')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .single();

    if (!getActiveChatResponse.data) {
      const createChatResponse = await this.create(userId);

      if (createChatResponse.error) {
        log('Could not create chat', createChatResponse.error.message);
        throw new Error(createChatResponse.error.message);
      }

      return createChatResponse.data;
    }

    return getActiveChatResponse.data;
  }
}

export const chatsService = new Chats();
