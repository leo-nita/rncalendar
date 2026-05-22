import { useState, useTransition } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { authService } from '../services/authService';
import InputField from '../components/Input';
import PrimaryButton from '../components/Button';
import { validateEmail, validatePassword } from '../utils/validate';
import { useAuth } from '../context/AuthContext';
import { authInputStyles, authScreenStyles } from '../styles/authScreenStyles';
import { useToast } from '../context/ToastContext';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const Login = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { completeCredentialLogin } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const [isPending, startTransition] = useTransition();

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
  };

  const handleLogin = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password, false);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setErrors({ email: '', password: '' });

    startTransition(async () => {
      try {
        await authService.login(email, password);
        showToast({
          type: 'success',
          title: 'Login successful',
          description: 'Welcome back.',
        });
        completeCredentialLogin(email.trim());
      } catch (error) {
        showToast({
          type: 'error',
          title: 'Login failed',
          description:
            error instanceof Error ? error.message : 'Unable to log in.',
        });
      }
    });
  };

  return (
    <KeyboardAvoidingView
      style={authScreenStyles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={authScreenStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={authScreenStyles.card}>
          <Text style={authScreenStyles.title}>LOGIN</Text>
          <Text style={authScreenStyles.subtitle}>
            Sign in to manage your calendar
          </Text>

          <InputField
            label="Email"
            placeholder="example@domain.com"
            value={email}
            onChangeText={handleEmailChange}
            error={errors.email}
            autoCapitalize="none"
            keyboardType="email-address"
            {...authInputStyles}
          />

          <InputField
            label="Password"
            placeholder="Minimum 8 characters"
            secureTextEntry
            value={password}
            onChangeText={handlePasswordChange}
            error={errors.password}
            {...authInputStyles}
          />

          <PrimaryButton
            title="LOG IN"
            onPress={handleLogin}
            loading={isPending}
            style={authScreenStyles.button}
            textStyle={authScreenStyles.buttonText}
          />

          <Pressable
            style={authScreenStyles.footer}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={authScreenStyles.footerText}>
              Don&apos;t have an account?{' '}
              <Text style={authScreenStyles.footerLink}>Sign up</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
