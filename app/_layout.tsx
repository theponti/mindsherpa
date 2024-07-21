import { ThemeProvider } from '@shopify/restyle';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import LoginSheet from '~/components/authentication/login-sheet';
import { theme } from '~/theme';
import { AuthContextProvider, useAuth } from '~/utils/auth/auth-context';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(drawer)',
};

function InnerRootLayout() {
  const { isLoadingAuth, session } = useAuth();

  if (isLoadingAuth) {
    return <LoginSheet isLoadingAuth />;
  }

  if (session) {
    return (
      <Stack>
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ title: 'Modal', presentation: 'modal' }} />
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
  return (
    <ThemeProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthContextProvider>
          <InnerRootLayout />
        </AuthContextProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
