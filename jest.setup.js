/* global jest */

jest.mock('@react-native-firebase/auth', () => {
  return () => ({
    createUserWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({
        user: { uid: 'mock-user-123', email: 'test@domain.com' },
      }),
    ),
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({})),
    signOut: jest.fn(() => Promise.resolve({})),
  });
});
