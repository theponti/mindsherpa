import { StyleSheet, View } from 'react-native';

import { Text } from '~/theme';
import { NotebookType } from '~/utils/services/notebooks-service';
import { Colors } from '~/utils/styles';

export const NotebookListItem = ({ item }: { item: NotebookType }) => {
  return (
    <View style={styles.listItem}>
      <Text variant="body">{item.title}</Text>
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
