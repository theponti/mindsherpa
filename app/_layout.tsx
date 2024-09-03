import { useFonts } from '@expo-google-fonts/inter'
import * as Sentry from '@sentry/react-native'
import { ThemeProvider } from '@shopify/restyle'
import { useQuery } from '@tanstack/react-query'
import { Slot, SplashScreen, Stack, useRouter, useSegments } from 'expo-router'
import React, { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { theme } from '~/theme'
import { AppProvider, useAppContext } from '~/utils/app-provider'
import { log } from '~/utils/logger'
import '~/utils/observability'
import { request } from '~/utils/query-client'
import type { Profile } from '~/utils/services/profiles'
import { supabase } from '~/utils/supabase'

SplashScreen.preventAutoHideAsync()

function InnerRootLayout() {
  const router = useRouter()
  const segments = useSegments()
  const { isLoadingAuth, profile, session, setProfile, setProfileLoading } = useAppContext()
  const {
    refetch,
    error: profileError,
    isError: isErrorProfile,
    isLoading: isLoadingProfile,
    data: loadedProfile,
  } = useQuery<Profile | null>({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!session || profile) return null
      try {
        const { data } = await request<Profile>({
          method: 'GET',
          url: '/user/profile',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        })

        setProfile({
          user_id: data.user_id,
          profile_id: data.profile_id,
          email: data.email,
          name: data.name,
        })
        setProfileLoading(false)

        return data
      } catch (error) {
        Sentry.captureException(profileError)

        if (session) {
          supabase.auth.signOut()
        }

        return null
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    enabled: Boolean(session && !profile && session.access_token),
  })

  const [loaded, error] = useFonts({
    'Font Awesome Regular': require('../assets/fonts/icons/fa-regular-400.ttf'),
    'Plus Jakarta Sans': require('../assets/fonts/Plus_Jakarta_Sans.ttf'),
  })

  useEffect(() => {
    if (session && !isErrorProfile && !isLoadingProfile) {
      refetch()
    }
  }, [refetch, session, isErrorProfile, isLoadingProfile])

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  useEffect(() => {
    if (!isLoadingAuth) return

    const inAuthGroup = segments[0] === '(drawer)'

    log('Segments', segments)

    if (session && profile && !inAuthGroup) {
      log('routing to focus')
      router.replace('/(drawer)/focus')
      return
    }

    if (!session && inAuthGroup) {
      log('routing to auth')
      router.replace('/(auth)')
    }
  }, [isLoadingAuth, profile, segments, router, session])

  if (isLoadingAuth) {
    return <Slot />
  }

  return (
    <Stack>
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  )
}

function RootLayout() {
  return (
    <ThemeProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppProvider>
          <InnerRootLayout />
        </AppProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  )
}

export default Sentry.wrap(RootLayout)
