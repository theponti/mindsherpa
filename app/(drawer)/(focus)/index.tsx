import { useFocusEffect, useRouter } from 'expo-router';
import { Calendar, CircleDot, UserCircle } from 'lucide-react-native';
import React, { useCallback, useMemo } from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Circle } from 'react-native-svg';

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
import { Colors } from '~/utils/styles';

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
      <View style={styles.navbar}>
        <View style={{ width: 32 }} />
        <Image source={require('../../../assets/header-logo.png')} height={20} width={35} />
        <TouchableOpacity onPress={() => router.push('(drawer)/(account)')}>
          <UserCircle size={32} color={Colors.gray} />
        </TouchableOpacity>
      </View>
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

  const onCategoryPress = useCallback(
    (category: string) => {
      console.log('category', category);
      // router.push(`(drawer)/(notebook)/${category}`);
      router.replace('/(drawer)/note-list');
    },
    [router]
  );

  const entries = Object.keys(accumulatedCategories);
  return (
    <ScrollView style={styles.scrollContainer}>
      <Card>
        <FocusList data={tasks} icon={<CircleDot size={24} color={Colors.gray} />} />
        <FocusList data={events} icon={<Calendar size={24} color={Colors.gray} />} />
      </Card>
      <View style={{ height: 48 }} />
      <Card>
        {entries.map((category, index) => (
          <FocusListItem
            onPress={onCategoryPress.bind(null, category)}
            key={category}
            label={category}
            isLastItem={index === entries.length - 1}
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
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
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
