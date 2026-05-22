import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

type InputFieldProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  inputStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorTextStyle?: StyleProp<TextStyle>;
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'style'>;

const InputField = ({
  label,
  value,
  onChangeText,
  error,
  inputStyle,
  containerStyle,
  labelStyle,
  errorTextStyle,
  ...props
}: InputFieldProps) => {
  return (
    <View style={[styles.inputContainer, containerStyle]}>
      {label ? <Text style={[styles.label, labelStyle]}>{label}</Text> : null}

      <TextInput
        {...props}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, error && styles.inputError, inputStyle]}
      />

      {error ? (
        <Text style={[styles.errorText, errorTextStyle]}>{error}</Text>
      ) : null}
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
