import type { Session } from '@supabase/supabase-js';
import React, {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { Client, Provider as UrqlProvider, fetchExchange } from 'urql';

import { createAuthExchange } from './createAuthExchange';
import { asyncStorage, graphcacheExchange } from './graphcacheExchange';
import { log } from '../logger';
import type { GetProfileOutput } from '../schema/schema-types';
import { supabase } from '../supabase';
import { GRAPHQL_URI } from '../constants';
import { useProfileQuery } from '../services/profiles/Profiles.query.generated';

type AppContextType = {
  isLoadingAuth: boolean;
  session: Session | null;
  profile: GetProfileOutput | null;
  setProfile: (profile: GetProfileOutput | null) => void;
  urqlClient: Client;
};

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};

export const getToken = async () => {
  const { data, error } = await supabase.auth.refreshSession();

  if (error) {
    log('Could not refresh token', error.message);
    return null;
  }

  return data.session?.access_token ?? null;
};

export function AppProvider({ children }: PropsWithChildren) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<GetProfileOutput | null>(null);

  const getTokenRef = useRef(getToken);
  const queryClient = useMemo(() => new QueryClient(), []);
  const urqlClient = useMemo<Client>(
    () =>
      new Client({
        url: GRAPHQL_URI,
        exchanges: [graphcacheExchange, createAuthExchange(getTokenRef), fetchExchange],
      }),
    []
  );

  useEffect(() => {
    // Load session initial session.
    supabase.auth.getSession();

    // Watch for changes to Supabase authentication session.
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoadingAuth(false);
      setSession(session);

      if (event === 'SIGNED_OUT') {
        asyncStorage?.clear();
        getTokenRef.current = getToken;
        queryClient.clear();
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [queryClient.clear]);

  const contextValue: AppContextType = {
    isLoadingAuth,
    session,
    profile,
    setProfile,
    urqlClient,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <QueryClientProvider client={queryClient}>
        <UrqlProvider value={urqlClient}>{children}</UrqlProvider>
      </QueryClientProvider>
    </AppContext.Provider>
  );
}
