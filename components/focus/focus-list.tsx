import { MaterialIcons } from '@expo/vector-icons'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useCallback } from 'react'

import type { FocusOutputItem } from '~/utils/schema/graphcache'
import { Colors } from '~/utils/styles'
import { CategoryBadge } from '../badges'
import { FocusListItem } from './focus-list-item'
import { FocusItemIcon } from './focus-type-icon'

const ICON_SIZE = 24
const FocusListIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'task':
      return <MaterialIcons name="checklist" color={Colors.grayDark} size={ICON_SIZE} />
    case 'event':
      return <MaterialIcons name="calendar-month" color={Colors.grayDark} size={ICON_SIZE} />
    case 'reminder':
      return <MaterialIcons name="alarm-add" size={ICON_SIZE} color={Colors.grayDark} />
    default:
      return null
  }
}

export const FocusList = ({
  data,
  onItemDelete,
  type,
}: {
  data: FocusOutputItem[]
  onItemDelete: (id: number) => void
  type: string
}) => {
  const renderItem = useCallback(
    ({ item, index }: { item: FocusOutputItem; index: number }) => {
      return (
        <FocusListItem
          icon={<FocusItemIcon item={item} />}
          label={item.text}
          item={item}
          onDelete={() => onItemDelete(item.id)}
          showBorder={data.length == 1 || index < data.length - 1}
          headerRight={<CategoryBadge category={item.category} />}
        />
      )
    },
    [data, onItemDelete]
  )

  if (!data.length) {
    return null
  }

  return (
    <View>
      <View style={[styles.header]}>
        <FocusListIcon type={type} />
        <Text style={[styles.headerText]}>To Dos</Text>
      </View>
      <View>
        <FlatList
          data={data}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 16,
    color: Colors.grayDark,
  },
})
