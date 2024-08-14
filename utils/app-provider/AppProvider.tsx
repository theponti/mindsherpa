import Constants from 'expo-constants';
import { Session } from '@supabase/supabase-js';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import { Client, Provider as UrqlProvider, fetchExchange } from 'urql';

import { createAuthExchange } from './createAuthExchange';
import { asyncStorage, graphcacheExchange } from './graphcacheExchange';
import { log } from '../logger';
import { GetProfileOutput } from '../schema/schema-types';
import { supabase } from '../supabase';
const { manifest2 } = Constants;

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

const getHostURI = () => {
  if (manifest2?.extra?.expoClient?.hostUri) {
    return `http://${manifest2.extra.expoClient.hostUri.split(':').shift()}:8002/graphql`;
  }

  return process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT!;
};

export function AppProvider({ children }: PropsWithChildren) {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<GetProfileOutput | null>(null);

  const getTokenRef = useRef(getToken);
  const urqlClient = useMemo<Client>(
    () =>
      new Client({
        url: getHostURI(),
        exchanges: [graphcacheExchange, createAuthExchange(getTokenRef), fetchExchange],
      }),
    [getTokenRef]
  );

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoadingAuth(false);
      setSession(session);
      if (event === 'SIGNED_OUT') {
        asyncStorage?.clear();
        getTokenRef.current = getToken;
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const contextValue: AppContextType = {
    isLoadingAuth,
    session,
    profile,
    setProfile,
    urqlClient,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <UrqlProvider value={urqlClient}>{children}</UrqlProvider>
    </AppContext.Provider>
  );
}
