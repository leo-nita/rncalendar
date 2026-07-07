import {
  authenticateWithOptions,
  isSensorAvailable,
} from '@sbaiahmed1/react-native-biometrics';

export type BiometricAuthResult = {
  success: boolean;
  error?: string;
  isUserCancelled?: boolean;
  isBiometricUnavailable?: boolean;
};

const WELCOME_BACK_PROMPT = {
  title: 'Welcome back',
  subtitle: 'Verify your identity to continue',
  cancelLabel: 'Use password',
  allowDeviceCredentials: true,
} as const;

const isBiometricAvailable = async (): Promise<boolean> => {
  try {
    const { available } = await isSensorAvailable();
    return !!available;
  } catch {
    return false;
  }
};

export const biometricService = {
  isBiometricAvailable,

  authenticateForUnlock: async (): Promise<BiometricAuthResult> => {
    try {
      const isAvailable = await isBiometricAvailable();

      if (!isAvailable) {
        return {
          success: false,
          error: 'Biometric authentication is not available.',
          isBiometricUnavailable: true,
        };
      }

      const result = await authenticateWithOptions(WELCOME_BACK_PROMPT);

      if (result.success) {
        return { success: true };
      }
      const isCancelled = result.error?.includes('User canceled');

      return {
        success: false,
        error: result.error,
        isUserCancelled: isCancelled,
      };
    } catch {
      return {
        success: false,
        error: 'System error during authentication',
      };
    }
  },
};
