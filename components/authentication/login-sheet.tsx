import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from 'expo-router';
import { Alert, View, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { LoadingFull } from '../LoadingFull';

import { Text } from '~/theme';
import { profilesService } from '~/utils/services/profiles-service';
import { supabase } from '~/utils/supabase';

const LoginSheet = ({ isLoadingAuth }: { isLoadingAuth?: boolean }) => {
  const router = useRouter();

  const textStyle = useAnimatedStyle(() => ({
    opacity: withTiming(1, { duration: 1000 }),
  }));

  if (isLoadingAuth) {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <View style={[styles.container]}>
          <Animated.Text style={[styles.text, textStyle]}>
            <Text>Loading your account</Text>
          </Animated.Text>
          <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: -50 }}>
            <ActivityIndicator size="large" color="black" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <Animated.Text style={[styles.text, textStyle]}>Log in</Animated.Text>
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
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
                const data = await profilesService.create(user.id);

                if (data) {
                  router.push('(drawer)');
                }
              }
            } catch (error: any) {
              if (error.code === 'ERR_REQUEST_CANCELED') {
                //! TODO handle that the user canceled the sign-in flow
              } else {
                //! TODO handle other errors
              }
            }
          }}
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
    backgroundColor: 'white',
    height: 250,
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
