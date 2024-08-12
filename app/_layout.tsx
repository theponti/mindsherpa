import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { ThemeProvider } from '@shopify/restyle';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import LoginSheet from '~/components/authentication/login-sheet';
import { theme } from '~/theme';
import { AppProvider, useAppContext } from '~/utils/app-provider';

export const unstable_settings = {
  initialRouteName: '(drawer)',
};

SplashScreen.preventAutoHideAsync();

function InnerRootLayout() {
  const { isLoadingAuth, session } = useAppContext();
  const [loaded, error] = useFonts({
    'Noto Serif': require('../assets/fonts/Noto_Serif/NotoSerif.ttf'),
    'Noto Serif Italic': require('../assets/fonts/Noto_Serif/NotoSerif-Italic.ttf'),
    'Noto Sans': require('../assets/fonts/Noto_Sans/NotoSans.ttf'),
    'Noto Sans Italic': require('../assets/fonts/Noto_Sans/NotoSans-Italic.ttf'),
  });

  useEffect(() => {
    if (loaded || error || isLoadingAuth) {
      SplashScreen.hideAsync();
    }
  }, [isLoadingAuth, loaded, error]);

  if (isLoadingAuth) {
    return <LoginSheet isLoadingAuth />;
  }

  if (session) {
    return (
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      </Stack>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ title: 'Auth' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Prevent rendering until the font has loaded or an error was returned
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppProvider>
          <InnerRootLayout />
        </AppProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
