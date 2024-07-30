import { Stack } from 'expo-router';

function Account() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Notes', headerShown: false }} />
    </Stack>
  );
}

export default Account;
