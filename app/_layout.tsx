import { LinearProgress } from '@rneui/themed';
import { ThemeProvider } from '@shopify/restyle';
import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Box, Text, theme } from '~/theme';
import { AuthContextProvider, useAuth } from '~/utils/auth/auth-context';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(drawer)',
};

function InnerRootLayout() {
  const { isLoadingAuth, session } = useAuth();

  if (isLoadingAuth) {
    return (
      <Box style={styles.loading}>
        <Text variant="title">Loading your account...</Text>
        <LinearProgress color="blue" />
      </Box>
    );
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

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
});
