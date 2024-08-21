import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';

import type { FocusOutputItem } from '~/utils/schema/graphcache';
import { TaskListItem } from './task-list-item';

export const TaskList = ({
  data,
  onItemDelete,
}: {
  data: FocusOutputItem[];
  onItemDelete: (id: number) => void;
}) => {
  const [items, setItems] = useState<FocusOutputItem[]>(data);
  const onItemComplete = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const renderItem = useCallback(
    ({ item, index }: { item: FocusOutputItem; index: number }) => {
      return (
        <TaskListItem
          label={item.text}
          item={item}
          onComplete={() => onItemComplete(item.id)}
          onDelete={() => onItemDelete(item.id)}
          showBorder={data.length == 1 || index < data.length - 1}
        />
      );
    },
    [onItemComplete, onItemDelete]
  );

  if (!data.length) {
    return null;
  }

  return (
    <View style={[styles.container]}>
      <View style={[styles.header]}>
        <Text style={[styles.headerText]}>To Dos</Text>
      </View>
      <View>
        <FlatList
          data={items}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  headerText: {
    fontSize: 14,
    color: '#667085',
  },
});
