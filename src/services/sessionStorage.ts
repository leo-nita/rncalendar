import { AUTH_STORAGE_KEYS } from '../constants/authStorage';
import { storage } from './storage';

export const sessionStorage = {
  getEmail(): string | undefined {
    return storage.getString(AUTH_STORAGE_KEYS.email);
  },

  persistEmail(email: string): void {
    storage.set(AUTH_STORAGE_KEYS.email, email.trim());
  },

  clearSession(): void {
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
