import { authExchange as urqlAuthExchange } from '@urql/exchange-auth';

import { isTokenExpired } from './isTokenExpired';

import { getToken } from '~/utils/auth/auth-context';

/**
 * # Urql Auth Exchange
 *
 * Reads from storage and adds the csrf token headers to the outgoing request.
 *
 * @see {@link: https://formidable.com/open-source/urql/docs/advanced/authentication/}
 * @see {@link: https://formidable.com/open-source/urql/docs/api/auth-exchange/}
 *
 */
export const createAuthExchange = (getTokenRef: MaybeGetTokenRef) => {
  return urqlAuthExchange(async (utils) => {
    // ⚠️ WARNING MUTATION
    let token: string | undefined | null;

    return {
      // Appends corresponding authentication header/s to the outgoing request.
      addAuthToOperation(operation) {
        if (!token || !getTokenRef.current) return operation;
        const headers = { authorization: `bearer ${token}` };
        return utils.appendHeaders(operation, headers);
      },

      // ─────────────────────────────────────────────────────

      // async method, sets/updates token, triggered by `willAuthError`/`didAuthError`
      async refreshAuth() {
        if (!getTokenRef.current) return;
        const newToken = await getTokenRef.current();

        if (newToken !== token) {
          console.info('urqlAuthExchange > refreshAuth > token updated');
        }

        token = newToken; // ⚠️ WARNING MUTATION: Update the mutable reference.
      },

      // ─────────────────────────────────────────────────────

      // checks token validity (pre-request), triggers `refreshAuth` if `true`
      willAuthError() {
        // error if token doesn't exist or is expired
        return !token || isTokenExpired(token);
      },

      didAuthError: () => false, // we don't use, but method def is required, so we just return `false`.
    };
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// ── TYPES ────────────────────────────────────────────────────────────────────

type GetToken = Awaited<typeof getToken>;
type MaybeGetTokenRef = React.MutableRefObject<GetToken | undefined>;
