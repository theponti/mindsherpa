import React from 'react'
import { Pressable, View, type PressableProps, type ViewStyle, StyleSheet } from 'react-native'
import * as ContextMenu from 'zeego/context-menu'

import { Text } from '~/theme'
import { FocusOutputItem } from '~/utils/schema/graphcache'
import { borderStyle, listStyles } from '~/utils/styles'

export const FocusListItem = ({
  icon,
  item,
  headerRight,
  label,
  onDelete,
  showBorder,
  style,
  ...props
}: PressableProps & {
  icon?: React.ReactNode
  item?: FocusOutputItem
  headerRight: React.ReactNode
  label: string
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
              {label}
            </Text>
          </View>
          <View style={{ alignSelf: 'flex-end' }}>
            <Text variant="small" color="gray">
              {item?.dueDate}
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
