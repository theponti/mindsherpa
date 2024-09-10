import { captureException } from '@sentry/react-native'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { Redirect } from 'expo-router'
import { useState } from 'react'
import { SafeAreaView, View } from 'react-native'
import { Button } from '~/components/Button'
import { FeedbackBlock } from '~/components/feedback-block'
import TextInput from '~/components/text-input'
import { Text, theme } from '~/theme'
import { useAppContext } from '~/utils/app-provider'
import { request } from '~/utils/query-client'

type AuthenticationResponse = {
  id: string
  email: string
  full_name: string
  user_id: string
}

type CreateUserPayload = {
  email: string
  name: string
  userId: string
}

const Onboarding = () => {
  const { session, profile } = useAppContext()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const { isError, mutate } = useMutation<AuthenticationResponse, AxiosError, CreateUserPayload>({
    mutationKey: ['createUser'],
    mutationFn: async ({ email, userId, name }: CreateUserPayload) => {
      const { data } = await request<AuthenticationResponse>({
        method: 'POST',
        url: '/user/create',
        data: { email, user_id: userId, name },
      })

      return data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data)
    },
    onError: (error) => {
      captureException(error)
    },
  })

  const onButtonPress = () => {
    if (!session) return

    mutate({
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      email: session.user.email!,
      userId: session.user.id,
      name,
    })
  }

  if (!session) {
    return <Redirect href="/(auth)" />
  }

  if (profile) {
    return <Redirect href="/(drawer)/focus" />
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.tertiary,
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          paddingHorizontal: 24,
          rowGap: 48,
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            paddingTop: 24,
            alignItems: 'center',
            marginBottom: 48,
            rowGap: 12,
          }}
        >
          <Text variant="header">Welcome!</Text>
          <Text variant="label" color="quaternary">
            Let us know what to call you.
          </Text>
        </View>

        <TextInput
          aria-disabled
          label="Name"
          placeholder="Enter your name"
          value={name}
          style={{ flex: 1 }}
          onChange={(e) => setName(e.nativeEvent.text)}
        />
        <Button title="Create profile" onPress={onButtonPress} />
        {isError ? (
          <FeedbackBlock error>
            <Text variant="body">There was a problem creating your profile.</Text>
          </FeedbackBlock>
        ) : null}
      </View>
    </SafeAreaView>
  )
}

export default Onboarding
