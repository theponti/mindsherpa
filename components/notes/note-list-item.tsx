import { useCallback } from 'react'
import type { GestureResponderEvent, ViewStyle } from 'react-native'
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native-gesture-handler'
import { Text } from '~/theme'
import { borderStyle, listStyles } from '~/theme/styles'
import type { NoteOutput } from '~/utils/schema/graphcache'

export const NoteListItem = ({
  icon,
  headerRight,
  label,
  showBorder,
  item,
  style,
  ...props
}: TouchableOpacityProps & {
  icon?: React.ReactNode
  item: NoteOutput
  headerRight?: React.ReactNode
  label: string
  showBorder?: boolean
  style?: ViewStyle[]
}) => {
  const onSwipeRight = useCallback((event: GestureResponderEvent) => {}, [])
  return (
    <TouchableOpacity
      style={[
        listStyles.container,
        showBorder ? borderStyle.borderBottom : borderStyle.noBorder,
        style,
      ]}
      {...props}
    >
      {icon ?? null}
      <Text variant="body" style={listStyles.text}>
        {label}
      </Text>
      {headerRight ?? null}
    </TouchableOpacity>
  )
}
