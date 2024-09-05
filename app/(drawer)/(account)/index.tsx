import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { View } from 'react-native'

import { Button } from '~/components/Button'
import TextInput from '~/components/text-input'
import { Text } from '~/theme'
import { useAppContext } from '~/utils/app-provider'
import queryClient from '~/utils/query-client'
import { useAuthenticatedRequest } from '~/utils/use-authenticated-request'

function Account() {
  const { session, signOut, profile } = useAppContext()
  const authRequest = useAuthenticatedRequest()
  const initialName = profile?.full_name || ''
  const [name, setName] = useState(initialName)
  const { mutateAsync, isPending, status } = useMutation({
    mutationKey: ['account/update'],
    mutationFn: async () => {
      await authRequest({
        method: 'PUT',
        url: '/user/profile',
        data: { full_name: name },
      })

      // 🛰️ Reload profile
      await queryClient.invalidateQueries({ queryKey: ['profile'] })

      return true
    },
  })
  // const [avatarUrl, setAvatarUrl] = useState('')

  // const onAvatarUpload = (url: string) => {
  //   setAvatarUrl(url)
  // }

  const onSavePress = () => {
    mutateAsync()
  }

  const onLogoutPress = () => {
    signOut()
  }

  useEffect(() => {
    if (profile?.full_name) {
      setName(profile.full_name)
      // setAvatarUrl(profile.avatarUrl)
    }
  }, [profile])

  if (!session) {
    return null
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 24, rowGap: 8 }}>
      <Text variant="cardHeader">Your account</Text>
      {/* <Avatar size={200} url={avatarUrl || ''} onUpload={onAvatarUpload} /> */}
      <View style={{ rowGap: 24, marginTop: 32 }}>
        <View>
          <TextInput
            aria-disabled
            label="Name"
            placeholder="Enter your name"
            value={name}
            style={{ flex: 1 }}
            onChange={(e) => setName(e.nativeEvent.text)}
          />
        </View>
        <View>
          <TextInput
            aria-disabled
            label="Email"
            editable={false}
            value={session.user.email}
            style={{ flex: 1 }}
          />
        </View>
        {name !== initialName ? (
          <View style={{ marginTop: 24 }}>
            <Button title="Save" disabled={isPending} isLoading={isPending} onPress={onSavePress} />
          </View>
        ) : null}
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 50,
          left: 12,
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Button title="Sign out" onPress={onLogoutPress} />
      </View>
    </View>
  )
}

export default Account
