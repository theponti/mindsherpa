import React from 'react'
import { Pressable, StyleSheet, Text, type PressableProps, type ViewStyle } from 'react-native'
import Reanimated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated'
import * as ContextMenu from 'zeego/context-menu'

import { theme } from '~/theme'
import { borderStyle, listStyles } from '~/theme/styles'
import type { FocusItem } from '~/utils/services/notes/types'
import { useFocusItemComplete } from '../../utils/services/notes/use-focus-item-complete'
import MindsherpaIcon, { type MindsherpaIconName } from '../ui/icon'

export const FocusListItem = ({
  item,
  label,
  onComplete,
  onDelete,
  showBorder,
  style,
  ...props
}: PressableProps & {
  item: FocusItem
  label: string
  onComplete: (data: FocusItem) => void
  onDelete: () => void
  showBorder?: boolean
  style?: ViewStyle[]
}) => {
  const fontColor = useSharedValue(0)
  const iconBackgroundColor = useSharedValue(theme.colors.grayLight)
  const iconName = useSharedValue<MindsherpaIconName>('check')

  const completeItem = useFocusItemComplete({
    onSuccess: (data) => {
      iconBackgroundColor.value = withTiming(theme.colors.green, { duration: 500 })
      setTimeout(() => {
        onComplete(data)
      }, 600)
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

  const onRadioButtonPress = () => {
    completeItem.mutate(item.id)
  }

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(fontColor.value, [0, 1], [theme.colors.secondary, theme.colors.red]),
  }))

  const iconStyle = useAnimatedStyle(() => ({
    backgroundColor: withSpring(iconBackgroundColor.value, { stiffness: 1000 }),
  }))

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger action="longPress">
        <Reanimated.View style={[styles.container]}>
          <Reanimated.Text style={[listStyles.text, styles.text, textStyle]}>
            {label}
          </Reanimated.Text>
          <AnimatedPressable
            style={[styles.icon, iconStyle]}
            onPress={onRadioButtonPress}
            disabled={completeItem.isPending}
          >
            <MindsherpaIcon name={iconName.value} size={20} color="white" />
          </AnimatedPressable>
        </Reanimated.View>
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

const AnimatedPressable = Reanimated.createAnimatedComponent(Pressable)

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    paddingRight: 16,
    columnGap: 12,
    marginHorizontal: 12,
    backgroundColor: theme.colors.white,
    ...borderStyle.borderBottom,
    borderRadius: 24,
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
  deleteButton: {
    backgroundColor: theme.colors.red,
    color: theme.colors.white,
    padding: 16,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

function LeftAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: drag.value - 100,
          ...(drag.value > 100 ? { width: 100 + drag.value } : {}),
        },
      ],
    }
  })

  return (
    <Reanimated.View style={[leftActionStyle.container, styleAnimation]}>
      <Text style={leftActionStyle.completeButton}>Complete</Text>
    </Reanimated.View>
  )
}

const leftActionStyle = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.red,
  },
  completeButton: {
    backgroundColor: theme.colors.green,
    color: theme.colors.white,
    padding: 16,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const styleAnimation = useAnimatedStyle(() => {
    // console.log('[R] showRightProgress:', prog.value);
    // console.log('[R] appliedTranslation:', drag.value);
    return {
      transform: [{ translateX: drag.value + 80 }],
      ...(drag.value > 100 ? { width: 100 + drag.value } : {}),
    }
  })

  return (
    <Reanimated.View style={styleAnimation}>
      <Text style={styles.deleteButton}>Delete</Text>
    </Reanimated.View>
  )
}
