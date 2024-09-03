import { useFonts } from '@expo-google-fonts/inter'
import * as Sentry from '@sentry/react-native'
import { ThemeProvider } from '@shopify/restyle'
import { Slot, SplashScreen, Stack, useRouter, useSegments } from 'expo-router'
import React, { useCallback, useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { theme } from '~/theme'
import { AppProvider, useAppContext } from '~/utils/app-provider'
import '~/utils/observability'
import { useProfileQuery } from '~/utils/services/profiles/Profiles.query.generated'
import { supabase } from '~/utils/supabase'

SplashScreen.preventAutoHideAsync()

function InnerRootLayout() {
  const router = useRouter()
  const segments = useSegments()
  const { isLoadingAuth, profile, session, setProfile, setProfileLoading } = useAppContext()
  const [profileQueryResponse, fetchProfile] = useProfileQuery({ pause: true })

  const [loaded, error] = useFonts({
    'Font Awesome Regular': require('../assets/fonts/icons/fa-regular-400.ttf'),
    'Plus Jakarta Sans': require('../assets/fonts/Plus_Jakarta_Sans.ttf'),
  })

  const handleProfileFetch = useCallback(() => {
    if (session && !profileQueryResponse.data) {
      fetchProfile({
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      })
    }
  }, [session, profileQueryResponse.data, fetchProfile])

  useEffect(() => {
    handleProfileFetch()
  }, [handleProfileFetch])

  useEffect(() => {
    if (profileQueryResponse.data?.profile) {
      const { profile } = profileQueryResponse.data
      setProfile({
        user_id: profile.userId,
        profile_id: profile.profileId,
        email: profile.email,
        name: profile.name,
      })
      setProfileLoading(false)
    }

    if (profileQueryResponse.error) {
      Sentry.captureException(profileQueryResponse.error)

      if (session) {
        supabase.auth.signOut()
      }
    }
  }, [profileQueryResponse, session, setProfile, setProfileLoading])

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  useEffect(() => {
    if (!isLoadingAuth) return

    const inAuthGroup = segments[0] === '(drawer)'

    if (session && profile && !inAuthGroup) {
      router.replace('/(drawer)/focus')
    } else if (!session) {
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
