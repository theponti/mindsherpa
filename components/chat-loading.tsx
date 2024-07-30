import { ActivityIndicator, StyleSheet } from 'react-native';

import { Box, Text } from '~/theme';

function ChatLoading() {
  return (
    <Box style={styles.loading}>
      <Text variant="title">Loading chat messages</Text>
      <ActivityIndicator size="large" color="#000" />
    </Box>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    rowGap: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatLoading;
