// NOTE: this requires a polyfill for `atob` which is being added in the root index.js file
import { isPast } from 'date-fns';
import { jwtDecode, type JwtPayload } from 'jwt-decode';

export function isTokenExpired(jwt: string): boolean {
  const claims: JwtPayload = jwtDecode(jwt);
  if (!claims.exp) throw new Error('Token has no expiration');

  const expirationTime = new Date(claims.exp * 1000); // Convert to JavaScript Date object
  const isExpired = isPast(expirationTime);

  if (isExpired) {
    console.info('isTokenExpired > isExpired:', isExpired, { expirationTime });
  }

  return isExpired;
}
