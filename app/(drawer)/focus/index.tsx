import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingContainer } from '~/components/LoadingFull';
import { ScreenContent } from '~/components/ScreenContent';
import { PulsingCircle } from '~/components/animated/pulsing-circle';
import { FeedbackBlock } from '~/components/feedback-block';
import { FocusList } from '~/components/focus/focus-list';
import { NoteForm } from '~/components/notes/note-form';
import { NotebookStack } from '~/components/notes/notebook-stack';
import { Text } from '~/theme';
import { FocusQuery, useFocusQuery } from '~/utils/services/Focus.query.generated';
import { useDeleteFocusItemMutation } from '~/utils/services/notes/DeleteFocusItem.mutation.generated';

type FocusItem = FocusQuery['focus']['items'][0];
export const FocusView = () => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(true);
  const [focusResponse, getFocus] = useFocusQuery({
    pause: true,
    requestPolicy: 'network-only',
  });
  const [deleteResponse, deleteFocusItem] = useDeleteFocusItemMutation();

  useFocusEffect(
    useCallback(() => {
      getFocus();
    }, [getFocus])
  );

  const focusData = focusResponse.data?.focus;
  const isLoaded = !focusResponse.fetching;
  const hasError = isLoaded && (focusResponse.error || !focusResponse.data);
  const hasData = isLoaded && focusData;

  const onFormSubmit = useCallback(() => {
    getFocus();
  }, [getFocus]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getFocus();
  }, [getFocus]);

  const onItemDelete = useCallback((id: string) => {
    setIsDeleting(true);
    deleteFocusItem({ input: { id } });
  }, []);

  const focusItems = useMemo(() => {
    const acc = {
      tasks: [] as FocusItem[],
      events: [] as FocusItem[],
      reminders: [] as FocusItem[],
      notebooks: [] as FocusItem[],
    };

    for (const item of focusData?.items || []) {
      switch (item.type) {
        case 'task':
          acc.tasks.push(item);
          break;
        case 'event':
          acc.events.push(item);
          break;
        case 'reminder':
          acc.reminders.push(item);
          break;
        default:
          acc.notebooks.push(item);
      }
    }

    return acc;
  }, [focusData?.items]);

  useEffect(() => {
    if (refreshing && isLoaded) {
      setRefreshing(false);
    }

    if (isDeleting && deleteResponse.data?.deleteFocusItem.success) {
      setIsDeleting(false);
      getFocus();
    }
  }, [deleteResponse, isLoaded, refreshing]);

  return (
    <ScreenContent>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
          style={styles.container}>
          <View style={[styles.focusContainer]}>
            <View style={styles.header}>
              <Text variant="cardHeader">Today</Text>
              <Text variant="body" color="gray">
                {new Date().toLocaleString('default', { month: 'long', day: 'numeric' })}
              </Text>
            </View>

            {focusResponse.fetching ? (
              <LoadingContainer>
                <PulsingCircle />
              </LoadingContainer>
            ) : null}

            {hasError ? (
              <FeedbackBlock>
                <Text variant="body" color="white">
                  Your focus could not be loaded.
                </Text>
              </FeedbackBlock>
            ) : null}

            {hasData ? (
              <ScrollView
                style={styles.scrollContainer}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={{ rowGap: 24 }}>
                  <FocusList data={focusItems.tasks} onItemDelete={onItemDelete} type="task" />
                  <FocusList data={focusItems.events} onItemDelete={onItemDelete} type="event" />
                  <FocusList
                    data={focusItems.reminders}
                    onItemDelete={onItemDelete}
                    type="reminder"
                  />
                  <NotebookStack items={focusItems.notebooks} />
                </View>
              </ScrollView>
            ) : null}
          </View>
          <NoteForm onSubmit={onFormSubmit} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenContent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    rowGap: 12,
  },
  focusContainer: {
    flex: 1,
    paddingHorizontal: 12,
    rowGap: 12,
  },
  header: {
    justifyContent: 'center',
    paddingLeft: 12,
    rowGap: 4,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 12,
  },
});

export default FocusView;
