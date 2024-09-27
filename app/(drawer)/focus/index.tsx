import { useQueryClient } from '@tanstack/react-query'
import { Link } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler'

import { LoadingContainer } from '~/components/LoadingFull'
import { PulsingCircle } from '~/components/animated/pulsing-circle'
import { FeedbackBlock } from '~/components/feedback-block'
import { FocusHeader } from '~/components/focus/focus-header'
import { FocusList } from '~/components/focus/focus-list'
import { ActiveSearchSummary, type ActiveSearch } from '~/components/focus/focus-search'
import MindsherpaIcon from '~/components/ui/icon'
import { Text, theme } from '~/theme'
import type { FocusItem } from '~/utils/services/notes/types'
import { useDeleteFocus } from '~/utils/services/notes/use-delete-focus'
import { useFocusQuery } from '~/utils/services/notes/use-focus-query'

export const FocusView = () => {
  const queryClient = useQueryClient()
  const [activeSearch, setActiveSearch] = useState<ActiveSearch | null>(null)
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

  const onRefresh = useCallback(() => {
    setActiveSearch(null)
    setRefreshing(true)
    queryClient.setQueryData(['focusItems'], [])
    refetch()
  }, [queryClient.setQueryData, refetch])

  const onSearchClose = useCallback(() => {
    onRefresh()
    setActiveSearch(null)
  }, [onRefresh])

  const isLoaded = Boolean(!isLoading && !isRefetching && !refreshing)
  const hasFocusItems = Boolean(focusItems && focusItems.length > 0)

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <FocusHeader />

      <View style={[styles.focusContainer]}>
        <ScrollView
          style={styles.scrollContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {(isLoading || isRefetching) && !refreshing ? (
            <LoadingContainer>
              <PulsingCircle />
            </LoadingContainer>
          ) : null}

          {isError ? <FocusLoadingError /> : null}

          {isLoaded && focusItems ? (
            <View style={[styles.focuses]}>
              {activeSearch ? (
                <ActiveSearchSummary onCloseClick={onSearchClose} activeSearch={activeSearch} />
              ) : null}
              <FocusList data={focusItems} />
            </View>
          ) : null}
          {isLoaded && !hasFocusItems && !activeSearch ? (
            <View style={[styles.empty]}>
              <Text variant="bodyLarge" color="primary">
                You have no focus items yet.
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </View>

      <View style={[styles.sherpaButtonContainer]}>
        {/* <View style={[styles.fullLinearGradient]} /> */}
        <View style={[styles.sherpaCircleButton]}>
          <Link href="/(sherpa)" style={{ flex: 1 }}>
            <MindsherpaIcon name="hat-wizard" size={32} color={theme.colors.white} />
          </Link>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    // backgroundColor: theme.colors.backgroundColor,
  },
  focusContainer: {
    flex: 1,
    rowGap: 12,
  },
  focuses: {
    rowGap: 24,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 120,
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
  fullLinearGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: theme.colors.black,
    opacity: 0,
  },
  sherpaButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // paddingBottom: 24,
    // backgroundColor: theme.colors.white,
    // shadowColor: theme.colors.black,
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 4,
  },
  sherpaCircleButton: {
    backgroundColor: theme.colors['fg-primary'],
    borderRadius: 99,
    padding: 12,
    maxWidth: 120,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
