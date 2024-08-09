import { View } from 'react-native';

import { Card } from '~/components/card';
import { Text } from '~/theme';
import type { FocusOutputItem } from '~/utils/schema/graphcache';
import { FocusList } from './focus-list';

export const FocusCard = ({ title, data }: { title: string; data: FocusOutputItem[] }) => {
  return (
    <Card>
      <View style={{ rowGap: 8 }}>
        <Text variant="cardHeader">{title}</Text>
        {data.length === 0 ? <EmptyCardContent cardName={title.toLowerCase()} /> : null}
        {data.length > 0 ? <FocusList data={data} /> : null}
      </View>
    </Card>
  );
};

const EmptyCardContent = ({ cardName }: { cardName: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 24 }}>
    <Text variant="body">{`No ${cardName} to show`}</Text>
  </View>
);
