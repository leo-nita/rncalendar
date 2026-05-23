import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import auth from '@react-native-firebase/auth';
import { authService } from '../services/authService';
import { sessionStorage } from '../services/sessionStorage';
import { useBackgroundLock } from '../hooks/useBackgroundLock';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  requiresBiometricUnlock: boolean;
  userEmail: string | null;
  completeCredentialLogin: (email: string) => void;
  completeBiometricUnlock: () => void;
  goToPasswordLogin: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [requiresBiometricUnlock, setRequiresBiometricUnlock] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const isAuthenticatedRef = useRef(isAuthenticated);

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  const lockForBiometric = useCallback(() => {
    setIsAuthenticated(false);
    setRequiresBiometricUnlock(true);
  }, []);

  const unlockToApp = useCallback(() => {
    setRequiresBiometricUnlock(false);
    setIsAuthenticated(true);
  }, []);

  const resetToLogin = useCallback(() => {
    setRequiresBiometricUnlock(false);
    setIsAuthenticated(false);
  }, []);

  useBackgroundLock({
    isAuthenticatedRef,
    onLockRequired: lockForBiometric,
  });

  useEffect(() => {
    // Synchronous: read cached email for instant cold-start navigation
    const cachedEmail = sessionStorage.getEmail();

    if (cachedEmail) {
      setUserEmail(cachedEmail);
      sessionStorage.ensureBiometricPreference();

      if (sessionStorage.isBiometricGateEnabled()) {
        lockForBiometric();
      } else {
        resetToLogin();
      }
    }

    setIsLoading(false);

    // Async: Firebase validates the session in background
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (!user) {
        // Only act if there's a cached email — means session expired/revoked,
        // not a normal logout (logout clears MMKV before Firebase fires)
        const currentEmail = sessionStorage.getEmail();
        if (currentEmail) {
          sessionStorage.clearSession();
          setUserEmail(null);
          resetToLogin();
        }
      } else {
        // Firebase is always authoritative for the email value
        setUserEmail(user.email ?? null);
      }
    });

    return unsubscribe;
  }, [lockForBiometric, resetToLogin]);

  const completeCredentialLogin = useCallback((email: string) => {
    setUserEmail(email);
    setRequiresBiometricUnlock(false);
    setIsAuthenticated(true);
    sessionStorage.enableBiometric();
  }, []);

  const completeBiometricUnlock = useCallback(() => {
    unlockToApp();
  }, [unlockToApp]);

  const goToPasswordLogin = useCallback(() => {
    sessionStorage.disableBiometric();
    resetToLogin();
  }, [resetToLogin]);

  const logout = useCallback(async () => {
    await authService.logout();
    setUserEmail(null);
    resetToLogin();
  }, [resetToLogin]);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      requiresBiometricUnlock,
      userEmail,
      completeCredentialLogin,
      completeBiometricUnlock,
      goToPasswordLogin,
      logout,
    }),
    [
      isAuthenticated,
      isLoading,
      requiresBiometricUnlock,
      userEmail,
      completeCredentialLogin,
      completeBiometricUnlock,
      goToPasswordLogin,
      logout,
    ],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
