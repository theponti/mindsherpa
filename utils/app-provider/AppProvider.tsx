import { captureException } from '@sentry/react-native'
import type { Session } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
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
import { queryClient, request } from '../query-client'
import type { Profile } from '../services/profiles'
import { supabase } from '../supabase'
import { createAuthExchange } from './createAuthExchange'
import { asyncStorage, graphcacheExchange } from './graphcacheExchange'

type AppContextType = {
  isLoadingAuth: boolean
  session: Session | null
  profile?: Profile
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
  const { isLoading: isLoadingProfile, data: profile } = useQuery<Profile | undefined>({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!session) return
      try {
        const { data } = await request<Profile>({
          method: 'GET',
          url: '/user/profile',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        })

        return data
      } catch (error) {
        captureException(error)
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(session?.access_token),
  })

  const getTokenRef = useRef(getToken)
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
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signOut = useCallback(() => {
    supabase.auth.signOut()
    setSession(null)
    queryClient.clear()
    asyncStorage?.clear()
    getTokenRef.current = getToken
    router.replace('/(auth)')
  }, [router])

  const contextValue: AppContextType = {
    isLoadingAuth: isLoadingProfile || isLoadingSession,
    session,
    profile,
    signOut,
    urqlClient,
  }

  return (
    <AppContext.Provider value={contextValue}>
      <UrqlProvider value={urqlClient}>{children}</UrqlProvider>
    </AppContext.Provider>
  )
}
