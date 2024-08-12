import type { FocusOutputItem } from '~/utils/schema/graphcache';
import { CategoryBadge } from '../badges';
import { FocusListItem } from './focus-list-item';
import { Calendar, CircleIcon } from 'lucide-react-native';
import { Colors } from '~/utils/styles';
import { theme } from '~/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { Card } from '../card';
import { FlatList, View } from 'react-native';

const FocusIcon = ({ item }: { item: FocusOutputItem }) => {
  const iconSize = theme.textVariants.body.fontSize;
  switch (item.type) {
    case 'task':
      return <CircleIcon color={Colors.quaternary} size={iconSize} />;
    case 'event':
      return <Calendar color={Colors.quaternary} size={iconSize} />;
    case 'reminder':
      return <MaterialIcons name="alarm-add" size={iconSize} color={Colors.quaternary} />;
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

export const FocusList = ({ data, type }: { data: FocusOutputItem[]; type: string }) => {
  return (
    <Card>
      <View style={{ paddingHorizontal: 12, paddingTop: 16, paddingBottom: 20 }}>
        <FocusListIcon type={type} />
      </View>
      <View>
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <FocusListItem
              icon={<FocusIcon item={item} />}
              label={item.text}
              showBorder={index < data.length - 1}
              headerRight={<CategoryBadge category={item.category} />}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </Card>
  );
};
