import { AUTH_STORAGE_KEYS } from '../constants/authStorage';
import { storage } from './storage';

export const sessionStorage = {
  getToken(): string | undefined {
    return storage.getString(AUTH_STORAGE_KEYS.token);
  },

  persistToken(token: string): void {
    storage.set(AUTH_STORAGE_KEYS.token, token);
  },

  clearSession(): void {
    storage.remove(AUTH_STORAGE_KEYS.token);
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
