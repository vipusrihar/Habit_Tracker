import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainPage from './MainPage';
import AddHabitForm from '../components/AddHabitForm';
import AuthStack from './AuthStack';
import { LoginContext } from '../LoginContex';
import { View, ActivityIndicator, Text } from 'react-native';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isLoggedIn } = useContext(LoginContext);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ff993f" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return isLoggedIn ? (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={MainPage} />
      <Stack.Screen name="AddForm" component={AddHabitForm} />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthStack} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
