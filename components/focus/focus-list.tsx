import { MaterialIcons } from '@expo/vector-icons';
import { FlatList, View } from 'react-native';
import { useCallback } from 'react';

import type { FocusOutputItem } from '~/utils/schema/graphcache';
import { Colors } from '~/utils/styles';
import { theme } from '~/theme';
import { CategoryBadge } from '../badges';
import { Card } from '../card';
import { FocusListItem } from './focus-list-item';

const ITEM_ICON_SIZE = theme.textVariants.body.fontSize;
const FocusItemIcon = ({ item }: { item: FocusOutputItem }) => {
  switch (item.type) {
    case 'task':
      return (
        <MaterialIcons
          name="check-box-outline-blank"
          color={Colors.quaternary}
          size={ITEM_ICON_SIZE}
        />
      );
    case 'event':
      return (
        <MaterialIcons name="calendar-today" color={Colors.quaternary} size={ITEM_ICON_SIZE} />
      );
    case 'reminder':
      return <MaterialIcons name="notifications" color={Colors.quaternary} size={ITEM_ICON_SIZE} />;
    default:
      return null;
  }
};

const ICON_SIZE = 40;
const FocusListIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'task':
      return <MaterialIcons name="check-circle" color={Colors.quaternary} size={ICON_SIZE} />;
    case 'event':
      return <MaterialIcons name="calendar-month" color={Colors.quaternary} size={ICON_SIZE} />;
    case 'reminder':
      return <MaterialIcons name="alarm-add" size={ICON_SIZE} color={Colors.quaternary} />;
    default:
      return null;
  }
};

export const FocusList = ({
  data,
  onItemDelete,
  type,
}: {
  data: FocusOutputItem[];
  onItemDelete: (id: string) => void;
  type: string;
}) => {
  const renderItem = useCallback(
    ({ item, index }: any) => {
      return (
        <FocusListItem
          icon={<FocusItemIcon item={item} />}
          label={item.text}
          onDelete={() => onItemDelete(item.id)}
          showBorder={index < data.length - 1}
          headerRight={<CategoryBadge category={item.category} />}
        />
      );
    },
    [data, onItemDelete]
  );

  return (
    <Card>
      <View style={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 20 }}>
        <FocusListIcon type={type} />
      </View>
      <View>
        <FlatList
          data={data}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>
    </Card>
  );
};
