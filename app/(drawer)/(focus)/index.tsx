import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingContainer } from '~/components/LoadingFull';
import { ScreenContent } from '~/components/ScreenContent';
import { PulsingCircle } from '~/components/animated/pulsing-circle';
import { Card } from '~/components/card';
import { FeedbackBlock } from '~/components/feedback-block';
import { FocusList } from '~/components/focus/focus-list';
import { FocusListItem } from '~/components/focus/focus-list-item';
import { NoteForm } from '~/components/notes/note-form';
import { ViewHeader } from '~/components/view-header';
import { Text } from '~/theme';
import type { FocusOutputItem } from '~/utils/schema/graphcache';
import { useFocusQuery } from '~/utils/services/Focus.query.generated';
import { useNotesQuery } from '~/utils/services/notes/Notes.query.generated';

export const FocusView = () => {
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
  const onFormSubmit = () => {
    getFocus();
  };

  return (
    <ScreenContent>
      <ViewHeader />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          style={styles.container}>
          <View style={[styles.focusContainer]}>
            <View style={styles.header}>
              <Text variant="cardHeader">Today's Focus</Text>
            </View>
            {focusResponse.fetching ? (
              <LoadingContainer>
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
          <NoteForm onSubmit={onFormSubmit} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenContent>
  );
};

const Focus = ({ items }: { readonly items: FocusOutputItem[] }) => {
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

  const onCategoryPress = (category: string) => {
    router.push('/(drawer)/(focus)/modal');
  };

  const entries = Object.keys(accumulatedCategories);
  const focusItems = useMemo(() => {
    return items.filter((item) => ['task', 'event', 'reminder'].includes(item.type));
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
  container: {
    flex: 1,
    paddingTop: 30,
    rowGap: 12,
  },
  focusContainer: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 12,
    rowGap: 12,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 48,
  },
});

export default FocusView;
