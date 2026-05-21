import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import SignUp from './src/screens/Signup';
import { AuthProvider } from './src/context/AuthContext';
import Login from './src/screens/Login';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AuthProvider>
        <Login />
        {/* <SignUp /> */}
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
