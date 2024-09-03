import type { Session } from '@supabase/supabase-js'
import React, {
  type PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react'
import { QueryClientProvider, QueryClient, useQuery } from '@tanstack/react-query'
import { Client, Provider as UrqlProvider, fetchExchange } from 'urql'

import { createAuthExchange } from './createAuthExchange'
import { asyncStorage, graphcacheExchange } from './graphcacheExchange'
import { log } from '../logger'
import type { GetProfileOutput } from '../schema/schema-types'
import { supabase } from '../supabase'
import { GRAPHQL_URI } from '../constants'
import { useProfileQuery } from '../services/profiles/Profiles.query.generated'

type AppContextType = {
  isLoadingAuth: boolean
  session: Session | null
  profile: GetProfileOutput | null
  setProfile: (profile: GetProfileOutput | null) => void
  setProfileLoading: (isLoading: boolean) => void
  urqlClient: Client
}

const AppContext = createContext<AppContextType | null>(null)

export const useAppContext = () => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }

  return context
}

export const getToken = async () => {
  const { data, error } = await supabase.auth.refreshSession()

  if (error) {
    log('Could not refresh token', error.message)
    return null
  }

  return data.session?.access_token ?? null
}

export function AppProvider({ children }: PropsWithChildren) {
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<GetProfileOutput | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  const getTokenRef = useRef(getToken)
  const queryClient = useMemo(() => new QueryClient(), [])
  const urqlClient = useMemo<Client>(
    () =>
      new Client({
        url: GRAPHQL_URI,
        exchanges: [graphcacheExchange, createAuthExchange(getTokenRef), fetchExchange],
      }),
    []
  )

  useEffect(() => {
    // supabase.auth.getSession()

    // Watch for changes to Supabase authentication session.
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoadingSession(false)
      setSession(session)

      if (!session && profileLoading) {
        setProfileLoading(false)
        setProfile(null)
        return
      }

      if (event === 'SIGNED_OUT') {
        asyncStorage?.clear()
        getTokenRef.current = getToken
        queryClient.clear()
        setProfile(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [profileLoading, queryClient.clear])

  const contextValue: AppContextType = {
    isLoadingAuth: profileLoading || isLoadingSession,
    session,
    profile,
    setProfile,
    setProfileLoading,
    urqlClient,
  }

  return (
    <AppContext.Provider value={contextValue}>
      <QueryClientProvider client={queryClient}>
        <UrqlProvider value={urqlClient}>{children}</UrqlProvider>
      </QueryClientProvider>
    </AppContext.Provider>
  )
}
