import { Redirect } from 'expo-router'
import React from 'react'
import { Image, View } from 'react-native'

import LoginSheet from '~/components/authentication/login-sheet'
import { Box } from '~/theme'
import { useAppContext } from '~/utils/app-provider'

function Auth() {
  const { session } = useAppContext()

  if (session) {
    return <Redirect href="/(drawer)/focus" />
  }

  return (
    <Box flex={1}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('~/assets/icon.png')}
          style={{ height: 250, maxHeight: 250, maxWidth: 250, width: 250 }}
        />
      </View>
      <LoginSheet />
    </Box>
  )
}

export default Auth
