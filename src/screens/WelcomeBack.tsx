import { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PrimaryButton from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { biometricService } from '../services/biometricService';

const WelcomeBack = () => {
  const { userEmail, completeBiometricUnlock, goToPasswordLogin } = useAuth();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const didAutoPromptRef = useRef(false);

  const authenticate = useCallback(async () => {
    setIsAuthenticating(true);

    try {
      const result = await biometricService.authenticateForUnlock();

      if (result.success) {
        completeBiometricUnlock();
      }
    } finally {
      setIsAuthenticating(false);
    }
  }, [completeBiometricUnlock]);

  useFocusEffect(
    useCallback(() => {
      if (didAutoPromptRef.current) {
        return;
      }

      didAutoPromptRef.current = true;
      authenticate();
    }, [authenticate]),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      {userEmail ? <Text style={styles.subtitle}>{userEmail}</Text> : null}

      <PrimaryButton
        title="Try again"
        onPress={authenticate}
        loading={isAuthenticating}
        style={styles.button}
      />

      <PrimaryButton
        title="Use password"
        onPress={goToPasswordLogin}
        disabled={isAuthenticating}
        style={styles.secondaryButton}
        textStyle={styles.secondaryButtonText}
      />
    </View>
  );
};

export default WelcomeBack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    marginTop: 8,
  },
  secondaryButton: {
    marginTop: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333',
  },
  secondaryButtonText: {
    color: '#333',
  },
});
