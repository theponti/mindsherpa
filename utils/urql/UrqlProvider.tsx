import React, { useState, createContext, useContext, useRef } from 'react';
import { Client, Provider as ActualUrqlProvider, fetchExchange } from 'urql';

import { createAuthExchange } from './createAuthExchange';
import { asyncStorage, graphcacheExchange } from './graphcacheExchange';
import { getToken } from '../auth/auth-context';
import { supabase } from '../supabase';

// ─────────────────────────────────────────────────────────────────────────────
// ── PROVIDER ─────────────────────────────────────────────────────────────────

type Props = Readonly<{ children?: React.ReactNode }>;

export const UrqlProvider = (props: Props) => {
  const getTokenRef = useRef(getToken);
  const [client, setClient] = useState<Client>(getClient(getTokenRef));

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      asyncStorage?.clear();
      console.info('UrqlProvider > resetClient: urql client reset');
      setClient(getClient(getTokenRef));
    }
  });

  return (
    <UrqlAppContextWrapper.Provider value={{}}>
      <ActualUrqlProvider value={client}>{props.children}</ActualUrqlProvider>
    </UrqlAppContextWrapper.Provider>
  );
};

/**
 * Wraps the main urql Provider w/ additional "app" context (e.g. resetClient)
 */
const UrqlAppContextWrapper = createContext<UrqlContext | undefined>(undefined);

type UrqlContext = Readonly<object>;

export function useUrqlAppContext() {
  const context = useContext(UrqlAppContextWrapper);

  if (context === undefined) {
    throw new Error('useUrqlContext must be used within a <UrqlProvider>');
  }

  return context;
}

// ─────────────────────────────────────────────────────────────────────────────
// ── HELPERS ──────────────────────────────────────────────────────────────────

function getClient(getTokenRef: MaybeGetTokenRef) {
  return new Client({
    url: process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT!,
    exchanges: [graphcacheExchange, createAuthExchange(getTokenRef), fetchExchange],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ── TYPES ────────────────────────────────────────────────────────────────────

type GetToken = typeof getToken;
type MaybeGetTokenRef = React.MutableRefObject<GetToken | undefined>;
