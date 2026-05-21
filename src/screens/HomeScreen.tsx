import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../context/AuthContext';
function HomeScreen() {
  const { logout, userEmail } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
      }}
    >
      <Text>Home Screen</Text>
      <Text>Logged in as: {userEmail}</Text>
      <Button title="Log Out" onPress={logout} />
    </View>
  );
}
export default HomeScreen;
