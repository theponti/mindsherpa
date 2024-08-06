import { Redirect } from 'expo-router';
import React from 'react';

import LoginSheet from '~/components/authentication/login-sheet';
import AnimatedIntro from '~/components/intro-animated';
import { Box } from '~/theme';
import { useAppContext } from '~/utils/app-provider';

function Auth() {
  const { session } = useAppContext();

  if (session) {
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
