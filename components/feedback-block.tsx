import { PropsWithChildren, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated'

import { Colors } from '~/utils/styles'

export const FeedbackBlock = ({ children }: PropsWithChildren) => {
  const opacity = useSharedValue(0)

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 })
  }, [])

  return <Animated.View style={[styles.error, { opacity }]}>{children}</Animated.View>
}

const styles = StyleSheet.create({
  error: {
    gap: 4,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 32,
    backgroundColor: Colors.tomato,
    borderRadius: 5,
    marginVertical: 8,
  },
})
