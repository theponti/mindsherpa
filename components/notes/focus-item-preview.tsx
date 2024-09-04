import { Pressable, StyleSheet, View, type ViewProps } from 'react-native'
import { Text, theme } from '~/theme'
import type { FocusItem } from '~/utils/services/notes/types'
import MindsherpaIcon from '../ui/icon'

type FocusItemPreviewProps = {
  disabled: boolean
  focusItem: FocusItem
  onDeleteClick: (focusItem: FocusItem) => void
  onCreateClick: (focusItem: FocusItem) => void
} & ViewProps
const FocusItemPreview = ({
  disabled,
  focusItem,
  onDeleteClick,
  onCreateClick,
  ...props
}: FocusItemPreviewProps) => {
  const onDeleteIconPress = () => {
    onDeleteClick(focusItem)
  }

  const onIconPress = () => {
    onCreateClick(focusItem)
  }

  return (
    <View style={[focusItemStyles.item]} {...props}>
      <View style={[focusItemStyles.info]}>
        <Text variant="body" color="black">
          {focusItem.text}
        </Text>
        {focusItem.dueDate ? <Text variant="caption">Due: {focusItem.dueDate}</Text> : null}
      </View>
      <Pressable disabled={disabled} style={[focusItemStyles.icon]} onPress={onDeleteIconPress}>
        <MindsherpaIcon name="trash" size={24} color={theme.colors.red} />
      </Pressable>
      <Pressable disabled={disabled} style={[focusItemStyles.icon]} onPress={onIconPress}>
        <MindsherpaIcon name="list-tree" size={24} color={theme.colors.black} />
      </Pressable>
    </View>
  )
}

const focusItemStyles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: theme.colors.blueLight,
    borderRadius: 16,
  },
  info: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  icon: {
    justifyContent: 'center',
    marginRight: 20,
  },
})

export default FocusItemPreview
