import { useState } from 'react';
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
import { authInputStyles, authScreenStyles } from '../styles/authScreenStyles';
import { useToast } from '../context/ToastContext';
import { type RootStackParamList } from '../utils/authNavigation';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Signup'>>();
  const { completeCredentialLogin } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
  };

  const handleSignup = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password, true);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setErrors({ email: '', password: '' });
    setIsSubmitting(true);

    try {
      await authService.signUp(email, password);
      showToast({
        type: 'success',
        title: 'Account created',
        description: 'You are now signed in.',
      });
      completeCredentialLogin(email.trim());
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Signup failed',
        description:
          error instanceof Error ? error.message : 'Unable to sign up.',
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <Text style={authScreenStyles.title}>SIGN UP</Text>
          <Text style={authScreenStyles.subtitle}>
            Create an account to get started
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
            title="SIGN UP"
            onPress={handleSignup}
            loading={isSubmitting}
            style={authScreenStyles.button}
            textStyle={authScreenStyles.buttonText}
          />

          <Pressable
            style={authScreenStyles.footer}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={authScreenStyles.footerText}>
              Already have an account?{' '}
              <Text style={authScreenStyles.footerLink}>Log in</Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUp;
