import { log } from '../logger';

import { supabase } from '~/utils/supabase';

export type NotebookType = {
  id: string;
  title: string;
  count: number;
  expandedIndex: number | null;
};

export type NoteType = {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
};

export const getNotes = async ({ userId }: { userId: string }) => {
  const { data, error } = await supabase.from('notes').select('*').eq('user_id', userId);

  if (error) {
    log('notes_get_error', error.message);
  }

  return { data, error };
};
