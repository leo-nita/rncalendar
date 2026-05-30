import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import Login from '../screens/Login';
import SignUp from '../screens/Signup';
import WelcomeBack from '../screens/WelcomeBack';
import {
  rootNavigationRef,
  type RootStackParamList,
} from '../utils/authNavigation';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={SignUp} />
      <Stack.Screen name="WelcomeBack" component={WelcomeBack} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <AuthProvider>
      <ToastProvider>
        <NavigationContainer ref={rootNavigationRef}>
          <RootStack />
        </NavigationContainer>
      </ToastProvider>
    </AuthProvider>
  );
}
