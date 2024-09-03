import { Stack } from 'expo-router'
import React from 'react'

const DrawerLayout = () => {
  return (
    <Stack initialRouteName="focus">
      <Stack.Screen name="focus" options={{ headerShown: false }} />
      <Stack.Screen name="(sherpa)" options={{ headerShown: false }} />
      <Stack.Screen name="(notebook)" options={{ headerShown: false }} />
      <Stack.Screen name="(account)" options={{ presentation: 'modal', headerTitle: 'Account' }} />
    </Stack>
  )
}

export default React.memo(DrawerLayout)
