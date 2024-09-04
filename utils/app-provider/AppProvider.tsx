import type { Session } from '@supabase/supabase-js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react'
import { Client, Provider as UrqlProvider, fetchExchange } from 'urql'
import { GRAPHQL_URI } from '../constants'
import { log } from '../logger'
import type { Profile } from '../services/profiles'
import { supabase } from '../supabase'
import { createAuthExchange } from './createAuthExchange'
import { asyncStorage, graphcacheExchange } from './graphcacheExchange'

type AppContextType = {
  isLoadingAuth: boolean
  session: Session | null
  profile: Profile | null
  setProfile: (profile: Profile | null) => void
  setProfileLoading: (isLoading: boolean) => void
  signOut: () => void
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
  const router = useRouter()
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<AppContextType['profile'] | null>(null)
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
    supabase.auth.getSession()

    // Watch for changes to Supabase authentication session.
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoadingSession(false)
      setSession(session)

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
  }, [queryClient.clear])

  const signOut = useCallback(() => {
    supabase.auth.signOut()
    setProfile(null)
    setProfileLoading(false)
    setSession(null)
    queryClient.clear()
    asyncStorage?.clear()
    getTokenRef.current = getToken
    router.replace('/(auth)')
  }, [router, queryClient.clear])

  const contextValue: AppContextType = {
    isLoadingAuth: profileLoading || isLoadingSession,
    session,
    profile,
    setProfile,
    setProfileLoading,
    signOut,
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
