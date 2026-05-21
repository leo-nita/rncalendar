import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { storage } from './storage';
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
      const userCredential = await auth().createUserWithEmailAndPassword(
        email.trim(),
        password,
      );
      const token = await userCredential.user.getIdToken();

      storage.set('userToken', token);
      storage.set('userEmail', email.trim());

      return { user: userCredential.user, token };
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
      const token = await userCredential.user.getIdToken();

      storage.set('userToken', token);
      storage.set('userEmail', email.trim());

      return { user: userCredential.user, token };
    } catch (error) {
      const msg = handleGlobalBackendError(error as FirebaseErrors);
      throw new Error(msg);
    }
  },

  logout: async () => {
    // We still await Firebase logging out over the network...
    await auth().signOut();

    // Fix: MMKV uses deleteKey() to erase individual data fields
    storage.remove('userToken');
    storage.remove('userEmail');
  },
};
