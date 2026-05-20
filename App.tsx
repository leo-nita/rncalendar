import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SignUp from './src/screens/Signup';
// import Login from './src/screens/Login';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SignUp />
      {/* <Login /> */}
    </SafeAreaProvider>
  );
}

export default App;
