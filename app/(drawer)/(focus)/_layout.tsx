import { Stack } from 'expo-router';

function FocusStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}

export default FocusStack;
