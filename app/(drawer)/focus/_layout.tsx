import { Stack, useRouter } from 'expo-router'

export default function FocusLayout() {
  const router = useRouter()

  return (
    <Stack initialRouteName="/(drawer)/focus">
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  )
}
