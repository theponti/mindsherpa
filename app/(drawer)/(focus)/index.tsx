import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { LoadingContainer } from '~/components/LoadingFull';
import { ScreenContent } from '~/components/ScreenContent';
import { PulsingCircle } from '~/components/animated/pulsing-circle';
import { Card } from '~/components/card';
import { FeedbackBlock } from '~/components/feedback-block';
import { FocusList } from '~/components/focus/focus-list';
import { FocusListItem } from '~/components/focus/focus-list-item';
import { Text } from '~/theme';
import type { FocusOutputItem } from '~/utils/schema/graphcache';
import { useFocusQuery } from '~/utils/services/Focus.query.generated';

export const FocusView = () => {
  const router = useRouter();
  const [focusResponse, getFocus] = useFocusQuery({
    pause: true,
    requestPolicy: 'network-only',
  });

  useFocusEffect(
    useCallback(() => {
      getFocus();
    }, [getFocus])
  );

  const focusData = focusResponse.data?.focus;

  return (
    <ScreenContent>
      <View style={[styles.container]}>
        <View style={styles.header}>
          <Text variant="cardHeader">Today's Focus</Text>
        </View>
        {focusResponse.fetching ? (
          <LoadingContainer>
            <Text variant="body">getting your focus...</Text>
            <PulsingCircle />
          </LoadingContainer>
        ) : null}

        {!focusResponse.fetching && (focusResponse.error || !focusResponse.data) ? (
          <FeedbackBlock>
            <Text variant="body">could not get your focus</Text>
          </FeedbackBlock>
        ) : null}
        {!focusResponse.fetching && !focusResponse.error && focusData ? (
          <Focus items={[...focusData.items]} />
        ) : null}
      </View>
    </ScreenContent>
  );
};

const Focus = ({ items }: { readonly items: FocusOutputItem[] }) => {
  const router = useRouter();
  const tasks = items.filter((item) => item.type === 'task');
  const events = items.filter((item) => item.type === 'event');

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

  const onCategoryPress = (category: string) => {
    router.push('/(drawer)/(focus)/modal');
  };

  const entries = Object.keys(accumulatedCategories);
  const focusItems = useMemo(() => {
    return items.filter((item) => item.type === 'task' || item.type === 'event');
  }, [items]);
  return (
    <ScrollView style={styles.scrollContainer}>
      <Card>
        <FocusList data={focusItems} />
      </Card>
      <View style={{ height: 48 }} />
      <Card>
        {entries.map((category, index) => (
          <FocusListItem
            onPress={onCategoryPress.bind(null, category)}
            key={category}
            label={category}
            showBorder={index !== entries.length - 1}
            headerRight={
              <Text variant="small" style={{ color: '#BDBDBD' }}>
                {accumulatedCategories[category].length}{' '}
                {accumulatedCategories[category].length > 1 ? 'items' : 'item'}
              </Text>
            }
          />
        ))}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
  },
  container: {
    flex: 1,
    paddingTop: 150,
    paddingHorizontal: 8,
    rowGap: 12,
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default FocusView;
