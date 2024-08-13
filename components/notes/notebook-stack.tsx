import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, Pressable, View } from 'react-native';

import { FocusOutputItem } from '~/utils/schema/schema-types';
import { FocusQuery } from '~/utils/services/Focus.query.generated';
import { Text } from '~/theme';
import { borderStyle, listStyles as styles } from '~/utils/styles';
import { Card } from '../card';

export const NotebookStack = ({ items }: { items: FocusQuery['focus']['items'] }) => {
  const router = useRouter();
  const accumulatedCategories = useMemo(() => {
    const map: Record<string, FocusOutputItem[]> = {};

    for (const item of items) {
      if (item.type === 'task' || item.type === 'event') continue;
      if (!map[item.category]) map[item.category] = [];

      const category = map[item.category];
      if (category) category.push(item);
    }

    return map;
  }, [items]);
  const notebooks = useMemo(() => Object.keys(accumulatedCategories), [accumulatedCategories]);

  const onCategoryPress = useCallback(
    (name: string) => {
      return router.replace(`/(drawer)/focus/notebook/${name}`);
    },
    [router]
  );

  const renderItem = useCallback<ListRenderItem<string>>(
    ({ item, index }) => (
      <Pressable
        onPress={() => onCategoryPress(item)}
        style={[
          styles.container,
          index !== notebooks.length - 1 ? borderStyle.borderBottom : borderStyle.noBorder,
          { flexDirection: 'column' },
        ]}>
        <View style={{ flexDirection: 'row', columnGap: 8, alignItems: 'center' }}>
          <Text variant="body" style={styles.text}>
            {item}
          </Text>
        </View>
      </Pressable>
    ),
    [onCategoryPress]
  );

  return (
    <Card>
      <FlatList
        data={notebooks}
        scrollEnabled={false}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
    </Card>
  );
};
