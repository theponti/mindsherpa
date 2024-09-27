import { Stack, useRouter } from 'expo-router'

export default function FocusLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[id]" options={{ presentation: 'modal' }} />
    </Stack>
  )
}
