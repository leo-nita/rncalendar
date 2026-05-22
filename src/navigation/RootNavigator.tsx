import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Login from '../screens/Login';
import SignUp from '../screens/Signup';
import WelcomeBack from '../screens/WelcomeBack';
import { getAuthNavigatorKey } from '../utils/authNavigation';
import { ToastProvider } from '../context/ToastContext';

const Stack = createNativeStackNavigator();

const AuthLoadingScreen = () => (
  <View style={styles.loading}>
    <Text>Loading...</Text>
  </View>
);

function RootStack() {
  const { isAuthenticated, isLoading, requiresBiometricUnlock } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  const navigatorKey = getAuthNavigatorKey(
    isAuthenticated,
    requiresBiometricUnlock,
  );

  return (
    <Stack.Navigator key={navigatorKey} screenOptions={{ headerShown: false }}>
      {isAuthenticated && <Stack.Screen name="Home" component={HomeScreen} />}
      {!isAuthenticated && requiresBiometricUnlock && (
        <Stack.Screen name="WelcomeBack" component={WelcomeBack} />
      )}
      {!isAuthenticated && !requiresBiometricUnlock && (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Signup" component={SignUp} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <AuthProvider>
      <ToastProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </ToastProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
