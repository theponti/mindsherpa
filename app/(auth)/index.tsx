import { Stack } from 'expo-router';

import { Container } from '~/components/Container';
import { ScreenContent } from '~/components/ScreenContent';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Mindsherpa' }} />
      <Container>
        <ScreenContent path="app/(auth)/index.tsx" title="Sign in" />
      </Container>
    </>
  );
}