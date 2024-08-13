import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '~/theme';
import { FocusOutputItem } from '~/utils/schema/graphcache';
import { Colors } from '~/utils/styles';

const ITEM_ICON_SIZE = theme.textVariants.body.fontSize;
export const FocusItemIcon = ({ item }: { item: FocusOutputItem }) => {
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
