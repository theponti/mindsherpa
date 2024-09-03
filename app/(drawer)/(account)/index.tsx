import { Redirect, Stack } from 'expo-router'
import { View } from 'react-native'

import { Button } from '~/components/Button'
import TextInput from '~/components/text-input'
import { Text } from '~/theme'
import { useAppContext } from '~/utils/app-provider'
import { supabase } from '~/utils/supabase'

function Account() {
  const { session, profile } = useAppContext()
  const onLogoutPress = () => {
    supabase.auth.signOut()
  }

  if (!session || !profile) {
    return <Redirect href="/(auth)" />
  }

  const { fullName } = profile || {}

  return (
    <View style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 24, rowGap: 8 }}>
      <Text variant="cardHeader">Your account</Text>
      {/* <Avatar size={200} url={avatar_url || ''} onUpload={onAvatarUpload} /> */}
      <View style={{ flex: 1, rowGap: 24, marginTop: 32 }}>
        <View style={{ rowGap: 8 }}>
          <Text variant="label">Email</Text>
          <TextInput
            aria-disabled
            editable={false}
            placeholder="Enter your name"
            value={session.user.email}
          />
        </View>
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
