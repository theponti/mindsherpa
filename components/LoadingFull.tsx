import { LinearProgress } from '@rneui/themed';
import { StyleSheet } from 'react-native';

import { Box, Text } from '~/theme';

export const LoadingFull = ({ title }: { title?: string }) => {
  return (
    <Box style={styles.loading}>
      {title ? <Text variant="title">{title}</Text> : null}
      <LinearProgress color="black" />
    </Box>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
});
