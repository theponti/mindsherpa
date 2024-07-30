import { Session } from '@supabase/supabase-js';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { log } from '../logger';
import { profilesService } from '../services/profiles-service';
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

export function AuthContextProvider({ children }: PropsWithChildren) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [session, setSession] = useState<AuthContextSession>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    async function getInitialSession() {
      console.log('getInitialSession');
      let getSessionResponse: any = {};
      try {
        getSessionResponse = await Promise.race([
          supabase.auth.getSession(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Session retrieval timed out')), 10000)
          ),
        ]);
      } catch (error) {
        console.error('Error retrieving session:', error);
        setAuthError('Session retrieval timed out');
        setIsLoadingAuth(false);
        return;
      }
      console.log('getSessionResponse', getSessionResponse);

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
        const getProfileResponse = await profilesService.getProfile(user.id);

        if (!user.email) {
          return;
        }

        // If the user does not have a profile, attempt to create one
        if (!getProfileResponse.error && !getProfileResponse.data) {
          const getCreateResponse = await profilesService.create(user.id);

          if (getCreateResponse.error) {
            setAuthError(getCreateResponse.error.message);
            log('Could not create profile', getCreateResponse.error.message);
            return;
          }

          if (getCreateResponse.data) {
            setProfile(getCreateResponse.data);
          }
        }

        if (getProfileResponse.data) {
          setProfile(getProfileResponse.data);
        }
        setSession(sessionData.session);
      }

      setIsLoadingAuth(false);
    }

    getInitialSession();

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (!session) {
        setProfile(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ authError, isLoadingAuth, profile, session }}>
      {children}
    </AuthContext.Provider>
  );
}

export const getToken = async () => {
  // Refresh token to ensure the latest token is used
  const { data, error } = await supabase.auth.refreshSession();

  if (error) {
    log('Could not refresh token', error.message);
    return null;
  }

  if (data.session) {
    return data.session.access_token;
  }

  return null;
};
