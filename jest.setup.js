/* global jest */

jest.mock('@sbaiahmed1/react-native-biometrics', () => ({
  isSensorAvailable: jest.fn(() => Promise.resolve({ available: false })),
  authenticateWithOptions: jest.fn(() => Promise.resolve({ success: false })),
}));

jest.mock('react-native-mmkv', () => ({
  createMMKV: jest.fn(() => ({
    set: jest.fn(),
    getString: jest.fn(),
    getBoolean: jest.fn(),
    remove: jest.fn(),
    contains: jest.fn(),
    clearAll: jest.fn(),
  })),
}));

jest.mock('@react-native-firebase/auth', () => {
  const mockCurrentUser = { uid: 'mock-user-123', email: 'test@domain.com' };

  const authInstance = {
    currentUser: mockCurrentUser,
    createUserWithEmailAndPassword: jest.fn(() =>
      Promise.resolve({
        user: mockCurrentUser,
      }),
    ),
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({})),
    signOut: jest.fn(() => Promise.resolve({})),
  };

  return () => authInstance;
});

jest.mock('@react-native-firebase/firestore', () => {
  const mockTimestamp = {
    fromDate: jest.fn(date => ({ toDate: () => date })),
  };

  const mockFieldValue = {
    serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP'),
  };

  const createDocRef = id => ({
    id,
    get: jest.fn(() =>
      Promise.resolve({
        exists: true,
        id,
        data: () => ({
          date: mockTimestamp.fromDate(new Date()),
          hour: '10',
          minute: '00',
          details: 'Mock event',
        }),
      }),
    ),
    update: jest.fn(() => Promise.resolve()),
    delete: jest.fn(() => Promise.resolve()),
  });

  const collectionRef = {
    add: jest.fn(() => Promise.resolve(createDocRef('mock-event-id'))),
    get: jest.fn(() => Promise.resolve({ docs: [] })),
    onSnapshot: jest.fn(() => jest.fn()),
    doc: jest.fn(id => createDocRef(id)),
  };

  const firestoreFn = jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        collection: jest.fn(() => collectionRef),
      })),
    })),
  }));

  firestoreFn.Timestamp = mockTimestamp;
  firestoreFn.FieldValue = mockFieldValue;

  return firestoreFn;
});
