import { useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
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
  const isLoaded = !focusResponse.fetching;
  const hasError = isLoaded && (focusResponse.error || !focusResponse.data);
  const hasData = isLoaded && focusData;

  const onFormSubmit = () => {
    getFocus();
  };

  return (
    <ScreenContent>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
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

            {hasData ? <Focus items={[...focusData.items]} /> : null}
          </View>
          <NoteForm onSubmit={onFormSubmit} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenContent>
  );
};

type FocusItem = FocusQuery['focus']['items'][0];
const Focus = ({ items }: { items: FocusItem[] }) => {
  const focusItems = useMemo(() => {
    const acc = {
      tasks: [] as FocusItem[],
      events: [] as FocusItem[],
      reminders: [] as FocusItem[],
      notebooks: [] as FocusItem[],
    };

    for (const item of items) {
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
  }, [items]);

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={{ rowGap: 24 }}>
        <FocusList data={focusItems.tasks} type="task" />
        <FocusList data={focusItems.events} type="event" />
        <FocusList data={focusItems.reminders} type="reminder" />
        <NotebookStack items={focusItems.notebooks} />
      </View>
    </ScrollView>
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
