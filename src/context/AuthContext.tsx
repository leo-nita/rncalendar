import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import auth from '@react-native-firebase/auth';
import { authService } from '../services/authService';
import { sessionStorage } from '../services/sessionStorage';
import { useBackgroundLock } from '../hooks/useBackgroundLock';
import {
  resetToLogin,
  resetToMain,
  resetToWelcomeBack,
} from '../utils/authNavigation';

interface AuthContextType {
  isAuthenticated: boolean;
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
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => auth().currentUser !== null,
  );
  const [userEmail, setUserEmail] = useState<string | null>(
    () => sessionStorage.getEmail() ?? auth().currentUser?.email ?? null,
  );

  const lockForBiometric = useCallback(() => {
    setIsAuthenticated(false);
    resetToWelcomeBack();
  }, []);

  useBackgroundLock({
    onLockRequired: lockForBiometric,
  });

  useEffect(() => {
    const cachedEmail = sessionStorage.getEmail();

    if (cachedEmail) {
      setUserEmail(cachedEmail);
      sessionStorage.ensureBiometricPreference();
    }

    const unsubscribe = auth().onAuthStateChanged(user => {
      if (!user) {
        if (sessionStorage.getEmail()) {
          sessionStorage.clearSession();
        }

        setUserEmail(null);
        setIsAuthenticated(false);
        resetToLogin();
        return;
      }

      setIsAuthenticated(true);

      if (user.email) {
        setUserEmail(user.email);
        sessionStorage.persistEmail(user.email);
      }
    });

    return unsubscribe;
  }, []);

  const completeCredentialLogin = useCallback((email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    sessionStorage.enableBiometric();
    resetToMain();
  }, []);

  const completeBiometricUnlock = useCallback(() => {
    if (!auth().currentUser) {
      sessionStorage.clearSession();
      setUserEmail(null);
      setIsAuthenticated(false);
      resetToLogin();
      return;
    }

    setIsAuthenticated(true);
    resetToMain();
  }, []);

  const goToPasswordLogin = useCallback(() => {
    sessionStorage.disableBiometric();
    setIsAuthenticated(false);
    resetToLogin();
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUserEmail(null);
    setIsAuthenticated(false);
    resetToLogin();
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      userEmail,
      completeCredentialLogin,
      completeBiometricUnlock,
      goToPasswordLogin,
      logout,
    }),
    [
      isAuthenticated,
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
