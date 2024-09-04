import { useFonts } from '@expo-google-fonts/inter'
import { ThemeProvider } from '@shopify/restyle'
import { Slot, SplashScreen, Stack, useRouter, useSegments } from 'expo-router'
import React, { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { theme } from '~/theme'
import { ApiProvider } from '~/utils/api-provider'
import { AppProvider, useAppContext } from '~/utils/app-provider'
import { log } from '~/utils/logger'
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
        <ApiProvider>
          <AppProvider>
            <InnerRootLayout />
          </AppProvider>
        </ApiProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  )
}

export default RootLayout
