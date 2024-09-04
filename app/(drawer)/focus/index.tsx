import { Link } from 'expo-router'
import React, { useCallback, useMemo, useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler'

import { LoadingContainer } from '~/components/LoadingFull'
import { PulsingCircle } from '~/components/animated/pulsing-circle'
import { FeedbackBlock } from '~/components/feedback-block'
import { TaskList } from '~/components/focus/task-list'
import { NoteForm } from '~/components/notes/note-form'
import MindsherpaIcon from '~/components/ui/icon'
import { Text, theme } from '~/theme'
import type { FocusItem } from '~/utils/services/notes/types'
import { useDeleteFocus } from '~/utils/services/notes/use-delete-focus'
import { useFocusQuery } from '~/utils/services/notes/use-focus-query'

export const FocusView = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [focusItems, setFocusItems] = useState<FocusItem[]>([])
  const { data, refetch, isLoading, isError } = useFocusQuery({
    onSuccess: (data) => {
      setFocusItems(data.items)
    },
    onError: (error) => {
      setRefreshing(false)
    },
  })
  const { mutate: deleteFocusItem } = useDeleteFocus({
    onSuccess: (id: number) => {
      setFocusItems((prev) => prev.filter((item) => item.id !== id))
    },
  })
  const onFormSubmit = useCallback((data: FocusItem[]) => {
    setFocusItems((prev) => [...prev, ...data])
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    refetch()
  }, [refetch])

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      style={styles.container}
    >
      <View style={[styles.focusContainer]}>
        <FocusHeader />

        <ScrollView
          style={styles.scrollContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {isLoading && !refreshing ? (
            <LoadingContainer>
              <PulsingCircle />
            </LoadingContainer>
          ) : null}

          {isError ? <FocusLoadingError /> : null}

          {!isLoading && focusItems.length > 0 ? (
            <View style={[styles.focuses]}>
              <TaskList data={focusItems} onItemDelete={deleteFocusItem} />
            </View>
          ) : null}
          {!isLoading && !isError && focusItems.length === 0 ? (
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: theme.colors.backgroundColor,
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
})

export default FocusView

const FocusHeader = React.memo(() => {
  const todaysDate = useMemo(
    () => new Date().toLocaleString('default', { month: 'long', day: 'numeric' }),
    []
  )

  return (
    <View style={headerStyles.header}>
      <View style={[headerStyles.topRow]}>
        <View style={[headerStyles.iconWrap]}>
          <Link href="/(account)/">
            <MindsherpaIcon name="user" size={15} />
          </Link>
        </View>
        <View style={[headerStyles.today]}>
          <Text fontSize={30} fontWeight={600}>
            Today
          </Text>
        </View>
        <View style={[headerStyles.iconWrap]}>
          <Link href="/(sherpa)/">
            <MindsherpaIcon name="message" size={15} />
          </Link>
        </View>
      </View>
      <View style={[headerStyles.bottomRow]}>
        <Text variant="body" color="gray">
          {todaysDate}
        </Text>
      </View>
    </View>
  )
})

const headerStyles = StyleSheet.create({
  header: {
    justifyContent: 'space-between',
    marginTop: 91,
    rowGap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  today: { flex: 1, alignItems: 'center' },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconWrap: {
    backgroundColor: theme.colors.grayLight,
    borderRadius: 99,
    padding: 12,
  },
})

const FocusLoadingError = React.memo(() => {
  return (
    <View
      style={[
        {
          padding: 12,
          marginHorizontal: 12,
        },
      ]}
    >
      <FeedbackBlock error>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', columnGap: 24 }}>
          <MindsherpaIcon name="circle-exclamation" size={24} color={theme.colors.tomato} />
          <View style={{ flex: 1 }}>
            <Text variant="body" color="black">
              Your focus could not be loaded.
            </Text>
            <Text variant="body" color="black">
              Please, try again later.
            </Text>
          </View>
        </View>
      </FeedbackBlock>
    </View>
  )
})
