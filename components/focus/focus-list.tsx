import { useCallback } from 'react'
import { FlatList, StyleSheet } from 'react-native'
import { RefreshControl } from 'react-native-gesture-handler'
import type { FocusItem } from '~/utils/services/notes/types'
import { FocusListItem } from './focus-list-item'

export const FocusList = ({
  data,
  isRefreshing,
  onRefresh,
}: {
  data: FocusItem[]
  isRefreshing: boolean
  onRefresh: () => void
}) => {
  const renderItem = useCallback(
    ({ item, index }: { item: FocusItem; index: number }) => {
      return (
        <FocusListItem
          label={item.text}
          item={item}
          showBorder={data.length === 1 || index < data.length - 1}
        />
      )
    },
    [data.length]
  )

  if (!data.length) {
    return null
  }

  return (
    <FlatList
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      style={[styles.container]}
      data={data}
      keyExtractor={(item: FocusItem) => `${item.id}`}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
      scrollEnabled={true}
      showsVerticalScrollIndicator={true}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 32,
  },
  listContainer: {
    rowGap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  headerText: {
    fontSize: 14,
    color: '#667085',
  },
})
