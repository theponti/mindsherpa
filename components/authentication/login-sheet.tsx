import { captureException } from '@sentry/react-native'
import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import * as AppleAuthentication from 'expo-apple-authentication'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'
import { Alert, StyleSheet, View } from 'react-native'

import queryClient, { request } from '~/utils/query-client'
import { supabase } from '~/utils/supabase'

type CreateUserResponse = {
  user_id: string
  profile_id: string
  email: string
  name: string
}

const LoginSheet = () => {
  const router = useRouter()

  const createUser = useMutation<CreateUserResponse, AxiosError, { email: string }>({
    mutationKey: ['createUser'],
    mutationFn: async ({ email }: { email: string }) => {
      const { data } = await request<CreateUserResponse>({
        method: 'POST',
        url: '/user/create',
        data: { email },
      })

      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data)
      router.push('/(drawer)/focus')
    },
    onError: (error) => {
      captureException(error)
      Alert.alert('Error', 'We could not register you at this time. Please try again later.')
      supabase.auth.signOut()
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

      createUser.mutate({ email: user.email })
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'ERR_REQUEST_CANCELED') {
        // User canceled, no need for an alert
        return
      }

      captureException(error)

      Alert.alert('Sign-In Issue', 'There was a problem signing in. Please try again.', [
        { text: 'OK' },
        {
          text: 'Try Again',
          onPress: () => {
            onSignInClick()
          },
        },
      ])
    }
  }, [createUser.mutate])

  return (
    <View style={[styles.container]}>
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
