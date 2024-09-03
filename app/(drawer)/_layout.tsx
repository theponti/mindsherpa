import { Redirect, Stack } from 'expo-router'
import React, { useEffect, useState } from 'react'

import { LoadingFull } from '~/components/LoadingFull'
import { Text } from '~/theme'
import { useAppContext } from '~/utils/app-provider'
import { useProfileQuery } from '~/utils/services/profiles/Profiles.query.generated'
import { supabase } from '~/utils/supabase'

const DrawerLayout = () => {
  const { session, setProfile, profile, setProfileLoading } = useAppContext()
  const [profileQueryResponse, fetchProfile] = useProfileQuery({
    pause: true,
  })
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  useEffect(() => {
    let isMounted = true

    if (session && !profileQueryResponse.data && retryCount < maxRetries) {
      fetchProfile()
      setRetryCount(retryCount + 1)
    }

    return () => {
      isMounted = false
    }
  }, [session, fetchProfile, profileQueryResponse.data, retryCount])

  useEffect(() => {
    let isMounted = true

    if (profileQueryResponse.data?.profile && isMounted) {
      setProfile(profileQueryResponse.data.profile)
      setProfileLoading(false) // set to false when profile loads successfully
    }

    if (profileQueryResponse.error) {
      supabase.auth.signOut()
    }

    return () => {
      isMounted = false
    }
  }, [profileQueryResponse, setProfile, setProfileLoading])

  if (!session) {
    return <Redirect href="/(auth)" />
  }

  if (
    profileQueryResponse.fetching ||
    (profileQueryResponse.data == null && retryCount < maxRetries)
  ) {
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

export default DrawerLayout
