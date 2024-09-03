import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, View, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { Text } from '~/theme';
import { supabase } from '~/utils/supabase';
import { useAppContext } from '~/utils/app-provider';
import { useMutation } from '@tanstack/react-query';
import { request } from '~/utils/query-client';

const LoginSheet = ({ isLoadingAuth }: { isLoadingAuth?: boolean }) => {
  const { session } = useAppContext();
  const router = useRouter();
  const textStyle = useAnimatedStyle(() => ({
    opacity: withTiming(1, { duration: 1000 }),
  }));
  const createUser = useMutation({
    mutationKey: ['createUser'],
    mutationFn: async ({ email }: { email: string }) => {
      const { data } = await request({
        method: 'POST',
        url: '/user/create',
        data: { email },
      });

      return { data };
    },
    onSuccess: () => {
      router.push('/(drawer)');
    },
    onError: (error) => {
      console.log(error);
      Alert.alert('Error', 'We could not register you at this time. Please try again later.');
    },
  });
  const onSignInClick = async () => {
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
        throw new Error(error.message);
      }

      if (!user?.email) {
        throw new Error('No email provided');
      }

      createUser.mutate({ email: user.email });
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'ERR_REQUEST_CANCELED') {
        // User canceled, no need for an alert
        return;
      }

      console.log(error);
      // captureException(error);

      Alert.alert('Sign-In Issue', 'There was a problem signing in. Please try again.', [
        { text: 'OK' },
        {
          text: 'Try Again',
          onPress: () => {
            onSignInClick();
          },
        },
      ]);
    }
  };

  useEffect(() => {
    if (session) {
      router.push('/(drawer)/focus');
    }
  }, [router, session]);

  if (isLoadingAuth) {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <View style={[styles.container, { flex: 1, rowGap: 8, justifyContent: 'center' }]}>
          <Animated.Text style={[styles.text, textStyle]}>
            <Text>Loading your account</Text>
          </Animated.Text>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="black" />
          </View>
        </View>
      </View>
    );
  }

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
  );
};

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
});

export default LoginSheet;
