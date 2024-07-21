import { Redirect } from 'expo-router';
import React from 'react';

import AnimatedIntro from '~/components/intro-animated';
import { Box } from '~/theme';
import { useAuth } from '~/utils/auth/auth-context';

function Auth() {
  const { session } = useAuth();

  if (session) {
    return <Redirect href="(drawer)" />;
  }

  return (
    <Box flex={1}>
      <AnimatedIntro />
    </Box>
  );
}

export default Auth;
