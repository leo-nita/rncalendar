import { AUTH_STORAGE_KEYS } from '../constants/authStorage';
import { storage } from './storage';

export type StoredSession = {
  token: string;
  email: string;
};

export const sessionStorage = {
  getSession(): StoredSession | null {
    const token = storage.getString(AUTH_STORAGE_KEYS.token);
    const email = storage.getString(AUTH_STORAGE_KEYS.email);

    if (!token || !email) {
      return null;
    }

    return { token, email };
  },

  persistSession(token: string, email: string): void {
    storage.set(AUTH_STORAGE_KEYS.token, token);
    storage.set(AUTH_STORAGE_KEYS.email, email.trim());
    sessionStorage.enableBiometric();
  },

  clearSession(): void {
    storage.remove(AUTH_STORAGE_KEYS.token);
    storage.remove(AUTH_STORAGE_KEYS.email);
    storage.remove(AUTH_STORAGE_KEYS.biometricEnabled);
  },

  ensureBiometricPreference(): void {
    if (storage.getBoolean(AUTH_STORAGE_KEYS.biometricEnabled) === undefined) {
      storage.set(AUTH_STORAGE_KEYS.biometricEnabled, true);
    }
  },

  isBiometricGateEnabled(): boolean {
    return storage.getBoolean(AUTH_STORAGE_KEYS.biometricEnabled) !== false;
  },

  enableBiometric(): void {
    storage.set(AUTH_STORAGE_KEYS.biometricEnabled, true);
  },

  disableBiometric(): void {
    storage.set(AUTH_STORAGE_KEYS.biometricEnabled, false);
  },
};
