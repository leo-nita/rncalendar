import { useEffect, useRef, type RefObject } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import auth from '@react-native-firebase/auth';
import { BACKGROUND_LOCK_TIMEOUT_MS } from '../constants/authStorage';
import { sessionStorage } from '../services/sessionStorage';

type UseBackgroundLockOptions = {
  isAuthenticatedRef: RefObject<boolean>;
  onLockRequired: () => void;
  timeoutMs?: number;
};

const isLeavingForeground = (
  previousState: AppStateStatus,
  nextState: AppStateStatus,
): boolean =>
  previousState === 'active' &&
  (nextState === 'inactive' || nextState === 'background');

const isReturningToForeground = (
  previousState: AppStateStatus,
  nextState: AppStateStatus,
): boolean =>
  nextState === 'active' &&
  (previousState === 'inactive' || previousState === 'background');

export const useBackgroundLock = ({
  isAuthenticatedRef,
  onLockRequired,
  timeoutMs = BACKGROUND_LOCK_TIMEOUT_MS,
}: UseBackgroundLockOptions): void => {
  const backgroundedAtRef = useRef<number | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      const previousState = appStateRef.current;

      if (isLeavingForeground(previousState, nextState)) {
        backgroundedAtRef.current = Date.now();
      }

      if (
        isReturningToForeground(previousState, nextState) &&
        backgroundedAtRef.current !== null
      ) {
        const elapsed = Date.now() - backgroundedAtRef.current;
        backgroundedAtRef.current = null;

        const shouldLock =
          isAuthenticatedRef.current &&
          auth().currentUser !== null &&
          sessionStorage.isBiometricGateEnabled() &&
          elapsed >= timeoutMs;

        if (shouldLock) {
          onLockRequired();
        }
      }

      appStateRef.current = nextState;
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => subscription.remove();
  }, [isAuthenticatedRef, onLockRequired, timeoutMs]);
};
