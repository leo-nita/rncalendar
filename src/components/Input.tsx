import { View, Text, TextInput, StyleSheet } from 'react-native';

type InputFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
};

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
}: InputFieldProps) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        style={[styles.input, error && styles.inputError]}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default InputField;

const styles = StyleSheet.create({
  inputContainer: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
    fontSize: 16,
    color: '#000',
  },
  inputError: {
    borderColor: '#ff4d4f',
  },
  errorText: {
    color: '#ff4d4f',
    fontSize: 12,
    marginTop: 5,
    fontWeight: '400',
  },
});
