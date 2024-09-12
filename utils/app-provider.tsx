import { captureException } from '@sentry/react-native'
import type { Session } from '@supabase/supabase-js'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren
} from 'react'
import { queryClient, request } from './query-client'
import type { Profile } from './services/profiles'
import { supabase } from './supabase'

type AppContextType = {
  isLoadingAuth: boolean
  session: Session | null
  profile?: Profile
  signOut: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export const useAppContext = () => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }

  return context
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

  useEffect(() => {
    supabase.auth.getSession()

    // Watch for changes to Supabase authentication session.
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoadingSession(false)
      setSession(session)

      if (event === 'SIGNED_OUT') {
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
    router.replace('/(auth)')
  }, [router])

  const contextValue: AppContextType = {
    isLoadingAuth: isLoadingProfile && isLoadingSession,
    session,
    profile,
    signOut,
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}
