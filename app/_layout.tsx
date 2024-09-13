import * as Sentry from '@sentry/react-native'
import { ThemeProvider } from '@shopify/restyle'
import { useFonts } from 'expo-font'
import { Slot, SplashScreen, Stack, useRouter, useSegments } from 'expo-router'
import React, { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { theme } from '~/theme'
import { ApiProvider } from '~/utils/api-provider'
import { AppProvider, useAppContext } from '~/utils/app-provider'
import '~/utils/observability'

SplashScreen.preventAutoHideAsync()

function InnerRootLayout() {
  const router = useRouter()
  const segments = useSegments()
  const { isLoadingAuth, profile, session } = useAppContext()

  const [loaded, error] = useFonts({
    'Font Awesome Regular': require('../assets/fonts/icons/fa-regular-400.ttf'),
    'Plus Jakarta Sans': require('../assets/fonts/Plus_Jakarta_Sans.ttf'),
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  useEffect(() => {
    if (!isLoadingAuth) return

    const inAuthGroup = segments[0] === '(drawer)'

    if (session && !profile && !inAuthGroup) {
      router.replace('/(drawer)/onboarding')
      return
    }

    if (session && profile && !inAuthGroup) {
      router.replace('/(drawer)/focus')
      return
    }

    if (!session && inAuthGroup) {
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
        <ApiProvider>
          <AppProvider>
            <InnerRootLayout />
          </AppProvider>
        </ApiProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  )
}

export default Sentry.withErrorBoundary(RootLayout, { showDialog: true })
