import { StyleSheet, View } from 'react-native';

import { Text } from '~/theme';
import { NoteOutput } from '~/utils/schema/graphcache';

export const NoteListItem = ({ item }: { item: NoteOutput }) => {
  return (
    <View style={styles.listItem}>
      <Text variant="body" numberOfLines={2}>
        {item.content}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    marginBottom: 16,
    paddingVertical: 24,
  },
});
