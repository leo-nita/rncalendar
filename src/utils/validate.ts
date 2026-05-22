// utils/validate.js

import {
  MAX_HOUR,
  MAX_MINUTE,
  TIME_INPUT_MAX_LENGTH,
} from '../constants/event';

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

export const validateHour = (hour: string) => {
  const digitsOnly = hour.replace(/\D/g, '').slice(0, TIME_INPUT_MAX_LENGTH);
  if (digitsOnly === '') {
    return '';
  }

  if (Number(digitsOnly) > MAX_HOUR) {
    return digitsOnly.slice(0, -1);
  }

  return digitsOnly;
};

export const validateMinute = (minute: string) => {
  const digitsOnly = minute.replace(/\D/g, '').slice(0, TIME_INPUT_MAX_LENGTH);
  if (digitsOnly === '') {
    return '';
  }

  if (Number(digitsOnly) > MAX_MINUTE) {
    return digitsOnly.slice(0, -1);
  }

  return digitsOnly;
};
