import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type ViewStyle,
} from 'react-native'
import Reanimated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated'
import * as ContextMenu from 'zeego/context-menu'

import { theme } from '~/theme'
import { AnimatedText } from '~/theme/Text'
import { borderStyle, listStyles } from '~/theme/styles'
import { useAppContext } from '~/utils/app-provider'
import type { FocusItem } from '~/utils/services/notes/types'
import { useFocusItemComplete } from './use-focus-item-complete'

export const TaskListItem = ({
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
  const { session } = useAppContext()
  if (!session) {
    return null
  }

  const fontColor = useSharedValue(0)
  const opacity = useSharedValue(1)
  const completeItem = useFocusItemComplete({
    id: item.id,
    token: session.access_token,
    onSuccess: (data) => {
      onComplete(data)
      opacity.value = 1
      fontColor.value = 1
      const interval = setInterval(() => {
        fontColor.value -= 0.1
      }, 100)
      setTimeout(() => clearInterval(interval), 1000)
    },
    onError: () => {
      opacity.value = 1
      fontColor.value = 1
      const interval = setInterval(() => {
        fontColor.value -= 0.1
      }, 100)
      setTimeout(() => clearInterval(interval), 1000)
    },
  })

  const onRadioButtonPress = () => {
    opacity.value = 0.4
    completeItem.mutate()
  }

  const textStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      fontColor.value,
      [0, 1],
      [theme.colors.secondary, theme.colors.red]
    )
    return {
      color,
    }
  }, [fontColor])

  const opacityStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    }
  }, [opacity])

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger action="longPress">
        <Reanimated.View style={[styles.container, opacityStyle]}>
          <AnimatedText variant="body" style={[listStyles.text, styles.text, textStyle]}>
            {label}
          </AnimatedText>
          <Pressable
            style={[styles.iconWrap]}
            onPress={onRadioButtonPress}
            disabled={completeItem.isPending}
          >
            {completeItem.isPending ? (
              <ActivityIndicator size={20} color={theme.colors.black} />
            ) : (
              <FontAwesome
                name="circle-o"
                size={20}
                color={theme.colors.quaternary}
                style={[styles.icon]}
              />
            )}
          </Pressable>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
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
  icon: {},
  iconWrap: {
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
