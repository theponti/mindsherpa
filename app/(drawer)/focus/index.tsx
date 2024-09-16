import { useQueryClient } from '@tanstack/react-query'
import React, { useCallback, useState } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler'
import Markdown from 'react-native-markdown-display'

import { LoadingContainer } from '~/components/LoadingFull'
import { PulsingCircle } from '~/components/animated/pulsing-circle'
import { FeedbackBlock } from '~/components/feedback-block'
import { FocusHeader } from '~/components/focus/focus-header'
import { FocusList } from '~/components/focus/focus-list'
import { NoteForm } from '~/components/notes/note-form'
import MindsherpaIcon from '~/components/ui/icon'
import { Text, theme } from '~/theme'
import { borderStyle } from '~/theme/styles'
import type { FocusItem, FocusItems } from '~/utils/services/notes/types'
import { useDeleteFocus } from '~/utils/services/notes/use-delete-focus'
import { useFocusQuery } from '~/utils/services/notes/use-focus-query'

export const FocusView = () => {
  const queryClient = useQueryClient()
  const [activeSearch, setActiveSearch] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const {
    data: focusItems,
    refetch,
    isLoading,
    isError,
  } = useFocusQuery({
    onSuccess: (data) => {
      setRefreshing(false)
    },
    onError: (error) => {
      setRefreshing(false)
    },
  })

  const { mutate: deleteFocusItem } = useDeleteFocus({
    onSuccess: async (deletedItemId) => {
      // Cancel any outgoing fetches
      await queryClient.cancelQueries({ queryKey: ['focusItems'] })

      // Snapshot the previous value
      const previousItems = queryClient.getQueryData(['focusItems'])

      // Optimistically update to the new value
      queryClient.setQueryData(['focusItems'], (old: FocusItem[]) =>
        old.filter((item) => item.id !== deletedItemId)
      )

      // Return a context object with the snapshot value
      return { previousItems }
    },
    onError: () => {
      const previousItems = queryClient.getQueryData(['focusItems'])
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['focusItems'], previousItems)
    },
    onSettled: () => {
      // Always refetch after error or success:
      queryClient.invalidateQueries({ queryKey: ['focusItems'] })
    },
  })

  const onFormSubmit = useCallback(
    (data: FocusItem[]) => {
      const previousItems = queryClient.getQueryData<FocusItems>(['focusItems'])
      queryClient.setQueryData(['focusItems'], [...(previousItems || []), ...data])
    },
    [queryClient]
  )

  const onActiveSearchClose = useCallback(() => {
    setActiveSearch('')
  }, [setActiveSearch])

  const onRefresh = useCallback(() => {
    setActiveSearch('')
    setRefreshing(true)
    refetch()
  }, [refetch])

  const hasFocusItems = Boolean(!isLoading && focusItems && focusItems.length > 0)

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

          {hasFocusItems && focusItems ? (
            <View style={[styles.focuses]}>
              {activeSearch ? <SearchText searchText={activeSearch} onDismiss={onActiveSearchClose} /> : null}
              <FocusList data={focusItems} onItemDelete={deleteFocusItem} />
            </View>
          ) : null}
          {!hasFocusItems ? (
            <View style={[styles.empty]}>
              <Text variant="bodyLarge" color="primary">
                You have no focus items yet.
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
      <NoteForm isRecording={isRecording} setIsRecording={setIsRecording} setActiveSearch={setActiveSearch} />
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

const SearchText = React.memo(({ searchText, onDismiss }: { searchText: string, onDismiss: () => void }) => {
  return (
      <View style={{ alignContent: 'center', marginHorizontal: 12, paddingVertical: 12, paddingHorizontal: 16, ...borderStyle.border }}>
        <Markdown style={{ body: { fontSize: 18, lineHeight: 24, color: theme.colors.black } }}>
          {searchText}
        </Markdown>
        {/* <View style={{ flexDirection: 'row' }}> 
          <Pressable
            onPress={onDismiss}
            style={[
              {
                flex: 1,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: theme.colors.quaternary,
                marginTop: 12,
                paddingVertical: 8,
                paddingHorizontal: 12,
                alignItems: 'center',
              },
            ]}
          >
            <Text variant="body" color="gray">
              Close
            </Text>
          </Pressable>
        </View> */}
      </View>
    )
})