import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '../constants/theme';

export type ToastVariant = 'success' | 'error';

type ToastProps = {
  title: string;
  description?: string;
  type: ToastVariant;
  onDismiss: () => void;
};

const Toast = ({ title, description, type, onDismiss }: ToastProps) => {
  return (
    <Pressable
      accessibilityRole="alert"
      onPress={onDismiss}
      style={[styles.toast, styles[type]]}
    >
      <Text style={styles.title}>{title}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
    </Pressable>
  );
};

export default Toast;

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    zIndex: 10,
    elevation: 10,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  success: {
    backgroundColor: theme.success,
  },
  error: {
    backgroundColor: theme.error,
  },
  title: {
    color: theme.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  description: {
    color: theme.textPrimary,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 4,
  },
});
