import { Stack } from 'expo-router';

export default function FocusLayout() {
  return (
    <Stack initialRouteName="home">
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{
          headerShown: true,
          presentation: 'modal',
          headerBackTitle: 'close',
          headerBackButtonMenuEnabled: true,
        }}
      />
    </Stack>
  );
}
