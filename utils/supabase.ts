import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { makeRedirectUri } from 'expo-auth-session';
import { AppState } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing env.EXPO_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing env.EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export const useMagicLink = () => {
  const redirectTo = makeRedirectUri();

  const signInWithOtp = async (email: string) => {
    return supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
  };

  return { signInWithOtp };
};

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
    return supabase.from(PROFILES).insert({ user_id: userId });
  }

  async getProfile(userId: string) {
    return supabase.from(PROFILES).select().eq('user_id', userId).single();
  }

  async update(userId: string, profile: Partial<Profile>) {
    return supabase.from(PROFILES).update(profile).eq('user_id', userId);
  }
}

export const profiles = new Profiles();
