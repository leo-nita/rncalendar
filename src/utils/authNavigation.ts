export type AuthNavigatorKey =
  | 'authenticated'
  | 'biometric'
  | 'unauthenticated';

export const getAuthNavigatorKey = (
  isAuthenticated: boolean,
  requiresBiometricUnlock: boolean,
): AuthNavigatorKey => {
  if (isAuthenticated) {
    return 'authenticated';
  }

  if (requiresBiometricUnlock) {
    return 'biometric';
  }

  return 'unauthenticated';
};
