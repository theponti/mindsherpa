import { useQueryClient } from '@tanstack/react-query'
import React, { useCallback, useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler'
import Markdown from 'react-native-markdown-display'

import { LoadingContainer } from '~/components/LoadingFull'
import { PulsingCircle } from '~/components/animated/pulsing-circle'
import { SherpaAmbient } from '~/components/chat/sherpa-ambient'
import { FeedbackBlock } from '~/components/feedback-block'
import { FocusHeader } from '~/components/focus/focus-header'
import { FocusList } from '~/components/focus/focus-list'
import { NoteForm } from '~/components/notes/note-form'
import MindsherpaIcon from '~/components/ui/icon'
import { Text, theme } from '~/theme'
import { borderStyle } from '~/theme/styles'
import type { FocusItem } from '~/utils/services/notes/types'
import { useDeleteFocus } from '~/utils/services/notes/use-delete-focus'
import { useFocusQuery } from '~/utils/services/notes/use-focus-query'

export const FocusView = () => {
  const queryClient = useQueryClient()
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [activeSearch, setActiveSearch] = useState<string>()
  const [isRecording, setIsRecording] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const {
    data: focusItems,
    refetch,
    isLoading,
    isRefetching,
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

  const onRefresh = useCallback(() => {
    setActiveSearch('')
    setRefreshing(true)
    queryClient.setQueryData(['focusItems'], [])
    refetch()
  }, [queryClient.setQueryData, refetch])

  const onSearchClose = useCallback(() => {
    onRefresh()
    setActiveSearch(undefined)
  }, [onRefresh])

  const onEndChat = useCallback(() => {
    setActiveChat(null)
  }, [])

  const hasFocusItems = Boolean(!isLoading && focusItems && focusItems.length > 0)

  if (activeChat) {
    return <SherpaAmbient chatId={activeChat} onEndChat={onEndChat} />
  }

  return (
    <View style={{ flex: 1 }}>
      <FocusHeader />

      <View style={[styles.focusContainer]}>
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
              {activeSearch ? (
                <SearchText onCloseClick={onSearchClose} searchText={activeSearch} />
              ) : null}
              <FocusList data={focusItems} onItemDelete={deleteFocusItem} />
            </View>
          ) : null}
          {!isLoading && !refreshing && !hasFocusItems ? (
            <View style={[styles.empty]}>
              <Text variant="bodyLarge" color="primary">
                You have no focus items yet.
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <NoteForm
          isRecording={isRecording}
          setActiveChat={setActiveChat}
          setActiveSearch={setActiveSearch}
          setIsRecording={setIsRecording}
        />
      </KeyboardAvoidingView>
    </View>
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

const SearchText = React.memo(
  ({ searchText, onCloseClick }: { searchText: string; onCloseClick: () => void }) => {
    return (
      <View style={[searchHeaderStyles.container]}>
        <Markdown style={{ body: searchHeaderStyles.searchText }}>{searchText}</Markdown>
        <View style={{ marginTop: 12 }}>
          <Pressable onPress={onCloseClick} style={[searchHeaderStyles.clearButton]}>
            <Text variant="body" color="darkGray">
              Clear search
            </Text>
          </Pressable>
        </View>
      </View>
    )
  }
)

const searchHeaderStyles = StyleSheet.create({
  container: {
    alignContent: 'center',
    marginHorizontal: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...borderStyle.border,
  },
  searchText: {
    fontSize: 18,
    lineHeight: 24,
    color: theme.colors.black,
  },
  clearButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.quaternary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
})
