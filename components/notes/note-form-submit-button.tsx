import { MaterialIcons } from '@expo/vector-icons'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Colors } from '~/utils/styles'

export const FormSubmitButton = ({
  isLoading,
  onSubmitButtonClick,
}: {
  buttonType: 'voice' | 'text'
  disabled: boolean
  isLoading: boolean
  onSubmitButtonClick: () => void
}) => {
  if (isLoading) {
    return (
      <TouchableOpacity style={[styles.sendButton]} disabled>
        <ActivityIndicator size="small" color="black" />
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity onPress={onSubmitButtonClick} style={[styles.sendButton]}>
      <MaterialIcons name="arrow-upward" size={24} color={Colors.white} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  sendButton: {
    backgroundColor: Colors.blueDark,
    borderRadius: 50,
    padding: 8,
  },
})
