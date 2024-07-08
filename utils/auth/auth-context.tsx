import { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

import { supabase } from '../supabase';

export type Profile = {
  id: string;
  avatar_url: string;
  name: string;
  created_at: string;
  updated_at: string;
};

type AuthContextSession = Session | null;
const AuthContext = createContext<{
  authError: any;
  isLoadingAuth: boolean;
  profile: Profile | null;
  session: AuthContextSession;
} | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [session, setSession] = useState<AuthContextSession>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    async function getInitialSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        const { user } = session;
        const profile = await supabase.from('profiles').select().eq('user_id', user.id).single();

        if (!user.email) {
          return;
        }

        if (!profile.data && user) {
          const { data, error } = await supabase.from('Profile').insert({});

          if (error) {
            // ! TODO Replace with a proper error handling (toast notification, etc.)
            console.error('Error creating profile:', error);
          }

          setProfile(data);
        }

        setSession(session);
      }

      if (error) {
        setAuthError(error.message);
      }

      setIsLoadingAuth(false);
    }

    getInitialSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ authError, isLoadingAuth, profile, session }}>
      {children}
    </AuthContext.Provider>
  );
}
