import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '~/theme';
import { borderStyle, listStyles } from '~/theme/styles';
import { FocusQuery } from '~/utils/services/Focus.query.generated';
import { Card } from '../ui/card';
import { CATEGORIES } from '../focus/focus-category';

type List = { label: string; count: number };
type Lists = List[];
export const NotebookStack = ({ items }: { items: FocusQuery['focus']['items'] }) => {
  const router = useRouter();
  const notebooks = useMemo<Lists>(() => {
    const categoryCounts = new Map<string, number>();

    for (const item of items) {
      const count = categoryCounts.get(item.category) || 0;
      categoryCounts.set(item.category, count + 1);
    }

    return Array.from(categoryCounts.entries()).map(([label, count]) => ({ label, count }));
  }, [items]);

  const onCategoryPress = useCallback(
    (name: string) => {
      return router.replace(`/(drawer)/focus/notebook/${name}`);
    },
    [router]
  );

  const renderItem = useCallback<ListRenderItem<List>>(
    ({ item, index }) => {
      const category = CATEGORIES[item.label];
      return (
        <Pressable
          onPress={() => onCategoryPress(item.label)}
          style={[
            listStyles.container,
            index !== notebooks.length - 1 ? borderStyle.borderBottom : borderStyle.noBorder,
            styles.listItem,
          ]}>
          <View
            style={{
              flexDirection: 'row',
              columnGap: 8,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text variant="body" style={listStyles.text}>
              {category ? `${category.emoji}   ${category.label}` : item.label}
            </Text>
            <Text variant="body" color="gray">
              {item.count}
            </Text>
          </View>
        </Pressable>
      );
    },
    [onCategoryPress]
  );

  if (notebooks.length === 0) return null;

  return (
    <View style={{ paddingHorizontal: 12, rowGap: 12, paddingTop: 16, paddingBottom: 20 }}>
      <View style={[styles.header]}>
        <Text variant="title" color="grayDark" fontSize={14}>
          Collections
        </Text>
      </View>
      <Card>
        <FlatList
          data={notebooks}
          scrollEnabled={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.label}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    columnGap: 12,
    alignItems: 'center',
    paddingHorizontal: 2,
    paddingTop: 12,
    paddingBottom: 6,
  },
  listItem: {
    flexDirection: 'column',
    paddingLeft: 8,
    paddingRight: 24,
    paddingVertical: 12,
  },
});
