import * as Sentry from '@sentry/react-native'
import { useFonts } from '@expo-google-fonts/inter'
import { ThemeProvider } from '@shopify/restyle'
import { SplashScreen, Stack, Redirect, router } from 'expo-router'
import React, { useEffect, useCallback } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import LoginSheet from '~/components/authentication/login-sheet'
import { LoadingFull } from '~/components/LoadingFull'
import { Text } from '~/theme'
import { theme } from '~/theme'
import { AppProvider, useAppContext } from '~/utils/app-provider'
import { useProfileQuery } from '~/utils/services/profiles/Profiles.query.generated'
import { supabase } from '~/utils/supabase'

// Register the Sentry SDK to capture performance data.
import '~/utils/observability'
import { Image, View } from 'react-native'

export const unstable_settings = {
  initialRouteName: '(drawer)',
}

SplashScreen.preventAutoHideAsync()

function InnerRootLayout() {
  const { session, setProfile, setProfileLoading, isLoadingAuth } = useAppContext()
  const [profileQueryResponse, fetchProfile] = useProfileQuery({ pause: true })

  const [loaded, error] = useFonts({
    'Font Awesome Regular': require('../assets/fonts/icons/fa-regular-400.ttf'),
    'Plus Jakarta Sans': require('../assets/fonts/Plus_Jakarta_Sans.ttf'),
  })

  const handleProfileFetch = useCallback(() => {
    if (session && !profileQueryResponse.data) {
      fetchProfile()
    }
  }, [session, profileQueryResponse.data, fetchProfile])

  useEffect(() => {
    handleProfileFetch()
  }, [handleProfileFetch])

  useEffect(() => {
    if (!isLoadingAuth && !session) {
      router.replace('/(auth)')
    }

    if (profileQueryResponse.data?.profile) {
      setProfile(profileQueryResponse.data.profile)
      setProfileLoading(false)
    }

    if (profileQueryResponse.error) {
      supabase.auth.signOut()
    }
  }, [profileQueryResponse, isLoadingAuth, session, setProfile, setProfileLoading])

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (isLoadingAuth) {
    return (
      <LoadingFull>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={require('~/assets/icon.png')} style={{ maxHeight: 150, maxWidth: 150 }} />
        </View>
      </LoadingFull>
    )
  }

  if (profileQueryResponse.error) {
    return <Text>Error loading profile. Please try again.</Text>
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
