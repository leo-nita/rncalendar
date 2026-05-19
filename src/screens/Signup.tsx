import { useState } from 'react';
import { Button, View, StyleSheet } from 'react-native';
import InputField from '../components/Input';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {};

  return (
    <View style={styles.container}>
      <InputField label={'Email'} value={email} onChangeText={setEmail} />
      <InputField
        label={'Password'}
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Signup" onPress={handleSignup} />
    </View>
  );
};

export default SignUp;
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
});
