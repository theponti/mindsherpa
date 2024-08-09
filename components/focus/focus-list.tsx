import type { ReactNode } from 'react';

import type { FocusOutputItem } from '~/utils/schema/graphcache';
import { CategoryBadge } from '../badges';
import { FocusListItem } from './focus-list-item';
import { Calendar, CircleIcon } from 'lucide-react-native';
import { Colors } from '~/utils/styles';
import { theme } from '~/theme';

const FocusIcon = ({ item }: { item: FocusOutputItem }) => {
  const iconSize = theme.textVariants.body.fontSize;
  switch (item.type) {
    case 'task':
      return <CircleIcon color={Colors.quaternary} size={iconSize} />;
    case 'event':
      return <Calendar color={Colors.quaternary} size={iconSize} />;
    default:
      return null;
  }
};

export const FocusList = ({
  data,
  showBorder,
}: {
  data: FocusOutputItem[];
  showBorder?: boolean;
}) => {
  return (
    <>
      {data.map((item, index: number) => (
        <FocusListItem
          key={item.id}
          icon={<FocusIcon item={item} />}
          label={item.text}
          showBorder={index !== data.length - 1 || showBorder}
          headerRight={<CategoryBadge category={item.category} />}
        />
      ))}
    </>
  );
};
