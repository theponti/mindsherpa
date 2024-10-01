import Constants from 'expo-constants'
const { manifest2 } = Constants

export const HOST_URI = manifest2?.extra?.expoClient?.hostUri
  ? `http://${manifest2.extra.expoClient.hostUri.split(':').shift()}:8002`
  : // biome-ignore lint/style/noNonNullAssertion: <explanation>
    process.env.EXPO_PUBLIC_API_ENDPOINT!
