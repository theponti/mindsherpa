import { useRouter } from 'expo-router';
import { useMemo } from 'react';

import { FocusOutputItem } from '~/utils/schema/schema-types';
import { FocusQuery } from '~/utils/services/Focus.query.generated';
import { Text } from '~/theme';
import { borderStyle, listStyles as styles } from '~/utils/styles';
import { Card } from '../card';
import { Pressable, View } from 'react-native';

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

  const onCategoryPress = () => {
    return router.replace('/(drawer)/focus/modal');
  };

  return (
    <Card>
      {notebooks.map((category, index) => (
        <Pressable
          onPress={onCategoryPress}
          style={[
            styles.container,
            index !== notebooks.length - 1 ? borderStyle.borderBottom : borderStyle.noBorder,
            { flexDirection: 'column' },
          ]}>
          <View style={{ flexDirection: 'row', columnGap: 8, alignItems: 'center' }}>
            <Text variant="body" style={styles.text}>
              {category}
            </Text>
          </View>
          {/* <View style={{ alignSelf: 'flex-end' }}>{headerRight}</View> */}
        </Pressable>
      ))}
    </Card>
  );
};
