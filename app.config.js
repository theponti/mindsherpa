export default {
  expo: {
    name: 'mindsherpa',
    slug: 'mindsherpa',
    version: '1.0.0',
    scheme: 'mindsherpa',
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-dev-launcher',
        {
          launchMode: 'most-recent',
        },
      ],
      'expo-apple-authentication',
      'expo-build-properties',
      [
        'expo-font',
        {
          fonts: [
            './assets/fonts/Plus_Jakarta_Sans.ttf',
            './assets/fonts/icons/fa-regular-400.ttf',
          ],
        },
      ],
      [
        'expo-av',
        {
          microphonePermission: 'Allow $(PRODUCT_NAME) to access your microphone.',
        },
      ],
      [
        '@sentry/react-native/expo',
        {
          url: 'https://sentry.io/',
          project: 'mindsherpa-ios',
          organization: 'ponti-co-llc',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
    },
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.pontistudios.mindsherpa',
      usesAppleSignIn: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.pontistudios.mindsherpa',
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: '6c717814-8866-46bc-b11f-edeedd1b7a69',
      },
    },
    runtimeVersion: '1.0.0',
    updates: {
      url: 'https://u.expo.dev/6c717814-8866-46bc-b11f-edeedd1b7a69',
    },
  },
};
