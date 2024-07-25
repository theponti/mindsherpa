import { Stack } from 'expo-router';

function Account() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'Account', headerShown: false, presentation: 'modal' }}
      />
    </Stack>
  );
}

export default Account;
