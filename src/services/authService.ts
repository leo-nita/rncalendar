import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

type FirebaseErrors = Pick<
  FirebaseAuthTypes.NativeFirebaseAuthError,
  'code' | 'message'
>;

export const handleGlobalBackendError = (error: FirebaseErrors) => {
  let backendMessage = 'An unexpected error occurred. Please try again.';

  switch (error.code) {
    case 'auth/email-already-in-use':
      backendMessage = 'This email address is already registered.';
      break;
    case 'auth/invalid-email':
      backendMessage = 'The email format is invalid.';
      break;
    case 'auth/weak-password':
      backendMessage = 'The password chosen is too weak.';
      break;
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      backendMessage = 'Invalid email or password.';
      break;
  }
  return backendMessage;
};

export const authService = {
  signUp: async (email: string, password: string) => {
    try {
      return await auth().createUserWithEmailAndPassword(
        email.trim(),
        password,
      );
    } catch (error) {
      handleGlobalBackendError(error as FirebaseErrors);
      throw error;
    }
  },
};
