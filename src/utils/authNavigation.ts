import { createNavigationContainerRef } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  WelcomeBack: undefined;
  Main: undefined;
};

export const rootNavigationRef =
  createNavigationContainerRef<RootStackParamList>();

const resetToRoute = (routeName: keyof RootStackParamList) => {
  if (!rootNavigationRef.isReady()) {
    return;
  }

  rootNavigationRef.reset({
    index: 0,
    routes: [{ name: routeName }],
  });
};

export const resetToLogin = () => resetToRoute('Login');

export const resetToMain = () => resetToRoute('Main');

export const resetToWelcomeBack = () => resetToRoute('WelcomeBack');
