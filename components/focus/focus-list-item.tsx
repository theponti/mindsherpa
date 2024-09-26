import React, { useCallback } from 'react'
import { StyleSheet, Text, View, type ViewStyle } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Reanimated, {
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import * as ContextMenu from 'zeego/context-menu'

import { Text as MSText, theme } from '~/theme'
import { borderStyle, listStyles } from '~/theme/styles'
import queryClient from '~/utils/query-client'
import type { FocusItem } from '~/utils/services/notes/types'
import { useDeleteFocus } from '~/utils/services/notes/use-delete-focus'
import { useFocusItemComplete } from '../../utils/services/notes/use-focus-item-complete'
import MindsherpaIcon, { type MindsherpaIconName } from '../ui/icon'

const SWIPE_THRESHOLD = 80

export const FocusListItem = ({
  item,
  label,
  showBorder,
  style,
  ...props
}: {
  item: FocusItem
  label: string
  showBorder?: boolean
  style?: ViewStyle[]
}) => {
  const translateX = useSharedValue(0)
  const itemHeight = useSharedValue(70)
  const fontColor = useSharedValue(0)
  const iconBackgroundColor = useSharedValue(theme.colors.grayLight)
  const iconName = useSharedValue<MindsherpaIconName>('check')

  const deleteFocusItem = useDeleteFocus({
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
      // queryClient.invalidateQueries({ queryKey: ['focusItems'] })
    },
  })

  const completeItem = useFocusItemComplete({
    onSuccess: (data) => {
      iconBackgroundColor.value = withTiming(theme.colors.green, { duration: 500 })
      queryClient.invalidateQueries({ queryKey: ['focusItems'] })
    },
    onError: () => {
      iconName.value = 'circle-xmark'
      iconBackgroundColor.value = withTiming(theme.colors.red, { duration: 500 })
      setTimeout(() => {
        iconName.value = 'circle-check'
        iconBackgroundColor.value = withTiming(theme.colors.grayLight, { duration: 500 })
      }, 1000)
    },
  })

  const gestureHandler = Gesture.Pan()
    .onChange((event) => {
      translateX.value = event.translationX
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withTiming(0)
        runOnJS(completeItem.mutate)(item.id)
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-itemHeight.value, {}, () => {
          runOnJS(deleteFocusItem.mutate)(item.id)
        })
      } else {
        translateX.value = withSpring(0)
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(fontColor.value, [0, 1], [theme.colors.secondary, theme.colors.red]),
  }))

  const leftActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > 0 ? translateX.value / SWIPE_THRESHOLD : 0,
  }))

  const rightActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < 0 ? -translateX.value / SWIPE_THRESHOLD : 0,
  }))

  const onDeleteMenuItemPress = useCallback(() => {
    deleteFocusItem.mutate(item.id)
  }, [deleteFocusItem, item.id])

  return (
    <View style={[styles.container]}>
      <Reanimated.View style={[styles.leftAction, leftActionStyle]}>
        <Text style={styles.actionText}>Complete</Text>
      </Reanimated.View>
      <Reanimated.View style={[styles.rightAction, rightActionStyle]}>
        <Text style={styles.actionText}>Delete</Text>
      </Reanimated.View>
      <ContextMenu.Root>
        <ContextMenu.Trigger action="longPress" style={{ flex: 1, width: '100%' }}>
          <GestureDetector gesture={gestureHandler}>
            <Reanimated.View style={[styles.itemContainer, animatedStyle]}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, flexDirection: 'column', rowGap: 6 }}>
                  <Reanimated.Text style={[listStyles.text, styles.text, textStyle, { flex: 1 }]}>
                    {label}
                  </Reanimated.Text>
                  {item.due_date ? (
                    <MSText variant="body" color="grayDark">
                      {Intl.DateTimeFormat('en-US').format(new Date(item.due_date))}
                    </MSText>
                  ) : null}
                </View>
                <Reanimated.View style={[styles.icon, { backgroundColor: iconBackgroundColor }]}>
                  <MindsherpaIcon name={iconName.value} size={20} color="white" />
                </Reanimated.View>
              </View>
            </Reanimated.View>
          </GestureDetector>
        </ContextMenu.Trigger>
        <ContextMenu.Content
          alignOffset={10}
          loop={false}
          avoidCollisions={true}
          collisionPadding={12}
        >
          <ContextMenu.Label>Actions</ContextMenu.Label>
          <ContextMenu.Item key="delete" onSelect={onDeleteMenuItemPress}>
            <ContextMenu.ItemIcon ios={{ name: 'trash', size: 20 }} />
            <ContextMenu.ItemTitle>Delete</ContextMenu.ItemTitle>
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    ...borderStyle.borderBottom,
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingRight: 16,
    borderRadius: 12,
    backgroundColor: theme.colors.white,
  },
  text: {
    flex: 1,
    fontWeight: 500,
    fontSize: 18,
    lineHeight: 28,
  },
  icon: {
    borderRadius: 9999,
    padding: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftAction: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.green,
    paddingHorizontal: 20,
  },
  rightAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.red,
    paddingHorizontal: 20,
  },
  actionText: {
    color: theme.colors.white,
    fontWeight: 'bold',
  },
})
