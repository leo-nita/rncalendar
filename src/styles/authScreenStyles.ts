import { StyleSheet } from 'react-native';
import { theme } from '../constants/theme';

export const authInputStyles = {
  labelStyle: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: theme.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  inputStyle: {
    borderWidth: 0,
    marginTop: 8,
    backgroundColor: theme.cardAlt,
    borderRadius: 6,
    padding: 14,
    fontSize: 15,
    color: theme.textPrimary,
  },
  containerStyle: {
    marginBottom: 16,
  },
  placeholderTextColor: theme.placeholder,
  selectionColor: theme.accent,
  errorTextStyle: {
    color: theme.error,
  },
};

export const authScreenStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    width: '100%',
    backgroundColor: theme.card,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.textPrimary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: theme.textSecondary,
    marginBottom: 24,
  },
  button: {
    width: '100%',
    backgroundColor: theme.accent,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.textPrimary,
    letterSpacing: 1.2,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: theme.textMuted,
  },
  footerLink: {
    color: theme.accent,
    fontWeight: '600',
  },
});
