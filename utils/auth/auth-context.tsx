import { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useState } from 'react';

import { log } from '../logger';
import { profiles, supabase } from '../supabase';

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
      const getSessionResponse = await supabase.auth.getSession();

      if (getSessionResponse.error) {
        // ! TODO - Handle error
        setAuthError('Could not retrieve session');
        log('Could not retrieve session', getSessionResponse.error.message);
        setIsLoadingAuth(false);
        return;
      }

      const { data: sessionData } = getSessionResponse;
      if (sessionData.session && sessionData.session.user) {
        const { user } = sessionData.session;
        const getProfileResponse = await profiles.getProfile(user.id);

        if (!user.email) {
          return;
        }

        // If the user does not have a profile, attempt to create one
        if (!getProfileResponse.error && !getProfileResponse.data) {
          const getCreateResponse = await profiles.create(user.id);

          if (getCreateResponse.error) {
            setAuthError(getCreateResponse.error.message);
            log('Could not create profile', getCreateResponse.error.message);
            return;
          }

          if (getCreateResponse.data) {
            setProfile(getCreateResponse.data);
          }
        }

        setSession(session);
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
