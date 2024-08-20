import { MaterialIcons } from '@expo/vector-icons'
import { useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, Platform, Pressable, Button } from 'react-native'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler'
import * as Sentry from '@sentry/react-native'
import { LoadingContainer } from '~/components/LoadingFull'
import { PulsingCircle } from '~/components/animated/pulsing-circle'
import { FeedbackBlock } from '~/components/feedback-block'
import { FocusList } from '~/components/focus/focus-list'
import { NoteForm } from '~/components/notes/note-form'
import { NotebookStack } from '~/components/notes/notebook-stack'
import { Text } from '~/theme'
import { FocusQuery, useFocusQuery } from '~/utils/services/Focus.query.generated'
import { useDeleteFocusItemMutation } from '~/utils/services/notes/DeleteFocusItem.mutation.generated'
import { Colors } from '~/utils/styles'

const baseFocusItems = {
  tasks: [],
  events: [],
  reminders: [],
  notebooks: [],
}

type FocusItem = FocusQuery['focus']['items'][0]

type FocusItemsMap = {
  tasks: FocusItem[]
  events: FocusItem[]
  reminders: FocusItem[]
  notebooks: FocusItem[]
}
export const FocusView = () => {
  const [refreshing, setRefreshing] = React.useState(false)
  const [focusResponse, getFocus] = useFocusQuery({
    pause: true,
    requestPolicy: 'network-only',
  })
  const [hasError, setHasError] = useState<boolean>(false)
  const [focusItems, setFocusItems] = useState<FocusItemsMap>(baseFocusItems)

  const setFocusItemsFromResponse = useCallback((items: FocusQuery['focus']['items']) => {
    const tasks: FocusItem[] = []
    const events: FocusItem[] = []
    const reminders: FocusItem[] = []
    const notebooks: FocusItem[] = []

    if (!items.length) {
      return baseFocusItems
    }

    for (const item of items) {
      switch (item.type) {
        case 'task':
          tasks.push(item)
          break
        case 'event':
          events.push(item)
          break
        case 'reminder':
          reminders.push(item)
          break
        default:
      }
      notebooks.push(item)
    }

    return setFocusItems({
      tasks,
      events,
      reminders,
      notebooks,
    })
  }, [])

  const isLoading = focusResponse.fetching
  const hasData = !isLoading && focusItems.notebooks.length > 0

  const onFormSubmit = useCallback(() => {
    getFocus()
  }, [getFocus])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    getFocus()
    setFocusItemsFromResponse([])
  }, [getFocus])

  // 🗑️ Delete items
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [deleteResponse, deleteFocusItem] = useDeleteFocusItemMutation()
  const onItemDelete = useCallback(
    async (id: number) => {
      setIsDeleting(true)
      await deleteFocusItem({ input: { id } })
      setFocusItemsFromResponse(focusItems.notebooks.filter((item) => item.id !== id))
      setIsDeleting(false)
    },
    [focusItems.notebooks, deleteFocusItem]
  )

  const [isOpen, setIsOpen] = useState(true)
  const toggleSheet = () => {
    setIsOpen(!isOpen)
  }

  useFocusEffect(
    useCallback(() => {
      getFocus()
    }, [])
  )

  useEffect(() => {
    if (focusResponse.error) {
      setRefreshing(false)
      setHasError(true)
    }

    if (focusResponse.data?.focus.items) {
      setHasError(false)
      setRefreshing(false)
      setFocusItemsFromResponse(focusResponse.data?.focus.items)
    }
  }, [focusResponse.data?.focus.items])

  const onErrorRetry = useCallback(() => {
    setHasError(false)
    onRefresh()
  }, [])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      style={styles.container}
    >
      <View style={[styles.focusContainer]}>
        <View style={styles.header}>
          <Text variant="cardHeader">Today</Text>
          <Text variant="body" color="gray">
            {new Date().toLocaleString('default', { month: 'long', day: 'numeric' })}
          </Text>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
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
              <Pressable style={{ backgroundColor: Colors.primary }} onPress={onErrorRetry}>
                <MaterialIcons name="restart-alt" size={24} color={Colors.white} />
              </Pressable>
            </FeedbackBlock>
          ) : null}

          {!isLoading && focusItems.notebooks.length > 0 ? (
            <View style={[styles.focuses]}>
              <FocusList data={focusItems.tasks} onItemDelete={onItemDelete} type="task" />
              <FocusList data={focusItems.events} onItemDelete={onItemDelete} type="event" />
              <FocusList data={focusItems.reminders} onItemDelete={onItemDelete} type="reminder" />
              <NotebookStack items={focusItems.notebooks} />
            </View>
          ) : null}
          {!isLoading && focusItems.notebooks.length === 0 ? (
            <View style={[styles.empty]}>
              <Text variant="bodyLarge" color="primary">
                You have no focus items yet.
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
      <NoteForm onSubmit={onFormSubmit} />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 125,
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
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  header: {
    justifyContent: 'center',
    paddingLeft: 12,
    paddingBottom: 24,
    rowGap: 4,
  },
  scrollContainer: {
    paddingTop: 12,
  },
})

export default FocusView
