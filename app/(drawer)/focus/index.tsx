import { MaterialIcons } from '@expo/vector-icons';
import { Link, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';

import { LoadingContainer } from '~/components/LoadingFull';
import { PulsingCircle } from '~/components/animated/pulsing-circle';
import { FeedbackBlock } from '~/components/feedback-block';
import { TaskList } from '~/components/focus/task-list';
import { NoteForm } from '~/components/notes/note-form';
import { NotebookStack } from '~/components/notes/notebook-stack';
import { Text } from '~/theme';
import { type FocusQuery, useFocusQuery } from '~/utils/services/Focus.query.generated';
import { useDeleteFocusItemMutation } from '~/utils/services/notes/DeleteFocusItem.mutation.generated';
import { theme } from '~/theme';
import MindsherpaIcon from '~/components/ui/icon';
import { FocusOutputItem } from '~/utils/schema/graphcache';

const baseFocusItems = {
  tasks: [],
  events: [],
  reminders: [],
  notebooks: [],
};

type FocusItem = FocusQuery['focus']['items'][0];

type FocusItemsMap = {
  tasks: FocusItem[];
  events: FocusItem[];
  reminders: FocusItem[];
  notebooks: FocusItem[];
};
export const FocusView = () => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [focusResponse, getFocus] = useFocusQuery({
    pause: true,
    requestPolicy: 'network-only',
  });
  const [hasError, setHasError] = useState<boolean>(false);
  const [focusItems, setFocusItems] = useState<FocusItemsMap>(baseFocusItems);
  const isLoading = focusResponse.fetching;
  const hasData = focusItems.notebooks.length > 0;

  const setFocusItemsFromResponse = useCallback((items: FocusQuery['focus']['items']) => {
    const tasks: FocusItem[] = [];
    const events: FocusItem[] = [];
    const reminders: FocusItem[] = [];
    const notebooks: FocusItem[] = [];

    if (!items.length) {
      return baseFocusItems;
    }

    for (const item of items) {
      switch (item.type) {
        case 'task':
          tasks.push(item);
          break;
        case 'event':
          events.push(item);
          break;
        case 'reminder':
          reminders.push(item);
          break;
        default:
      }
      notebooks.push(item);
    }

    return setFocusItems({
      tasks,
      events,
      reminders,
      notebooks,
    });
  }, []);

  const onFormSubmit = useCallback(
    (data: FocusOutputItem[]) => {
      setFocusItemsFromResponse([...focusItems.notebooks, ...data]);
    },
    [focusItems, setFocusItemsFromResponse]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getFocus();
  }, [getFocus]);

  // 🗑️ Delete items
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteResponse, deleteFocusItem] = useDeleteFocusItemMutation();
  const onItemDelete = useCallback(
    async (id: number) => {
      setIsDeleting(true);
      await deleteFocusItem({ input: { id } });
      setFocusItemsFromResponse(focusItems.notebooks.filter((item) => item.id !== id));
      setIsDeleting(false);
    },
    [focusItems.notebooks, deleteFocusItem, setFocusItemsFromResponse]
  );

  const [isRecording, setIsRecording] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const toggleSheet = () => {
    setIsOpen(!isOpen);
  };

  // 🛰️ Reload focus items when the screen is focused
  useFocusEffect(useCallback(() => getFocus(), [getFocus]));

  useEffect(() => {
    if (focusResponse.error) {
      setRefreshing(false);
      setHasError(true);
    }

    if (focusResponse.data?.focus.items) {
      setHasError(false);
      setRefreshing(false);
      setFocusItemsFromResponse(focusResponse.data?.focus.items);
    }
  }, [focusResponse.data?.focus.items, focusResponse.error, setFocusItemsFromResponse]);

  const onErrorRetry = useCallback(() => {
    setHasError(false);
    onRefresh();
  }, [onRefresh]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      style={styles.container}>
      <View style={[styles.focusContainer]}>
        <FocusHeader />

        <ScrollView
          style={styles.scrollContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
          {isLoading && !refreshing ? (
            <LoadingContainer>
              <PulsingCircle />
            </LoadingContainer>
          ) : null}

          {hasError ? (
            <FeedbackBlock>
              <Text variant="body" color="white">
                Your focus could not be loaded.
              </Text>
              <Pressable style={{ backgroundColor: theme.colors.primary }} onPress={onErrorRetry}>
                <MaterialIcons name="restart-alt" size={24} color={theme.colors.white} />
              </Pressable>
            </FeedbackBlock>
          ) : null}

          {!isLoading && hasData ? (
            <View style={[styles.focuses]}>
              <TaskList data={focusItems.tasks} onItemDelete={onItemDelete} />
              <NotebookStack items={focusItems.notebooks} />
            </View>
          ) : null}
          {!isLoading && !hasData ? (
            <View style={[styles.empty]}>
              <Text variant="bodyLarge" color="primary">
                You have no focus items yet.
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
      <NoteForm onSubmit={onFormSubmit} isRecording={isRecording} setIsRecording={setIsRecording} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  focusContainer: {
    flex: 1,
    rowGap: 12,
  },
  focuses: {
    rowGap: 24,
  },
  empty: {
    marginHorizontal: 12,
    paddingVertical: 75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
  },
  scrollContainer: {
    paddingTop: 12,
  },
});

export default FocusView;

const FocusHeader = React.memo(() => {
  const todaysDate = useMemo(
    () => new Date().toLocaleString('default', { month: 'long', day: 'numeric' }),
    []
  );

  return (
    <View style={headerStyles.header}>
      <View>
        <Text fontSize={30} fontWeight={600}>
          Today
        </Text>
        <Text variant="body" color="gray">
          {todaysDate}
        </Text>
      </View>
      <View
        style={{
          borderRadius: 99,
          padding: 8,
          borderColor: theme.colors.black,
          borderWidth: 2,
          marginRight: 12,
        }}>
        <Link href="/(drawer)/(sherpa)">
          <MindsherpaIcon name="hat-wizard" size={24} />
        </Link>
      </View>
    </View>
  );
});

const headerStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 12,
    paddingBottom: 24,
    marginTop: 91,
    rowGap: 4,
  },
});
