import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import PrimaryButton from '../components/Button';
import { theme } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

function ProfileScreen() {
  const { userEmail, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  return (
    <ScreenContainer>
      <View style={styles.card}>
        <Text style={styles.label}>Account</Text>
        <Text style={styles.email}>{userEmail ?? 'Unknown user'}</Text>
      </View>

      <PrimaryButton
        title="LOGOUT"
        onPress={handleLogout}
        loading={isLoggingOut}
        style={styles.logoutButton}
        textStyle={styles.logoutButtonText}
      />
    </ScreenContainer>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  email: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.textPrimary,
  },
  logoutButton: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: theme.surface,
    borderRadius: 8,
    paddingVertical: 14,
  },
  logoutButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.error,
    letterSpacing: 1.2,
  },
});
