import { offlineExchange } from '@urql/exchange-graphcache';
import { makeAsyncStorage } from '@urql/storage-rn';

// ─────────────────────────────────────────────────────────────────────────────
// ── CONFIG ───────────────────────────────────────────────────────────────────

export const asyncStorage = makeAsyncStorage({
  dataKey: 'graphcache-data', // The AsyncStorage key used for the data (defaults to graphcache-data)
  metadataKey: 'graphcache-metadata', // The AsyncStorage key used for the metadata (defaults to graphcache-metadata)
  maxAge: 7, // How long to persist the data in storage (defaults to 7 days)
});
const config: GraphCacheConfigWithStorage = {
  // keys: {
  //   Focus: () => null,
  //   Goal: () => null,
  //   Action: () => null,
  //   Preference: () => null,
  //   Location: () => null,
  //   Date: () => null,
  // },
  // schema, // for schema awareness
  storage: asyncStorage,
};

export const graphcacheExchange = offlineExchange(config);

// ─────────────────────────────────────────────────────────────────────────────
// ── TYPES ────────────────────────────────────────────────────────────────────

// type GraphCacheConfigWithStorage = GraphCacheConfig & {
//   storage: ReturnType<typeof makeDefaultStorage>;
// };

type GraphCacheConfigWithStorage = {
  storage: ReturnType<typeof makeAsyncStorage>;
};
