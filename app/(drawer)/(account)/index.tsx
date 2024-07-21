import { Redirect, Stack } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';

import { Button } from '~/components/Button';
import Avatar from '~/components/avatar';
import { Text } from '~/theme';
import { useAuth } from '~/utils/auth/auth-context';
import { profilesService } from '~/utils/services/profiles-service';
import { supabase } from '~/utils/supabase';

function Account() {
  const { profile, session } = useAuth();
  const onLogoutPress = () => {
    supabase.auth.signOut();
  };

  const onAvatarUpload = useCallback(async (url: string) => {
    const { error } = await profilesService.update(session!.user.id, { name, avatar_url: url });

    if (error) {
      // ! TODO Replace with a proper error handling (toast notification, etc.)
      console.error('Error updating profile:', error);
    }

    // ! TODO Replace with a proper success handling (toast notification, etc.)
    // ! TODO Replace with a proper updateProfile function that will reload the profile within the AuthContext
    // updateProfile(data);
  }, []);

  // if (!session || !profile) {
  //   return <Redirect href="(auth)/index" />;
  // }
  if (!profile) {
    console.error('Profile not found', session, profile);
  }
  const { name, avatar_url } = profile || {};

  return (
    <>
      <Stack.Screen options={{ title: 'Account' }} />
      <View style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 24 }}>
        <Avatar size={200} url={avatar_url} onUpload={onAvatarUpload} />
        <Text variant="title">Your account</Text>
        <View
          style={{
            position: 'absolute',
            bottom: 50,
            left: 12,
            alignItems: 'center',
            width: '100%',
          }}>
          <Button title="Sign out" onPress={onLogoutPress} />
        </View>
      </View>
    </>
  );
}

export default Account;
