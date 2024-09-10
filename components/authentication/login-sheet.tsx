import { captureException } from '@sentry/react-native'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import * as AppleAuthentication from 'expo-apple-authentication'
import { useCallback, useState } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { Text } from '~/theme'

import queryClient, { request } from '~/utils/query-client'
import { supabase } from '~/utils/supabase'

const LoginSheet = () => {
  const [authError, setAuthError] = useState<string | null>(null)
  const createUser = useMutation<AuthenticationResponse, AxiosError, CreateUserPayload>({
    mutationKey: ['createUser'],
    mutationFn: async ({ email, userId }: CreateUserPayload) => {
      const { data } = await request<AuthenticationResponse>({
        method: 'POST',
        url: '/user/create',
        data: { email, userId },
      })

      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data)
    },
    onError: (error) => {
      captureException(error)
      setAuthError('There was a problem signing in. Our team is working on it.')
      // supabase.auth.signOut()
    },
  })

  const onSignInClick = useCallback(async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })

      if (!credential.identityToken) {
        Alert.alert('Apple Sign-In failed', 'No identify token provided')
        return null
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      })

      if (error) {
        throw new Error(error.message)
      }

      if (!user?.email) {
        throw new Error('No email provided')
      }

      createUser.mutate({ email: user.email, userId: user.id })
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'ERR_REQUEST_CANCELED') {
        // User canceled, no need for an alert
        return
      }

      captureException(error)
      setAuthError('There was a problem signing in. Our team is working on it.')
    }
  }, [createUser.mutate])

  return (
    <View style={[styles.container]}>
      {(authError || createUser.error) && (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Text style={styles.text}>{authError}</Text>
        </View>
      )}
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={5}
          style={styles.button}
          onPress={onSignInClick}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 75,
    borderRadius: 40,
  },
  text: {
    color: 'black',
    opacity: 0,
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    width: 200,
    height: 44,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    color: 'black',
    marginTop: -22,
  },
})

export default LoginSheet
