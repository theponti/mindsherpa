import { useFocusEffect } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'

import { LoadingContainer } from '~/components/LoadingFull'
import { ScreenContent } from '~/components/ScreenContent'
import { PulsingCircle } from '~/components/animated/pulsing-circle'
import { FeedbackBlock } from '~/components/feedback-block'
import { FocusList } from '~/components/focus/focus-list'
import { NoteForm } from '~/components/notes/note-form'
import { NotebookStack } from '~/components/notes/notebook-stack'
import { Text } from '~/theme'
import { FocusQuery, useFocusQuery } from '~/utils/services/Focus.query.generated'
import { useDeleteFocusItemMutation } from '~/utils/services/notes/DeleteFocusItem.mutation.generated'

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
  const hasError = !isLoading && (focusResponse.error || !focusResponse.data)
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
    if (refreshing && !isLoading) {
      setRefreshing(false)
    }
  }, [isLoading, refreshing])

  useEffect(() => {
    if (focusResponse.data?.focus.items) {
      setFocusItemsFromResponse(focusResponse.data?.focus.items)
    }
  }, [focusResponse.data?.focus.items])

  return (
    <ScreenContent>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
          style={styles.container}
        >
          <View style={[styles.focusContainer]}>
            <View style={styles.header}>
              <Text variant="cardHeader">Today</Text>
              <Text variant="body" color="gray">
                {new Date().toLocaleString('default', { month: 'long', day: 'numeric' })}
              </Text>
            </View>

            {isLoading ? (
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
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              >
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
  },
  focusContainer: {
    flex: 1,
    rowGap: 12,
  },
  header: {
    justifyContent: 'center',
    paddingLeft: 12,
    rowGap: 4,
  },
  scrollContainer: {
    paddingTop: 12,
  },
})

export default FocusView
