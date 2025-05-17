import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import RootNavigator from './navigators/RootNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from './LoginContext';
// import 'react-native-reanimated';
import 'react-native-gesture-handler';
import { LoginContext } from './LoginContex';
import { checkLoginStatus } from './utils/LoginStorage';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

function App(): React.JSX.Element {

   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const loadLoginState = async () => {
      const status = await checkLoginStatus();
      setIsLoggedIn(status);
    };
    loadLoginState();
  }, []);
  return (
      <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </LoginContext.Provider>
  );
}

export default App;
