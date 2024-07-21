import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage';
import { offlineExchange } from '@urql/exchange-graphcache';
// import schema from '@prolog/schema/introspection';
// import { type GraphCacheConfig } from '@prolog/schema/cache-config';

// ─────────────────────────────────────────────────────────────────────────────
// ── CONFIG ───────────────────────────────────────────────────────────────────
export const offlineStorage = makeDefaultStorage();
const config: GraphCacheConfigWithStorage = {
  // keys: {},
  // schema, // for schema awareness
  storage: offlineStorage,
};

export const graphcacheExchange = offlineExchange(config);

// ─────────────────────────────────────────────────────────────────────────────
// ── TYPES ────────────────────────────────────────────────────────────────────

// type GraphCacheConfigWithStorage = GraphCacheConfig & {
//   storage: ReturnType<typeof makeDefaultStorage>;
// };

type GraphCacheConfigWithStorage = {
  storage: ReturnType<typeof makeDefaultStorage>;
};
