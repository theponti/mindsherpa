import { MaterialIcons } from '@expo/vector-icons'
import { useEffect } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { Colors } from '~/utils/styles'

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

export const FormSubmitButton = ({
  isLoading,
  isRecording,
  onSubmitButtonClick,
}: {
  isLoading: boolean
  isRecording?: boolean
  onSubmitButtonClick: () => void
}) => {
  const opacity = useSharedValue(1)
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  useEffect(() => {
    opacity.value = withSpring(isRecording ? 0 : 1, { duration: 400 })
  }, [isRecording])

  if (isLoading) {
    return (
      <TouchableOpacity style={[styles.sendButton]} disabled>
        <ActivityIndicator size="small" color="black" />
      </TouchableOpacity>
    )
  }

  return (
    <AnimatedTouchableOpacity
      onPress={onSubmitButtonClick}
      style={[styles.sendButton, containerStyle]}
    >
      <MaterialIcons name="arrow-upward" size={24} color={Colors.white} />
    </AnimatedTouchableOpacity>
  )
}

const styles = StyleSheet.create({
  sendButton: {
    backgroundColor: Colors.blueDark,
    borderRadius: 50,
    padding: 8,
  },
})