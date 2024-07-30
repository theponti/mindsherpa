import { Redirect } from 'expo-router';
import React from 'react';

import LoginSheet from '~/components/authentication/login-sheet';
import AnimatedIntro from '~/components/intro-animated';
import { Box } from '~/theme';
import { useAuth } from '~/utils/auth/auth-context';

function Auth() {
  const { session } = useAuth();

  if (session) {
    console.log('session', session);
    return <Redirect href="(drawer)" />;
  }

  return (
    <Box flex={1}>
      <AnimatedIntro />
      <LoginSheet />
    </Box>
  );
}

export default Auth;
