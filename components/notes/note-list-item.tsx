import { StyleSheet, View } from 'react-native';

import { Text } from '~/theme';
import { NoteType } from '~/utils/services/notebooks-service';
import { Colors } from '~/utils/styles';

export const NoteListItem = ({ item, key }: { item: NoteType; key: number }) => {
  return (
    <View key={key} style={styles.listItem}>
      <Text variant="body">{item.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    borderColor: Colors.darkGray,
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 16,
    padding: 16,
  },
});
