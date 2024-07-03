import { Text } from '@rneui/base';
import { ThemeProvider } from '@shopify/restyle';
import { type Session } from '@supabase/supabase-js';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { theme } from '~/theme';
import { supabase } from '~/utils/supabase';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(drawer)',
};

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (data.session && !error) {
        setSession(data.session);
      }

      if (error) {
        setAuthError(error.message);
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  console.log({ session });
  return (
    <ThemeProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          {session && session.user && <Text>{session.user.id}</Text>}
          {session ? (
            <>
              <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ title: 'Modal', presentation: 'modal' }} />
            </>
          ) : (
            <Stack.Screen name="(auth)" options={{ title: 'Auth' }} />
          )}
        </Stack>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
