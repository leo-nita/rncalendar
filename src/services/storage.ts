import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV({
  id: 'user-auth-storage',
});
