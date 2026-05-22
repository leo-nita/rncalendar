import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { View } from 'react-native';
import Toast, { ToastVariant } from '../components/Toast';

type ToastMessage = {
  title: string;
  description?: string;
  type: ToastVariant;
  duration?: number;
};

type ActiveToast = ToastMessage & {
  duration: number;
};

type ToastContextType = {
  showToast: (toast: ToastMessage) => void;
  hideToast: () => void;
};

const DEFAULT_DURATION = 3000;

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ActiveToast | null>(null);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback((nextToast: ToastMessage) => {
    setToast({
      duration: DEFAULT_DURATION,
      ...nextToast,
    });
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeout = setTimeout(hideToast, toast.duration);
    return () => clearTimeout(timeout);
  }, [hideToast, toast]);

  const value = useMemo(
    () => ({
      showToast,
      hideToast,
    }),
    [hideToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      <View style={{ flex: 1 }}>
        {children}
        {toast ? (
          <Toast
            title={toast.title}
            description={toast.description}
            type={toast.type}
            onDismiss={hideToast}
          />
        ) : null}
      </View>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }

  return context;
};
