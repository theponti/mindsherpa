import React, { useCallback, useMemo, useState, createContext, useContext } from 'react';
import { Client, Provider as ActualUrqlProvider, fetchExchange } from 'urql';
import { graphcacheExchange, offlineStorage } from './graphcacheExchange';
import { createAuthExchange } from './createAuthExchange';
import { getToken } from '../auth/auth-context';

// ─────────────────────────────────────────────────────────────────────────────
// ── PROVIDER ─────────────────────────────────────────────────────────────────

type Props = Readonly<{ children?: React.ReactNode }>;

export const UrqlProvider = (props: Props) => {
  const { client, resetClient } = useUrqlClientWithClerkAuth();

  const value = useMemo(() => ({ resetClient }), [resetClient]);

  return (
    <UrqlAppContextWrapper.Provider value={value}>
      <ActualUrqlProvider value={client}>{props.children}</ActualUrqlProvider>
    </UrqlAppContextWrapper.Provider>
  );
};

/**
 * Wraps the main urql Provider w/ additional "app" context (e.g. resetClient)
 */
const UrqlAppContextWrapper = createContext<UrqlContext | undefined>(undefined);

type UrqlContext = Readonly<{ resetClient: () => Promise<void> }>;

export function useUrqlAppContext() {
  const context = useContext(UrqlAppContextWrapper);

  if (context === undefined) {
    throw new Error('useUrqlContext must be used within a <UrqlProvider>');
  }

  return context;
}

// ─────────────────────────────────────────────────────────────────────────────
// ── HOOKS ────────────────────────────────────────────────────────────────────

function useUrqlClientWithClerkAuth() {
  const getTokenRef = useClerkGetTokenRef();

  const [client, setClient] = useState<Client>(getClient(getTokenRef));

  const resetClient = useCallback(async () => {
    await offlineStorage?.clear();
    console.info('UrqlProvider > resetClient: urql client reset');
    setClient(getClient(getTokenRef));
  }, [getTokenRef]);

  return { client, resetClient };
}

// ─────────────────────────────────────────────────────────────────────────────
// ── HELPERS ──────────────────────────────────────────────────────────────────

function getClient(getTokenRef: MaybeGetTokenRef) {
  return new Client({
    url: process.env.GRAPHQL_ENDPOINT!,
    exchanges: [graphcacheExchange, createAuthExchange(getTokenRef), fetchExchange],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ── TYPES ────────────────────────────────────────────────────────────────────

type GetToken = typeof getToken;
type MaybeGetTokenRef = React.MutableRefObject<GetToken | undefined>;
