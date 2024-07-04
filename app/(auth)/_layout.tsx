import * as AppleAuthentication from 'expo-apple-authentication';
import { Redirect, useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { useAuth } from '~/utils/auth/auth-context';
import { supabase } from '~/utils/supabase';

export default function Auth() {
  const { session } = useAuth();
  const router = useRouter();

  if (session) {
    return <Redirect href="(drawer)" />;
  }

  return (
    <View style={styles.container}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.button}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });

            if (!credential.identityToken) {
              Alert.alert('Apple Sign-In failed', 'No identify token provided');
              return null;
            }

            const {
              data: { user },
              error,
            } = await supabase.auth.signInWithIdToken({
              provider: 'apple',
              token: credential.identityToken,
            });

            if (error) {
              Alert.alert(error.message);
              return null;
            }

            if (user) {
              const { error } = await supabase.from('profiles').insert({});

              if (error) {
                // ! TODO Replace with a proper error handling (toast notification, etc.)
                console.error('Error creating profile:', error);
              }

              router.push('(drawer)');
            }
          } catch (error: any) {
            if (error.code === 'ERR_REQUEST_CANCELED') {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 200,
    height: 44,
  },
});
