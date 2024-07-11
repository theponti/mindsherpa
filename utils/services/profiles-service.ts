import { supabase } from '../supabase';

export const PROFILES = 'Profile';

type Profile = {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
};

export class Profiles {
  async create(userId: string) {
    return supabase.from(PROFILES).insert({ user_id: userId }).select();
  }

  async getProfile(userId: string) {
    return supabase.from(PROFILES).select().eq('user_id', userId).single();
  }

  async update(userId: string, profile: Partial<Profile>) {
    return supabase.from(PROFILES).update(profile).eq('user_id', userId);
  }
}

export const profilesService = new Profiles();
