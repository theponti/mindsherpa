import Constants from 'expo-constants'
const { manifest2 } = Constants

export const HOST_URI = manifest2?.extra?.expoClient?.hostUri
  ? `http://${manifest2.extra.expoClient.hostUri.split(':').shift()}:8002`
  : process.env.EXPO_PUBLIC_API_ENDPOINT!

export const GRAPHQL_URI = `${HOST_URI}/graphql`
