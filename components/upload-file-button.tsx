import { MaterialIcons } from '@expo/vector-icons'
import { Pressable, StyleSheet } from 'react-native'
import { type PressableProps } from 'react-native'
import { Colors } from '~/utils/styles'

export const UploadFileButton = ({ style, ...props }: PressableProps) => {
  return (
    <Pressable style={[styles.button]} {...props}>
      <MaterialIcons name="add" size={24} color="black" />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.grayLight,
    padding: 8,
    borderRadius: 50,
  },
})
