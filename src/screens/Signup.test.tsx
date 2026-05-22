import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import SignUp from './Signup';
import { validateEmail, validatePassword } from '../utils/validate';
import { AuthProvider } from '../context/AuthContext';

jest.mock('../utils/validate', () => ({
  validateEmail: jest.fn(),
  validatePassword: jest.fn(),
}));

jest.mock('../services/sessionStorage', () => ({
  sessionStorage: {
    getSession: jest.fn(() => null),
    ensureBiometricPreference: jest.fn(),
    isBiometricGateEnabled: jest.fn(() => false),
  },
}));

jest.mock('../hooks/useBackgroundLock', () => ({
  useBackgroundLock: jest.fn(),
}));

const renderSignUp = () =>
  render(
    <AuthProvider>
      <NavigationContainer>
        <SignUp />
      </NavigationContainer>
    </AuthProvider>,
  );

describe('SignUp Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all fields and signup button', () => {
    const { getByPlaceholderText, getByText } = renderSignUp();

    expect(getByPlaceholderText('example@domain.com')).toBeTruthy();
    expect(getByPlaceholderText('Minimum 8 characters')).toBeTruthy();
    expect(getByText('SIGN UP')).toBeTruthy();
  });

  it('updates input values correctly', () => {
    const { getByPlaceholderText } = renderSignUp();

    const emailInput = getByPlaceholderText('example@domain.com');
    const passwordInput = getByPlaceholderText('Minimum 8 characters');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('shows validation errors when inputs are invalid', () => {
    (validateEmail as jest.Mock).mockReturnValue('Invalid email');
    (validatePassword as jest.Mock).mockReturnValue('Password is too short');

    const { getByText } = renderSignUp();

    fireEvent.press(getByText('SIGN UP'));

    expect(validateEmail).toHaveBeenCalledWith('');
    expect(validatePassword).toHaveBeenCalledWith('', true);

    expect(getByText('Invalid email')).toBeTruthy();
    expect(getByText('Password is too short')).toBeTruthy();
  });

  it('clears errors when inputs become valid', () => {
    (validateEmail as jest.Mock)
      .mockReturnValueOnce('Invalid email')
      .mockReturnValueOnce('');

    (validatePassword as jest.Mock)
      .mockReturnValueOnce('Password is too short')
      .mockReturnValueOnce('');

    const { getByText, getByPlaceholderText, queryByText } = renderSignUp();

    fireEvent.press(getByText('SIGN UP'));

    expect(getByText('Invalid email')).toBeTruthy();
    expect(getByText('Password is too short')).toBeTruthy();

    fireEvent.changeText(
      getByPlaceholderText('example@domain.com'),
      'valid@example.com',
    );

    fireEvent.changeText(
      getByPlaceholderText('Minimum 8 characters'),
      'password123',
    );

    expect(queryByText('Invalid email')).toBeNull();
    expect(queryByText('Password is too short')).toBeNull();
  });
});
