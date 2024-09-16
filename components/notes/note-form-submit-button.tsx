import { MaterialIcons } from '@expo/vector-icons'
import { useEffect } from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { Text, theme } from '~/theme'

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)
const AnimatedText = Animated.createAnimatedComponent(Text)

export const FormSubmitButton = ({
  isLoading,
  isRecording,
  onSubmitButtonClick,
}: {
  isLoading: boolean
  isRecording?: boolean
  onSubmitButtonClick: () => void
}) => {
  const loadingOpacity = useSharedValue(0)
  const loadingWidth = useSharedValue(0)
  const loadingTextStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
    width: loadingWidth.value,
  }));

  useEffect(() => {
    // 👇 Animate the loading indicator.
    loadingWidth.value = withSpring(isLoading ? 85 : 0, { duration: 1500, clamp: { max: 95 } }) 
    loadingOpacity.value = withSpring(isLoading ? 1 : 0, { duration: 1500 })
  }, [isLoading, loadingWidth, loadingOpacity])


  if (isLoading) {
    return (
      <AnimatedTouchableOpacity disabled style={[styles.sendButton, styles.loadingButton]}>
          <ActivityIndicator size="small" color="white" />
          <AnimatedText 
            variant="body" 
            color="white" 
            style={[loadingTextStyle]}>
            Thinking...
          </AnimatedText>
      </AnimatedTouchableOpacity>
    )
  }

  return (
    <AnimatedTouchableOpacity
      disabled={isRecording}
      onPress={onSubmitButtonClick}
      style={[styles.sendButton, { backgroundColor: isRecording ? theme.colors.grayMedium : theme.colors['fg-primary'] }]}
    >
      <MaterialIcons name="arrow-upward" size={24} color={theme.colors.white} />
    </AnimatedTouchableOpacity>
  )
}

const styles = StyleSheet.create({
  loadingButton: {
    flexDirection: 'row', 
    alignItems: 'center',
    columnGap: 12,
    paddingHorizontal: 12,
    lineHeight: 24,
    maxHeight: 44,
  },
  sendButton: {
    backgroundColor: theme.colors['fg-primary'],
    borderRadius: 50,
    padding: 8,
  },
})
