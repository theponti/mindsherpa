import { Redirect, Stack } from 'expo-router'
import React, { useEffect } from 'react'

import { LoadingFull } from '~/components/LoadingFull'
import { Text } from '~/theme'
import { useAppContext } from '~/utils/app-provider'
import { useProfileQuery } from '~/utils/services/profiles/Profiles.query.generated'
import { supabase } from '~/utils/supabase'

const App = () => {
  const { session, setProfile } = useAppContext()
  const [profileQueryResponse, fetchProfile] = useProfileQuery({
    pause: true,
  })

  useEffect(() => {
    if (session && !profileQueryResponse.data) {
      fetchProfile()
    }
  }, [session, fetchProfile, profileQueryResponse.data])

  useEffect(() => {
    if (profileQueryResponse.data?.profile) {
      setProfile(profileQueryResponse.data.profile)
    }

    if (profileQueryResponse.error) {
      supabase.auth.signOut()
    }
  }, [profileQueryResponse, setProfile])

  if (!session) {
    return <Redirect href="/(auth)" />
  }

  if (profileQueryResponse.fetching) {
    return (
      <LoadingFull>
        <Text variant="title">Loading your account...</Text>
      </LoadingFull>
    )
  }

  return (
    <Stack initialRouteName="focus">
      <Stack.Screen name="focus" options={{ headerShown: false }} />
      <Stack.Screen name="(sherpa)" options={{ headerShown: false }} />
      <Stack.Screen name="(notebook)" options={{ headerShown: false }} />
      <Stack.Screen name="(account)" options={{ presentation: 'modal', headerTitle: 'Account' }} />
    </Stack>
  )
}

export default App
