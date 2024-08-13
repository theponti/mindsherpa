import { Stack, useRouter } from 'expo-router';

export default function FocusLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen name="[name]" options={{ headerShown: false }} />
    </Stack>
  );
}
