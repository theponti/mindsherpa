import { Redirect } from 'expo-router';
import { Box, Text } from 'theme';

import { useAuth } from '~/utils/auth/auth-context';

export const EditScreenInfo = ({ path }: { path: string }) => {
  const { session } = useAuth();

  if (!session) {
    return <Redirect href="(auth)" />;
  }

  return (
    <Box alignItems="center" marginHorizontal="xl_64">
      <Text variant="body" lineHeight={24} textAlign="center">
        Welcome back, {session.user.email}
      </Text>
      <Box borderRadius="s_3" paddingHorizontal="xs_4" marginVertical="s_8">
        <Text>{path}</Text>
      </Box>
    </Box>
  );
};
