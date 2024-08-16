import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

import { Colors, borderStyle } from '~/utils/styles'

export const Card = ({ children }: { children: React.ReactNode }) => {
  const opacity = useSharedValue(0)

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  useEffect(() => {
    opacity.value = withSpring(1, { duration: 500 })
  })

  return (
    <Animated.View style={[opacityStyle, borderStyle.border, styles.container]}>
      {children}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.grayLight,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
})
