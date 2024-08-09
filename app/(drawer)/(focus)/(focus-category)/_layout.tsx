import { Stack } from 'expo-router';

function FocusStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="note-list" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default FocusStack;
