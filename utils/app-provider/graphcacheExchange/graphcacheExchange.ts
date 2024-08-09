import { offlineExchange } from '@urql/exchange-graphcache'
import { makeAsyncStorage } from '@urql/storage-rn'

export const asyncStorage = makeAsyncStorage({
  dataKey: 'graphcache-data', // The AsyncStorage key used for the data (defaults to graphcache-data)
  metadataKey: 'graphcache-metadata', // The AsyncStorage key used for the metadata (defaults to graphcache-metadata)
  maxAge: 7, // How long to persist the data in storage (defaults to 7 days)
})

export const graphcacheExchange = offlineExchange({
  keys: {
    focus: () => null,
  },
  storage: asyncStorage,
})
