// utils/validate.js

export const validateEmail = (email: string) => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email.trim())) {
    return 'Please enter a valid email address';
  }

  return '';
};

export const validatePassword = (password: string, isSignUp = false) => {
  if (!password || password.trim() === '') {
    return 'Password is required';
  }

  if (isSignUp && password.length < 8) {
    return 'Password must be at least 8 characters long';
  }

  return '';
};
