// Import the new component
import { Redirect } from 'expo-router';
import { useCallback } from 'react';
import { View } from 'react-native';

import Avatar from './avatar';

import { useAuth } from '~/utils/auth/auth-context';
import { profiles } from '~/utils/supabase';

export default function Account() {
  const { profile, session } = useAuth();

  const onAvatarUpload = useCallback(async (url: string) => {
    const { error } = await profiles.update(session!.user.id, { name, avatar_url: url });

    if (error) {
      // ! TODO Replace with a proper error handling (toast notification, etc.)
      console.error('Error updating profile:', error);
    }

    // ! TODO Replace with a proper success handling (toast notification, etc.)
    // ! TODO Replace with a proper updateProfile function that will reload the profile within the AuthContext
    // updateProfile(data);
  }, []);

  if (!session || !profile) {
    return <Redirect href="(auth)" />;
  }

  const { name, avatar_url } = profile;

  return (
    <View>
      <View>
        <Avatar size={200} url={avatar_url} onUpload={onAvatarUpload} />
      </View>
    </View>
  );
}
