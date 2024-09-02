import * as Sentry from '@sentry/react-native'
import { useFonts } from '@expo-google-fonts/inter'
import { ThemeProvider } from '@shopify/restyle'
import { SplashScreen, Stack } from 'expo-router'
import { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import LoginSheet from '~/components/authentication/login-sheet'
import { theme } from '~/theme'
import { AppProvider, useAppContext } from '~/utils/app-provider'

// Register the Sentry SDK to capture performance data.
import '~/utils/observability'

export const unstable_settings = {
  initialRouteName: '(drawer)',
}

SplashScreen.preventAutoHideAsync()

function InnerRootLayout() {
  const { isLoadingAuth, session } = useAppContext()
  const [loaded, error] = useFonts({
    'Font Awesome Regular': require('../assets/fonts/icons/fa-regular-400.ttf'),
    'Plus Jakarta Sans': require('../assets/fonts/Plus_Jakarta_Sans.ttf'),
  })

  useEffect(() => {
    if (loaded || error || isLoadingAuth) {
      SplashScreen.hideAsync()
    }
  }, [isLoadingAuth, loaded, error])

  if (isLoadingAuth) {
    return <LoginSheet isLoadingAuth />
  }

  if (session) {
    return (
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      </Stack>
    )
  }

  return (
    <Stack>
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
