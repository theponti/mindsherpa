import { StyleSheet, View } from 'react-native';

import { Text } from '~/theme';
import theme from '~/theme/theme';
import { NoteOutput } from '~/utils/schema/graphcache';
import { Colors } from '~/utils/styles';

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
    borderColor: Colors.grayLight,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
    padding: 16,
    paddingVertical: 24,
    fontFamily: theme.textVariants.body.fontFamily,
  },
});
