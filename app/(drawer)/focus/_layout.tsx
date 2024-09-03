import { Stack, useRouter } from 'expo-router';
import { Button } from 'react-native';

export default function FocusLayout() {
  const router = useRouter();

  return (
    <Stack initialRouteName="/(drawer)/focus">
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="notebook"
        options={{
          presentation: 'modal',
          headerBackTitle: 'Notebook',
          headerLeft: () => (
            <Button
              title="Back"
              onPress={() => {
                router.push('/(drawer)/focus');
              }}
            />
          ),
          headerRight: () => (
            <Button
              title="Add"
              onPress={() => {
                router.push('/(drawer)/focus/notebook/new');
              }}
            />
          ),
        }}
      />
    </Stack>
  );
}
