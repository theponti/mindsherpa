import type { ReactNode } from 'react'
import { Pressable, StyleSheet, View, type PressableProps, type ViewStyle } from 'react-native'
import * as ContextMenu from 'zeego/context-menu'

import { Text } from '~/theme'
import { borderStyle, listStyles } from '~/theme/styles'
import type { FocusItem } from '~/utils/services/notes/types'

export const FocusListItem = ({
  icon,
  item,
  headerRight,
  onDelete,
  showBorder,
  style,
  ...props
}: PressableProps & {
  icon?: ReactNode
  item: FocusItem
  headerRight: ReactNode
  onDelete: () => void
  showBorder?: boolean
  style?: ViewStyle[]
}) => {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger action="longPress">
        <Pressable
          style={[
            listStyles.container,
            showBorder ? borderStyle.borderBottom : borderStyle.noBorder,
            { flexDirection: 'column' },
            style,
          ]}
          {...props}
        >
          <View style={[styles.textContainer]}>
            <View>{icon}</View>
            <Text variant="body" style={[listStyles.text]}>
              {item.text}
            </Text>
          </View>
        </Pressable>
      </ContextMenu.Trigger>
      <ContextMenu.Content
        alignOffset={10}
        loop={false}
        avoidCollisions={true}
        collisionPadding={12}
      >
        <ContextMenu.Label>Actions</ContextMenu.Label>
        <ContextMenu.Item key="delete" onSelect={onDelete}>
          <ContextMenu.ItemIcon ios={{ name: 'trash', size: 20 }} />
          <ContextMenu.ItemTitle>Delete</ContextMenu.ItemTitle>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  )
}

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center',
  },
})
