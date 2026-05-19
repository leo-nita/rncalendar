import { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import InputField from '../components/Input';
import { validateEmail, validatePassword } from '../utils/validate';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
  };

  const handleSignup = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password, true);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }
    setErrors({ email: '', password: '' });
  };

  return (
    <View style={styles.container}>
      <InputField
        label="Email"
        placeholder="example@domain.com"
        value={email}
        onChangeText={handleEmailChange}
        error={errors.email}
      />

      <InputField
        label="Password"
        placeholder="Minimum 8 characters"
        secureTextEntry
        value={password}
        onChangeText={handlePasswordChange}
        error={errors.password}
      />

      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
});
