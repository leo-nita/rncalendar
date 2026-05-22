import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { sessionStorage } from './sessionStorage';

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
    case 'auth/invalid-credential':
      backendMessage = 'Invalid email or password.';
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

const saveAuthSession = async (user: FirebaseAuthTypes.User, email: string) => {
  const token = await user.getIdToken();
  sessionStorage.persistSession(token, email);
  return { user, token };
};

export const authService = {
  signUp: async (email: string, password: string) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email.trim(),
        password,
      );
      return saveAuthSession(userCredential.user, email);
    } catch (error) {
      const msg = handleGlobalBackendError(error as FirebaseErrors);
      throw new Error(msg);
    }
  },

  login: async (email: string, password: string) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email.trim(),
        password,
      );
      return saveAuthSession(userCredential.user, email);
    } catch (error) {
      const msg = handleGlobalBackendError(error as FirebaseErrors);
      throw new Error(msg);
    }
  },

  logout: async () => {
    await auth().signOut();
    sessionStorage.clearSession();
  },
};
