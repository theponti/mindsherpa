import { useCallback } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

import type { FocusItem } from '~/utils/services/notes/types'
import { FocusListItem } from './focus-list-item'

export const FocusList = ({
  data,
}: {
  data: FocusItem[]
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
    <View style={[styles.container]}>
      <View>
        <FlatList
          data={data}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
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
