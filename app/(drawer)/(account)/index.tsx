import { MaterialIcons } from '@expo/vector-icons'
import { Link, Redirect, Stack } from 'expo-router'
import { View } from 'react-native'

import { Button } from '~/components/Button'
import TextInput from '~/components/text-input'
import { Text } from '~/theme'
import { useAppContext } from '~/utils/app-provider'
import { Colors } from '~/utils/styles'
import { supabase } from '~/utils/supabase'

function Account() {
  const { session } = useAppContext()
  const onLogoutPress = () => {
    supabase.auth.signOut()
  }

  if (!session) {
    return <Redirect href="/(auth)" />
  }

  // const { name, avatar_url } = profile || {};

  return (
    <>
      <Stack.Screen options={{ title: 'Account' }} />
      <View style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 24, rowGap: 8 }}>
        <View
          style={{
            marginBottom: 15,
            borderWidth: 1,
            borderRadius: 12,
            borderColor: Colors.black,
            alignSelf: 'flex-start',
            paddingVertical: 12,
            paddingHorizontal: 12,
          }}
        >
          <Link
            href="/(drawer)/focus"
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <MaterialIcons name="arrow-back" size={24} color={Colors.black} />
            <Text variant="body" color="black" style={{ alignSelf: 'center' }}>
              Back
            </Text>
          </Link>
        </View>
        <Text variant="large">Your account</Text>
        {/* <Avatar size={200} url={avatar_url || ''} onUpload={onAvatarUpload} /> */}

        <View style={{ flex: 1, rowGap: 24, marginTop: 32 }}>
          <View style={{ rowGap: 8 }}>
            <Text variant="label">Email</Text>
            <TextInput
              aria-disabled
              editable={false}
              placeholder="Enter your name"
              value={session.user.email}
              // onChangeText={(text) => setName(text)}
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
    </>
  )
}

export default Account
