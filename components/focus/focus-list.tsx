import type { ReactNode } from 'react';

import type { FocusOutputItem } from '~/utils/schema/graphcache';
import { CategoryBadge } from '../badges';
import { FocusListItem } from './focus-list-item';

export const FocusList = ({ icon, data }: { icon?: ReactNode; data: FocusOutputItem[] }) => {
  return (
    <>
      {data.map((item, index: number) => (
        <FocusListItem
          key={item.id}
          icon={icon}
          isLastItem={index === data.length - 1}
          label={item.text}
          headerRight={<CategoryBadge category={item.category} />}
        />
      ))}
    </>
  );
};
